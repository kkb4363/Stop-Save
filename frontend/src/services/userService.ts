import { API_BASE_URL_BUILD } from "../constants/api";
import { apiClient } from "../utils/apiClient";
import type {
  User,
  LoginRequest,
  ExperienceRequest,
  SavingsRequest,
  UserResponse,
} from "../types/user";

const API_BASE_URL = `${API_BASE_URL_BUILD}/api/users`;

class UserService {
  // 사용자 회원가입
  async registerUser(user: User): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "회원가입에 실패했습니다.");
    }

    return response.json();
  }

  // 일반 로그인
  async loginUser(loginRequest: LoginRequest): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "로그인에 실패했습니다.");
    }

    return response.json();
  }

  // 현재 로그인된 사용자 정보 조회
  async getCurrentUser(): Promise<UserResponse> {
    // URL에서 JWT 토큰 확인 및 저장
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("jwt_token", token);
      console.log("🔑 JWT 토큰 저장:", token.substring(0, 20) + "...");
    }

    // localStorage에서 토큰 가져오기
    const storedToken = localStorage.getItem("jwt_token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // JWT 토큰이 있으면 Authorization 헤더에 추가
    if (storedToken) {
      headers.Authorization = `Bearer ${storedToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      credentials: "include", // 쿠키도 함께 보내기 (하위 호환성)
      headers,
    });

    if (!response.ok) {
      // 토큰이 만료되었거나 유효하지 않은 경우 제거
      if (response.status === 401) {
        localStorage.removeItem("jwt_token");
      }
      const errorData = await response.json();
      throw new Error(errorData.error || "사용자 정보를 가져올 수 없습니다.");
    }

    return response.json();
  }

  // OAuth2 콜백은 Spring Security가 자동으로 처리하므로 별도 메서드 불필요

  // 로그아웃
  async logout(): Promise<void> {
    const response = await apiClient.post(`${API_BASE_URL}/logout`);

    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다.");
    }
  }

  // 사용자 정보 조회 (ID로)
  async getUserById(userId: number): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    return response.json();
  }

  // 사용자 정보 수정
  async updateUser(userId: number, user: User): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "사용자 정보 수정에 실패했습니다.");
    }

    return response.json();
  }

  // 경험치 추가
  async addExperience(
    userId: number,
    experience: number
  ): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/${userId}/experience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ experience } as ExperienceRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "경험치 추가에 실패했습니다.");
    }

    return response.json();
  }

  // 적금액 업데이트
  async updateSavings(userId: number, amount: number): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/${userId}/savings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ amount } as SavingsRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "적금액 업데이트에 실패했습니다.");
    }

    return response.json();
  }

  // 월간 목표 금액 설정
  async updateMonthlyTarget(
    monthlyTarget: number
  ): Promise<{ success: boolean; monthlyTarget: number; message: string }> {
    const response = await apiClient.post(
      `${API_BASE_URL}/monthly-target`,
      monthlyTarget
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "월간 목표 설정에 실패했습니다.");
    }

    return response.json();
  }
}

export const userService = new UserService();
