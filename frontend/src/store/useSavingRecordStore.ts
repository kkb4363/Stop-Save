import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SavingRecord,
  SavingRecordRequest,
  CategoryStats,
} from "../types/user";
import { savingRecordService } from "../services/savingRecordService";

interface SavingRecordState {
  records: SavingRecord[];
  todayRecords: SavingRecord[];
  monthRecords: SavingRecord[];
  totalAmount: number;
  categoryStats: CategoryStats[];
  isLoading: boolean;
  error: string | null;

  // 액션들
  createRecord: (request: SavingRecordRequest) => Promise<void>;
  fetchUserRecords: (userId: number) => Promise<void>;
  fetchTodayRecords: (userId: number) => Promise<void>;
  fetchMonthRecords: (userId: number) => Promise<void>;
  fetchTotalAmount: (userId: number) => Promise<void>;
  fetchCategoryStats: (userId: number) => Promise<void>;
  deleteRecord: (recordId: number, userId: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSavingRecordStore = create<SavingRecordState>()(
  persist(
    (set, get) => ({
      records: [],
      todayRecords: [],
      monthRecords: [],
      totalAmount: 0,
      categoryStats: [],
      isLoading: false,
      error: null,

      createRecord: async (request: SavingRecordRequest) => {
        try {
          set({ isLoading: true, error: null });
          const newRecord = await savingRecordService.createSavingRecord(
            request
          );

          // 기존 기록에 새 기록 추가
          const currentRecords = get().records;
          set({
            records: [newRecord, ...currentRecords],
            isLoading: false,
          });

          // 관련 데이터 새로고침
          get().fetchTodayRecords(request.userId);
          get().fetchMonthRecords(request.userId);
          get().fetchTotalAmount(request.userId);
          get().fetchCategoryStats(request.userId);
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "절약 기록 등록에 실패했습니다.",
          });
          throw error;
        }
      },

      fetchUserRecords: async (userId: number) => {
        try {
          set({ isLoading: true, error: null });
          const records = await savingRecordService.getUserSavingRecords(
            userId
          );
          set({
            records,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "절약 기록을 가져올 수 없습니다.",
          });
        }
      },

      fetchTodayRecords: async (userId: number) => {
        try {
          const todayRecords = await savingRecordService.getTodaySavingRecords(
            userId
          );
          set({ todayRecords });
        } catch (error) {
          console.error("오늘의 절약 기록 조회 실패:", error);
        }
      },

      fetchMonthRecords: async (userId: number) => {
        try {
          const monthRecords =
            await savingRecordService.getThisMonthSavingRecords(userId);
          set({ monthRecords });
        } catch (error) {
          console.error("이번 달 절약 기록 조회 실패:", error);
        }
      },

      fetchTotalAmount: async (userId: number) => {
        try {
          const totalAmount = await savingRecordService.getTotalSavingsAmount(
            userId
          );
          set({ totalAmount });
        } catch (error) {
          console.error("총 절약 금액 조회 실패:", error);
        }
      },

      fetchCategoryStats: async (userId: number) => {
        try {
          const categoryStats =
            await savingRecordService.getCategorySavingsStats(userId);
          set({ categoryStats });
        } catch (error) {
          console.error("카테고리별 통계 조회 실패:", error);
        }
      },

      deleteRecord: async (recordId: number, userId: number) => {
        try {
          set({ isLoading: true, error: null });
          await savingRecordService.deleteSavingRecord(recordId, userId);

          // 기존 기록에서 삭제된 기록 제거
          const currentRecords = get().records;
          set({
            records: currentRecords.filter((record) => record.id !== recordId),
            isLoading: false,
          });

          // 관련 데이터 새로고침
          get().fetchTodayRecords(userId);
          get().fetchMonthRecords(userId);
          get().fetchTotalAmount(userId);
          get().fetchCategoryStats(userId);
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "절약 기록 삭제에 실패했습니다.",
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "saving-record-storage",
      partialize: (state) => ({
        records: state.records,
        todayRecords: state.todayRecords,
        monthRecords: state.monthRecords,
        totalAmount: state.totalAmount,
        categoryStats: state.categoryStats,
      }),
    }
  )
);
