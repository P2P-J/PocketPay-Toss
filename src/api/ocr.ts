import { API_BASE_URL, REQUEST_TIMEOUT } from '../constants/config';
import { useAuthStore } from '../store/authStore';

// 백엔드 /ocr/analyze 응답 data (NCP Clova → 영수증 추출)
export interface OcrResult {
  storeInfo: string; // 상호명 (없으면 'N/A')
  price: number; // 총액 (없으면 0)
  date: string | null; // YYYY-MM-DD
  businessNumber: string; // 사업자번호 (없으면 'N/A')
  receiptUrl: string | null; // 업로드된 영수증 이미지 URL
}

export interface ReceiptImage {
  uri: string;
  name?: string;
  type?: string;
}

// 영수증 이미지를 백엔드(Clova OCR)로 보내 거래처/금액/날짜를 추출한다.
// 멀티파트 필드명은 'file' (백엔드 multer.single("file")). 인증 필요(Bearer).
export async function analyzeReceipt(image: ReceiptImage): Promise<OcrResult> {
  const token = useAuthStore.getState().accessToken;

  const form = new FormData();
  // RN FormData의 파일 객체 — DOM 타입과 달라 Blob으로 캐스팅
  form.append('file', { uri: image.uri, name: image.name ?? 'receipt.jpg', type: image.type ?? 'image/jpeg' } as unknown as Blob);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const res = await fetch(`${API_BASE_URL}/ocr/analyze`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form as unknown as RequestInit['body'],
      signal: controller.signal as unknown as RequestInit['signal'],
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message || '영수증 분석에 실패했어요.');
    }
    const json = (await res.json()) as { data: OcrResult };
    return json.data;
  } finally {
    clearTimeout(timer);
  }
}
