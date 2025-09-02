export interface User {
  id: number;
  email: string;
  nickname: string;
  username: string;
  level: number;
  experience: number;
  totalSavings: number;
  picture?: string;
  loginType: "GOOGLE" | "LOCAL";
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ExperienceRequest {
  experience: number;
}

export interface SavingsRequest {
  amount: number;
}

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  username: string;
  level: number;
  experience: number;
  totalSavings: number;
  picture?: string;
  loginType: "GOOGLE" | "LOCAL";
  role: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
