import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SavingRecord,
  SavingRecordRequest,
  CategoryStats,
  RecordInfo,
} from "../types/user";
import { savingRecordService } from "../services/savingRecordService";

interface SavingRecordState {
  records: SavingRecord[];
  todayRecords: RecordInfo;
  monthRecords: RecordInfo;
  latestRecords: SavingRecord[];
  weekRecords: { [key: string]: number }[];
  categoryStats: CategoryStats[];
  isLoading: boolean;
  error: string | null;

  // 액션들
  createRecord: (request: SavingRecordRequest) => Promise<void>;
  fetchTodayRecords: () => Promise<void>;
  fetchMonthRecords: () => Promise<void>;
  fetchWeekRecords: () => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
  fetchLatestRecords: () => Promise<void>;
  fetchAllRecords: () => Promise<void>;
  // deleteRecord: (recordId: number, userId: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSavingRecordStore = create<SavingRecordState>()(
  persist(
    (set, get) => ({
      records: [],
      todayRecords: {},
      monthRecords: {},
      latestRecords: [],
      weekRecords: [],
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
          const currentRecords = get().records || [];
          set({
            records: [newRecord, ...currentRecords],
            isLoading: false,
          });
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

      fetchAllRecords: async () => {
        try {
          const records = await savingRecordService.getAllRecords();
          set({ records });
        } catch (error) {
          console.error("전체 절약 조회 실패:", error);
        }
      },

      fetchTodayRecords: async () => {
        try {
          const todayRecords = await savingRecordService.getTodayRecords();
          set({ todayRecords });
        } catch (error) {
          console.error("오늘의 절약 조회 실패:", error);
        }
      },

      fetchMonthRecords: async () => {
        try {
          const monthRecords = await savingRecordService.getMonthRecords();
          set({ monthRecords });
        } catch (error) {
          console.error("이번 달 절약 조회 실패:", error);
        }
      },

      fetchLatestRecords: async () => {
        try {
          const latestRecords = await savingRecordService.getLatestRecords();
          set({ latestRecords });
        } catch (error) {
          console.error("최근 절약 목록 조회 실패:", error);
        }
      },

      fetchWeekRecords: async () => {
        try {
          const weekRecords = await savingRecordService.getWeekRecords();
          set({ weekRecords });
        } catch (error) {
          console.error("일주일 절약 목록 조회 실패:", error);
        }
      },

      fetchCategoryStats: async () => {
        try {
          const categoryStats =
            await savingRecordService.getCategorySavingsStats();
          set({ categoryStats });
        } catch (error) {
          console.error("카테고리별 절약 조회 실패:", error);
        }
      },

      // deleteRecord: async (recordId: number, userId: number) => {
      //   try {
      //     set({ isLoading: true, error: null });
      //     await savingRecordService.deleteSavingRecord(recordId, userId);

      //     // 기존 기록에서 삭제된 기록 제거
      //     const currentRecords = get().records;
      //     set({
      //       records: currentRecords.filter((record) => record.id !== recordId),
      //       isLoading: false,
      //     });

      //     // 관련 데이터 새로고침
      //     get().fetchTodayAmount(userId);
      //     get().fetchMonthRecords(userId);
      //     get().fetchTotalAmount(userId);
      //     get().fetchCategoryStats(userId);
      //   } catch (error) {
      //     set({
      //       isLoading: false,
      //       error:
      //         error instanceof Error
      //           ? error.message
      //           : "절약 기록 삭제에 실패했습니다.",
      //     });
      //     throw error;
      //   }
      // },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "saving-record-storage",
      partialize: (state) => ({
        records: state.records,
        todayRecords: state.todayRecords,
        monthRecords: state.monthRecords,
        latestRecords: state.latestRecords,
        weekRecords: state.weekRecords,
        categoryStats: state.categoryStats,
      }),
    }
  )
);
