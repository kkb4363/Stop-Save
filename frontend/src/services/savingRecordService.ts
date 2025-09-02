import type {
  SavingRecord,
  SavingRecordRequest,
  CategoryStats,
} from "../types/user";

const API_BASE_URL = "http://localhost:8080/api/savings";

class SavingRecordService {
  // 절약 기록 등록
  async createSavingRecord(
    request: SavingRecordRequest
  ): Promise<SavingRecord> {
    const response = await fetch(`${API_BASE_URL}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "절약 기록 등록에 실패했습니다.");
    }

    return response.json();
  }

  // 사용자별 절약 기록 조회
  async getUserSavingRecords(userId: number): Promise<SavingRecord[]> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("절약 기록을 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 오늘의 절약 기록
  async getTodaySavingRecords(userId: number): Promise<SavingRecord[]> {
    const response = await fetch(`${API_BASE_URL}/today/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("오늘의 절약 기록을 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 이번 달 절약 기록
  async getThisMonthSavingRecords(userId: number): Promise<SavingRecord[]> {
    const response = await fetch(`${API_BASE_URL}/month/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("이번 달 절약 기록을 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 총 절약 금액 조회
  async getTotalSavingsAmount(userId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/total/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("총 절약 금액을 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 카테고리별 통계
  async getCategorySavingsStats(userId: number): Promise<CategoryStats[]> {
    const response = await fetch(`${API_BASE_URL}/stats/category/${userId}`, {
      method: "GET",
      credentials: "include",
    });

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

  // 절약 기록 삭제
  async deleteSavingRecord(recordId: number, userId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${recordId}/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "절약 기록 삭제에 실패했습니다.");
    }
  }
}

export const savingRecordService = new SavingRecordService();
