import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSavingsStore } from "../store/useSavingsStore";
import { useAuthStore } from "../store/useAuthStore";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { balance, records } = useSavingsStore();
  const [monthlyTarget, setMonthlyTarget] = useState(100000);
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    challenges: true,
  });

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">설정</h1>
        <p className="text-sm text-gray-600">앱 설정을 관리하세요</p>
      </div>

      {/* 프로필 */}
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            {user?.picture ? (
              <img
                src={user.picture}
                alt="프로필"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-white">👤</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {user?.nickname || user?.username || "사용자"}님
            </h3>
            <p className="text-sm text-gray-600">
              절약 레벨 {user?.level || 1}
            </p>
            <p className="text-xs text-gray-500">
              총 {balance.toLocaleString()}원 절약 • {records.length}회 기록
            </p>
          </div>
          <button className="text-sm text-brand-600">편집</button>
        </div>
      </div>

      {/* 목표 설정 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">월간 절약 목표</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">목표 금액</span>
              <span className="text-sm font-semibold text-gray-900">
                {monthlyTarget.toLocaleString()}원
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="10000"
              value={monthlyTarget}
              onChange={(e) => setMonthlyTarget(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5만원</span>
              <span>50만원</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">이번 달 진행률</span>
              <span className="text-sm font-semibold text-brand-600">
                {Math.min(100, (balance / monthlyTarget) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="gradient-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (balance / monthlyTarget) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">알림 설정</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">일일 알림</h4>
              <p className="text-xs text-gray-500">매일 절약 기록 알림</p>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) => ({ ...prev, daily: !prev.daily }))
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications.daily ? "bg-brand-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.daily ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">주간 리포트</h4>
              <p className="text-xs text-gray-500">주간 절약 현황 알림</p>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) => ({ ...prev, weekly: !prev.weekly }))
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications.weekly ? "bg-brand-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.weekly ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">챌린지 알림</h4>
              <p className="text-xs text-gray-500">새로운 챌린지 알림</p>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) => ({
                  ...prev,
                  challenges: !prev.challenges,
                }))
              }
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications.challenges ? "bg-brand-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.challenges ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* 기타 설정 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">기타</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏦</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  적금 계좌 연동
                </div>
                <div className="text-xs text-gray-500">
                  실제 적금 계좌와 연결하기
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">👥</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  친구 초대
                </div>
                <div className="text-xs text-gray-500">
                  친구와 함께 절약하기
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">📊</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  데이터 내보내기
                </div>
                <div className="text-xs text-gray-500">
                  절약 기록을 CSV로 내보내기
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 계정 관리 */}
      {/* <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">계정 관리</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔐</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  비밀번호 변경
                </div>
                <div className="text-xs text-gray-500">
                  계정 보안을 위해 비밀번호를 변경하세요
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">📧</span>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  이메일 변경
                </div>
                <div className="text-xs text-gray-500">
                  로그인에 사용하는 이메일을 변경하세요
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            onClick={async () => {
              try {
                await logout();
                navigate("/login");
              } catch (error) {
                console.error("로그아웃 실패:", error);
                // 에러가 발생해도 로그인 페이지로 이동
                navigate("/login");
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          >
            <span className="text-lg">🚪</span>
            <span className="text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </div> */}

      {/* 앱 정보 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">앱 정보</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>버전</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>마지막 업데이트</span>
            <span>2024.12.31</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-3 text-xs text-gray-500">
            <button className="hover:text-brand-600">개인정보처리방침</button>
            <button className="hover:text-brand-600">서비스 이용약관</button>
            <button className="hover:text-brand-600">문의하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
