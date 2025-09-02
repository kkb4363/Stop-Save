import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Challenge } from "../types/user";
import { challengeService } from "../services/challengeService";

interface ChallengeState {
  challenges: Challenge[];
  recommendedChallenges: Challenge[];
  selectedChallenge: Challenge | null;
  isLoading: boolean;
  error: string | null;

  // 액션들
  fetchActiveChallenges: () => Promise<void>;
  fetchChallengeById: (challengeId: number) => Promise<void>;
  fetchRecommendedChallenges: (userTotalSavings: number) => Promise<void>;
  fetchChallengesByDuration: (duration: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set) => ({
      challenges: [],
      recommendedChallenges: [],
      selectedChallenge: null,
      isLoading: false,
      error: null,

      fetchActiveChallenges: async () => {
        try {
          set({ isLoading: true, error: null });
          const challenges = await challengeService.getActiveChallenges();
          set({
            challenges,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "챌린지를 가져올 수 없습니다.",
          });
        }
      },

      fetchChallengeById: async (challengeId: number) => {
        try {
          set({ isLoading: true, error: null });
          const challenge = await challengeService.getChallengeById(
            challengeId
          );
          set({
            selectedChallenge: challenge,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "챌린지 정보를 가져올 수 없습니다.",
          });
        }
      },

      fetchRecommendedChallenges: async (userTotalSavings: number) => {
        try {
          const recommendedChallenges =
            await challengeService.getRecommendedChallenges(userTotalSavings);
          set({ recommendedChallenges });
        } catch (error) {
          console.error("추천 챌린지 조회 실패:", error);
        }
      },

      fetchChallengesByDuration: async (duration: number) => {
        try {
          set({ isLoading: true, error: null });
          const challenges = await challengeService.getChallengesByDuration(
            duration
          );
          set({
            challenges,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "기간별 챌린지를 가져올 수 없습니다.",
          });
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "challenge-storage",
      partialize: (state) => ({
        challenges: state.challenges,
        recommendedChallenges: state.recommendedChallenges,
      }),
    }
  )
);
