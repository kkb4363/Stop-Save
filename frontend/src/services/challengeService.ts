import { API_BASE_URL_DEV } from "../constants/api";
import type { Challenge } from "../types/user";

const API_BASE_URL = `${API_BASE_URL_DEV}/api/challenges`;

class ChallengeService {
  // 모든 활성 챌린지 조회
  async getActiveChallenges(): Promise<Challenge[]> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("활성 챌린지를 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 챌린지 상세 조회
  async getChallengeById(challengeId: number): Promise<Challenge> {
    const response = await fetch(`${API_BASE_URL}/${challengeId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("챌린지 정보를 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 추천 챌린지 조회
  async getRecommendedChallenges(
    userTotalSavings: number
  ): Promise<Challenge[]> {
    const response = await fetch(
      `${API_BASE_URL}/recommend/${userTotalSavings}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("추천 챌린지를 가져올 수 없습니다.");
    }

    return response.json();
  }

  // 기간별 챌린지 조회
  async getChallengesByDuration(duration: number): Promise<Challenge[]> {
    const response = await fetch(`${API_BASE_URL}/duration/${duration}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("기간별 챌린지를 가져올 수 없습니다.");
    }

    return response.json();
  }
}

export const challengeService = new ChallengeService();
