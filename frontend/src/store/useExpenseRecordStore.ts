import { create } from "zustand";
import { expenseRecordService } from "../services/expenseRecordService";
import type { ExpenseRecord, RecordInfo, CategoryStats } from "../types/user";
import { useAuthStore } from "./useAuthStore";

interface ExpenseRecordState {
  // 데이터
  records: ExpenseRecord[];
  todayRecords: RecordInfo | null;
  monthRecords: RecordInfo | null;
  latestRecords: ExpenseRecord[];
  weekRecords: { [key: string]: number }[];
  categoryStats: CategoryStats[];

  // 로딩 상태
  isLoading: boolean;

  // 액션들
  fetchAllRecords: () => Promise<void>;
  fetchTodayRecords: () => Promise<void>;
  fetchMonthRecords: () => Promise<void>;
  fetchLatestRecords: () => Promise<void>;
  fetchWeekRecords: () => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
  createRecord: (record: {
    itemName: string;
    amount: number;
    category: string;
    memo?: string;
  }) => Promise<void>;
  deleteRecord: (recordId: number) => Promise<void>;

  // 초기화
  reset: () => void;
}

export const useExpenseRecordStore = create<ExpenseRecordState>((set, get) => ({
  // 초기 상태
  records: [],
  todayRecords: null,
  monthRecords: null,
  latestRecords: [],
  weekRecords: [],
  categoryStats: [],
  isLoading: false,

  // 전체 소비 기록 조회
  fetchAllRecords: async () => {
    try {
      set({ isLoading: true });
      const records = await expenseRecordService.getAllRecords();
      set({ records, isLoading: false });
    } catch (error) {
      console.error("전체 소비 기록 조회 실패:", error);
      set({ isLoading: false });
    }
  },

  // 오늘 소비 기록 조회
  fetchTodayRecords: async () => {
    try {
      const todayRecords = await expenseRecordService.getTodayRecords();
      set({ todayRecords });
    } catch (error) {
      console.error("오늘 소비 기록 조회 실패:", error);
      set({ todayRecords: null });
    }
  },

  // 이번달 소비 기록 조회
  fetchMonthRecords: async () => {
    try {
      const monthRecords = await expenseRecordService.getMonthRecords();
      set({ monthRecords });
    } catch (error) {
      console.error("이번달 소비 기록 조회 실패:", error);
      set({ monthRecords: null });
    }
  },

  // 최근 소비 기록 조회
  fetchLatestRecords: async () => {
    try {
      const latestRecords = await expenseRecordService.getLatestRecords();
      set({ latestRecords });
    } catch (error) {
      console.error("최근 소비 기록 조회 실패:", error);
      set({ latestRecords: [] });
    }
  },

  // 일주일 소비 통계 조회
  fetchWeekRecords: async () => {
    try {
      const weekRecords = await expenseRecordService.getWeekRecords();
      set({ weekRecords });
    } catch (error) {
      console.error("일주일 소비 통계 조회 실패:", error);
      set({ weekRecords: [] });
    }
  },

  // 카테고리별 통계 조회
  fetchCategoryStats: async () => {
    try {
      const categoryStats =
        await expenseRecordService.getCategorySavingsStats();
      set({ categoryStats });
    } catch (error) {
      console.error("카테고리별 소비 통계 조회 실패:", error);
      set({ categoryStats: [] });
    }
  },

  // 소비 기록 생성
  createRecord: async (record) => {
    try {
      set({ isLoading: true });

      // 임시 userId (실제로는 JWT에서 추출됨)
      const recordRequest = {
        ...record,
        userId: 1, // 백엔드에서 JWT로 사용자 식별
      };

      await expenseRecordService.createExpenseRecord(recordRequest);

      // 모든 관련 데이터 새로고침
      const {
        fetchTodayRecords,
        fetchMonthRecords,
        fetchLatestRecords,
        fetchWeekRecords,
        fetchCategoryStats,
        fetchAllRecords,
      } = get();

      await Promise.all([
        fetchTodayRecords(),
        fetchMonthRecords(),
        fetchLatestRecords(),
        fetchWeekRecords(),
        fetchCategoryStats(),
        fetchAllRecords(),
      ]);

      // 사용자 정보도 새로고침 (totalExpenses 등이 있다면)
      await useAuthStore.getState().getCurrentUser();

      set({ isLoading: false });
    } catch (error) {
      console.error("소비 기록 생성 실패:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 소비 기록 삭제
  deleteRecord: async (recordId: number) => {
    try {
      set({ isLoading: true });

      // 로컬 상태에서 먼저 제거
      const currentRecords = get().records;
      const updatedRecords = currentRecords.filter(
        (record) => record.id !== recordId
      );
      set({ records: updatedRecords });

      // 백엔드에서 삭제
      await expenseRecordService.deleteExpenseRecord(recordId);

      // 모든 관련 데이터 새로고침
      const {
        fetchTodayRecords,
        fetchMonthRecords,
        fetchLatestRecords,
        fetchWeekRecords,
        fetchCategoryStats,
        fetchAllRecords,
      } = get();

      await Promise.all([
        fetchTodayRecords(),
        fetchMonthRecords(),
        fetchLatestRecords(),
        fetchWeekRecords(),
        fetchCategoryStats(),
        fetchAllRecords(),
      ]);

      // 사용자 정보도 새로고침
      await useAuthStore.getState().getCurrentUser();

      set({ isLoading: false });
    } catch (error) {
      console.error("소비 기록 삭제 실패:", error);
      // 삭제 실패 시 원래 상태로 복원
      get().fetchAllRecords();
      set({ isLoading: false });
      throw error;
    }
  },

  // 스토어 초기화
  reset: () => {
    set({
      records: [],
      todayRecords: null,
      monthRecords: null,
      latestRecords: [],
      weekRecords: [],
      categoryStats: [],
      isLoading: false,
    });
  },
}));
