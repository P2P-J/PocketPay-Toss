// handle(고유 ID) 규칙 — 영문 소문자·숫자·_ 3~20자. members/profile 공용.
export const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

export const isValidHandle = (handle: string): boolean => HANDLE_RE.test(handle.trim());
