import { create } from 'zustand';

interface CategoryState {
  hidden: string[]; // 숨긴 카테고리 value 목록
  toggle: (category: string) => void;
}

// ⚠️ 로컬(세션) — 거래 입력/예산에서 숨길 카테고리 관리
export const useCategoryStore = create<CategoryState>((set, get) => ({
  hidden: [],
  toggle: (category) =>
    set({ hidden: get().hidden.includes(category) ? get().hidden.filter((c) => c !== category) : [...get().hidden, category] }),
}));
