// handle(고유 ID) 규칙 — 영문 소문자·숫자·_ 3~20자. members/profile 공용.
export const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

export const isValidHandle = (handle: string): boolean => HANDLE_RE.test(handle.trim());

// 초대 코드/토큰 — 영숫자·_- 4~64자. 외부 입력(딥링크/수기입력) 검증용.
export const INVITE_CODE_RE = /^[A-Za-z0-9_-]{4,64}$/;
export const isValidInviteCode = (code: string): boolean => INVITE_CODE_RE.test(code.trim());
