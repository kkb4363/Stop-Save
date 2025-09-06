import { API_BASE_URL_BUILD, API_BASE_URL_DEV } from "../constants/api";
import type {
  SavingRecord,
  SavingRecordRequest,
  CategoryStats,
  RecordInfo,
} from "../types/user";

const API_BASE_URL = `${API_BASE_URL_BUILD}/api/savings`;

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

  // 전체 절약 조회
  async getAllRecords(): Promise<SavingRecord[]> {
    const res = await fetch(`${API_BASE_URL}/all`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("전체 절약을 가져올 수 없습니다.");
    }

    return res.json();
  }

  // 오늘 절약 조회
  async getTodayRecords(): Promise<RecordInfo> {
    const res = await fetch(`${API_BASE_URL}/today`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("오늘의 절약을 가져올 수 없습니다.");
    }

    return res.json();
  }

  // 이번달 절약 조회
  async getMonthRecords(): Promise<RecordInfo> {
    const res = await fetch(`${API_BASE_URL}/month`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("이번달 절약을 가져올 수 없습니다.");
    }

    return res.json();
  }

  // 최근 3가지 절약 기록
  async getLatestRecords(): Promise<SavingRecord[]> {
    const res = await fetch(`${API_BASE_URL}/latest`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("최근 절약 기록을 가져올 수 없습니다.");
    }
    return res.json();
  }

  // 일주일 절약 통계
  async getWeekRecords(): Promise<{ [key: string]: number }[]> {
    const response = await fetch(`${API_BASE_URL}/week`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("최근 일주일 절약 통계를 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 카테고리별 통계
  async getCategorySavingsStats(): Promise<CategoryStats[]> {
    const response = await fetch(`${API_BASE_URL}/category`, {
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
