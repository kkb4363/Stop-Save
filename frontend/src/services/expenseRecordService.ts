import { API_BASE_URL_BUILD } from "../constants/api";
import { apiClient } from "../utils/apiClient";
import type {
  CategoryStats,
  RecordInfo,
  ExpenseRecordRequest,
  ExpenseRecord,
} from "../types/user";

const API_BASE_URL = `${API_BASE_URL_BUILD}/api/expense`;

class ExpenseRecordService {
  // 소비 기록 등록
  async createExpenseRecord(
    request: ExpenseRecordRequest
  ): Promise<ExpenseRecord> {
    const response = await apiClient.post(`${API_BASE_URL}/record`, request);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "소비 기록 등록에 실패했습니다.");
    }

    return response.json();
  }

  // 전체 소비 조회
  async getAllRecords(): Promise<ExpenseRecord[]> {
    const res = await apiClient.get(`${API_BASE_URL}/all`);

    if (!res.ok) {
      throw new Error("전체 소비를 가져올 수 없습니다.");
    }

    return res.json();
  }

  // 오늘 소비 조회
  async getTodayRecords(): Promise<RecordInfo> {
    const res = await apiClient.get(`${API_BASE_URL}/today`);

    if (!res.ok) {
      throw new Error("오늘의 소비을 가져올 수 없습니다.");
    }

    return res.json();
  }

  // 이번달 절약 조회
  async getMonthRecords(): Promise<RecordInfo> {
    const res = await apiClient.get(`${API_BASE_URL}/month`);

    if (!res.ok) {
      throw new Error("이번달 절약을 가져올 수 없습니다.");
    }

    return res.json();
  }

  // 최근 3가지 소비 기록
  async getLatestRecords(): Promise<ExpenseRecord[]> {
    const res = await apiClient.get(`${API_BASE_URL}/latest`);

    if (!res.ok) {
      throw new Error("최근 소비 기록을 가져올 수 없습니다.");
    }
    return res.json();
  }

  // 일주일 소비 통계
  async getWeekRecords(): Promise<{ [key: string]: number }[]> {
    const response = await apiClient.get(`${API_BASE_URL}/week`);

    if (!response.ok) {
      throw new Error("최근 일주일 소비 통계를 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 카테고리별 통계
  async getCategorySavingsStats(): Promise<CategoryStats[]> {
    const response = await apiClient.get(`${API_BASE_URL}/category`);

    if (!response.ok) {
      throw new Error("카테고리별 통계를 가져올 수 없습니다.");
    }

    const rawStats: [string, number, number][] = await response.json();

    // 백엔드에서 반환하는 Object[] 형태를 CategoryStats로 변환
    return rawStats.map(([category, amount, count]) => ({
      category,
      amount,
      count,
    }));
  }

  // 소비 기록 삭제
  async deleteExpenseRecord(recordId: number): Promise<void> {
    const response = await apiClient.delete(`${API_BASE_URL}/${recordId}`);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "소비 기록 삭제에 실패했습니다.");
    }
  }
}

export const expenseRecordService = new ExpenseRecordService();
