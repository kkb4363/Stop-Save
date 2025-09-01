import { create } from "zustand";

export type SavingCategory = "음식" | "교통" | "쇼핑" | "엔터테인먼트" | "기타";

export interface SavingRecord {
  id: string;
  amount: number;
  category: SavingCategory;
  memo?: string;
  createdAt: string;
}

export interface SavingsState {
  records: SavingRecord[];
  balance: number;
  level: number;
  experience: number;
  addRecord: (input: Omit<SavingRecord, "id" | "createdAt">) => void;
}

export const useSavingsStore = create<SavingsState>((set, get) => ({
  records: [],
  balance: 0,
  level: 1,
  experience: 0,
  addRecord: (input) => {
    const newRecord: SavingRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };

    const nextBalance = get().balance + newRecord.amount;
    const nextExperience =
      get().experience + Math.max(1, Math.floor(newRecord.amount / 1000));

    // 간단한 레벨업 규칙: 레벨 * 100 XP 필요
    let level = get().level;
    let experience = nextExperience;
    while (experience >= level * 100) {
      experience -= level * 100;
      level += 1;
    }

    set((state) => ({
      records: [newRecord, ...state.records],
      balance: nextBalance,
      experience,
      level,
    }));
  },
}));
