import { API_BASE_URL_DEV } from "../constants/api";

const API_BASE_URL = `${API_BASE_URL_DEV}/api/challenges`;

interface ChallengeCompletionRequest {
  challengeId: string;
  challengeTitle: string;
  period: "daily" | "weekly" | "monthly";
  rewardAmount: number;
}

interface ChallengeCompletion {
  id: number;
  challengeId: string;
  challengeTitle: string;
  period: "daily" | "weekly" | "monthly";
  rewardAmount: number;
  completedAt: string;
}

interface ChallengeCompletionResponse {
  success: boolean;
  completion: ChallengeCompletion;
  message: string;
}

interface ChallengeCompletionsResponse {
  completions: ChallengeCompletion[];
  totalCount: number;
  totalRewards: number;
}

interface ChallengeStatusResponse {
  challengeId: string;
  isCompleted: boolean;
}

class ChallengeCompletionService {
  /**
   * 챌린지 완료 기록 저장
   */
  async completeChallenge(
    request: ChallengeCompletionRequest
  ): Promise<ChallengeCompletionResponse> {
    const response = await fetch(`${API_BASE_URL}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "챌린지 완료 저장에 실패했습니다.");
    }

    return response.json();
  }

  /**
   * 사용자의 모든 챌린지 완료 기록 조회
   */
  async getChallengeCompletions(): Promise<ChallengeCompletionsResponse> {
    const response = await fetch(`${API_BASE_URL}/completions`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "챌린지 완료 기록 조회에 실패했습니다."
      );
    }

    return response.json();
  }

  /**
   * 특정 챌린지의 완료 상태 확인
   */
  async getChallengeStatus(
    challengeId: string,
    period: "daily" | "weekly" | "monthly"
  ): Promise<ChallengeStatusResponse> {
    const response = await fetch(
      `${API_BASE_URL}/status/${challengeId}?period=${period}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "챌린지 상태 확인에 실패했습니다.");
    }

    return response.json();
  }
}

export const challengeCompletionService = new ChallengeCompletionService();
export type {
  ChallengeCompletionRequest,
  ChallengeCompletion,
  ChallengeCompletionResponse,
  ChallengeCompletionsResponse,
  ChallengeStatusResponse,
};
