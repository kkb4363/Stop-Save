export interface User {
  id: number;
  email: string;
  nickname: string;
  username: string;
  level: number;
  experience: number;
  totalSavings: number;
  monthlyTarget: number;
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
  monthlyTarget: number;
  picture?: string;
  loginType: "GOOGLE" | "LOCAL";
  role: string;
  sub?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// 절약 기록 관련 타입들
export interface SavingRecord {
  id: number;
  user: User;
  itemName: string;
  amount: number;
  category: string;
  memo?: string;
  createdAt: string;
}

export interface RecordInfo {
  totalAmount?: number;
  count?: number;
  data?: SavingRecord[];
}

export interface SavingRecordRequest {
  userId: number;
  itemName: string;
  amount: number;
  category: string;
  memo?: string;
}

export interface ExpenseRecord {
  id: number;
  user: User;
  itemName: string;
  amount: number;
  category: string;
  memo?: string;
  createdAt: string;
}

export interface ExpenseRecordRequest {
  userId: number;
  itemName: string;
  amount: number;
  category: string;
  memo?: string;
}

export interface CategoryStats {
  category: string;
  amount: number;
  count: number;
}

// 챌린지 관련 타입들
export interface Challenge {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  duration: number;
  experienceReward: number;
  isActive: boolean;
  createdAt: string;
}
