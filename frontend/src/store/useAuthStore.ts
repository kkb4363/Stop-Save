import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";
import { userService } from "../services/userService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션들
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateUser: (userId: number, userData: Partial<User>) => Promise<void>;
  addExperience: (userId: number, experience: number) => Promise<void>;
  updateSavings: (userId: number, amount: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const userResponse = await userService.loginUser({
            username,
            password,
          });

          set({
            user: userResponse,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "로그인에 실패했습니다.",
          });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });

          // Google OAuth2 로그인을 위해 백엔드 OAuth2 엔드포인트로 리다이렉트
          // Spring Security OAuth2가 자동으로 처리하고, 성공 시 프론트엔드로 리다이렉트
          window.location.href =
            "https://stop-save.vercel.app/oauth2/authorization/google";
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
          if (userResponse && userResponse.id) {
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

      updateUser: async (userId: number, userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().user;
          if (!currentUser) throw new Error("사용자 정보가 없습니다.");

          const updatedUser = await userService.updateUser(userId, {
            ...currentUser,
            ...userData,
          });

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "사용자 정보 수정에 실패했습니다.",
          });
          throw error;
        }
      },

      addExperience: async (userId: number, experience: number) => {
        try {
          set({ isLoading: true, error: null });
          const updatedUser = await userService.addExperience(
            userId,
            experience
          );

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "경험치 추가에 실패했습니다.",
          });
          throw error;
        }
      },

      updateSavings: async (userId: number, amount: number) => {
        try {
          set({ isLoading: true, error: null });
          const updatedUser = await userService.updateSavings(userId, amount);

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "적금액 업데이트에 실패했습니다.",
          });
          throw error;
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
