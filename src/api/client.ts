import { API_BASE_URL, REQUEST_TIMEOUT } from '../constants/config';

// authStore를 lazy 연결하여 순환 참조 방지.
// 토스 로그인으로 받은 토큰도 동일한 자체 JWT(accessToken/refreshToken) 체계를 쓴다.
let getAuthState:
  | (() => {
      accessToken: string | null;
      refreshToken: string | null;
      setAccessToken: (t: string) => Promise<void> | void;
      logout: () => void;
    })
  | null = null;

export function setAuthStateGetter(getter: typeof getAuthState) {
  getAuthState = getter;
}

interface ApiError extends Error {
  status?: number;
  errors?: unknown;
}

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAuthState?.()?.accessToken;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const fetchWithTimeout = (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  return fetch(url, { ...options, signal: controller.signal as unknown as RequestInit['signal'] })
    .catch((err) => {
      if (err.name === 'AbortError') {
        const error: ApiError = new Error('요청 시간이 초과됐어요. 네트워크를 확인해주세요.');
        error.status = 408;
        throw error;
      }
      const error: ApiError = new Error('서버에 연결할 수 없어요. 인터넷 연결을 확인해주세요.');
      error.status = 0;
      throw error;
    })
    .finally(() => clearTimeout(timeout));
};

let refreshPromise: Promise<string | null> | null = null;

const tryRefreshToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getAuthState?.()?.refreshToken;
  if (!refreshToken) return null;

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = (await res.json()) as { accessToken?: string };
      return data.accessToken || null;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const handleResponse = async (
  response: Response,
  retryFn: (() => Promise<unknown>) | null
): Promise<unknown> => {
  if (response.status === 401) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
      errors?: unknown;
    };

    // 401이면 refresh 시도. 재시도(retryFn=null) 중에도 401이면 다시 들어오지 않음(무한루프 방지).
    if (retryFn) {
      const newAccessToken = await tryRefreshToken();
      if (newAccessToken) {
        await getAuthState?.()?.setAccessToken(newAccessToken);
        return retryFn();
      }
    }

    getAuthState?.()?.logout();
    const error: ApiError = new Error(errorData.message || '인증이 만료됐어요.');
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
      errors?: unknown;
    };
    const error: ApiError = new Error(
      errorData.error || errorData.message || '요청 처리 중 오류가 발생했어요.'
    );
    error.status = response.status;
    error.errors = errorData.errors;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};

const request = async (
  method: string,
  endpoint: string,
  body?: unknown,
  isRetry = false
): Promise<unknown> => {
  const options: RequestInit = { method, headers: getHeaders() };
  if (body && method !== 'GET') options.body = JSON.stringify(body);

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetchWithTimeout(url, options);
  const retryFn = isRetry ? null : () => request(method, endpoint, body, true);
  return handleResponse(response, retryFn);
};

// 멀티파트 업로드(OCR 등) — Content-Type은 boundary 자동 설정 위해 비움. 401 리프레시 공유.
const requestForm = async (endpoint: string, form: FormData, isRetry = false): Promise<unknown> => {
  const headers: Record<string, string> = {};
  const token = getAuthState?.()?.accessToken;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: form as unknown as RequestInit['body'],
  });
  const retryFn = isRetry ? null : () => requestForm(endpoint, form, true);
  return handleResponse(response, retryFn);
};

export const apiClient = {
  get: (endpoint: string) => request('GET', endpoint),
  post: (endpoint: string, body?: unknown) => request('POST', endpoint, body),
  put: (endpoint: string, body?: unknown) => request('PUT', endpoint, body),
  patch: (endpoint: string, body?: unknown) => request('PATCH', endpoint, body),
  delete: (endpoint: string) => request('DELETE', endpoint),
  postForm: (endpoint: string, form: FormData) => requestForm(endpoint, form),
};
