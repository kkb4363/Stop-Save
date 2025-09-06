import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";
import { userService } from "../services/userService";
import { API_BASE_URL_DEV } from "../constants/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션들
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });

          // Google OAuth2 로그인을 위해 백엔드 OAuth2 엔드포인트로 리다이렉트
          // Spring Security OAuth2가 자동으로 처리하고, 성공 시 프론트엔드로 리다이렉트
          window.location.href = `${API_BASE_URL_DEV}/oauth2/authorization/google`;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Google 로그인에 실패했습니다.",
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await userService.logout();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "로그아웃에 실패했습니다.",
          });
          // 에러가 발생해도 로컬 상태는 클리어
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      getCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const userResponse = await userService.getCurrentUser();

          // 사용자 정보가 성공적으로 조회되면 인증된 상태로 설정
          if (userResponse && userResponse.sub) {
            set({
              user: userResponse,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // 사용자 정보가 없으면 인증되지 않은 상태
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error("❌ 사용자 정보 조회 실패:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "사용자 정보를 가져올 수 없습니다.",
          });
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
