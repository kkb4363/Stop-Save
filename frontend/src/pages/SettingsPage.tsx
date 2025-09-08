import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import {
  exportToExcel,
  exportRecordsByPeriod,
  exportRecordsByCategory,
} from "../utils/excelExport";
import { BUILD_INFO } from "../constants/buildInfo";
import { userService } from "../services/userService";
import { ToastContainer, toast } from "react-toastify";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { records } = useSavingRecordStore();
  const [monthlyTarget, setMonthlyTarget] = useState(
    user?.monthlyTarget || 100000
  );
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    challenges: true,
  });
  const [showExportModal, setShowExportModal] = useState(false);

  // 사용자 데이터 로드
  // useEffect(() => {
  //   if (user?.id) {
  //     getCurrentUser();
  //   }
  // }, []);

  // Excel 내보내기 핸들러들
  const handleExportAll = () => {
    try {
      const result = exportToExcel(records);
      alert(
        `성공적으로 내보냈습니다!\n파일명: ${result.filename}\n총 ${
          result.totalRecords
        }건, ${result.totalAmount.toLocaleString()}원`
      );
      setShowExportModal(false);
    } catch (error) {
      console.error("Excel 내보내기 실패:", error);
      alert("Excel 내보내기에 실패했습니다.");
    }
  };

  const handleExportByPeriod = (days: number) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = exportRecordsByPeriod(records, startDate, endDate);
      alert(
        `성공적으로 내보냈습니다!\n파일명: ${result.filename}\n총 ${
          result.totalRecords
        }건, ${result.totalAmount.toLocaleString()}원`
      );
      setShowExportModal(false);
    } catch (error) {
      console.error("Excel 내보내기 실패:", error);
      alert("Excel 내보내기에 실패했습니다.");
    }
  };

  const handleExportByCategory = (category: string) => {
    try {
      const result = exportRecordsByCategory(records, category);
      alert(
        `성공적으로 내보냈습니다!\n파일명: ${result.filename}\n총 ${
          result.totalRecords
        }건, ${result.totalAmount.toLocaleString()}원`
      );
      setShowExportModal(false);
    } catch (error) {
      console.error("Excel 내보내기 실패:", error);
      alert("Excel 내보내기에 실패했습니다.");
    }
  };

  // 월간 목표 저장 핸들러
  const handleSaveMonthlyTarget = async () => {
    if (!user?.id) return;

    try {
      await userService.updateMonthlyTarget(monthlyTarget);
      toast.success(
        `월간 목표가 ${monthlyTarget.toLocaleString()}원으로 설정되었습니다!`
      );

      // 월간 목표 저장 후 사용자 정보 새로고침
      try {
        const { getCurrentUser } = useAuthStore.getState();
        await getCurrentUser();
        console.log("✅ 월간 목표 저장 후 사용자 정보 새로고침 완료");
      } catch (refreshError) {
        console.warn("⚠️ 사용자 정보 새로고침 실패:", refreshError);
      }
    } catch (error) {
      console.error("월간 목표 설정 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "월간 목표 설정에 실패했습니다."
      );
    }
  };

  return (
    <>
      <ToastContainer />
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

              <p className="text-xs text-gray-500">
                총 {user?.totalSavings?.toLocaleString()}원 절약 •{" "}
                {user?.totalExpense?.toLocaleString()}원 소비
              </p>
            </div>
            {/* <button className="text-sm text-brand-600">편집</button> */}
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
                max="1000000"
                step="10000"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5만원</span>
                <span>100만원</span>
              </div>
              <button
                onClick={handleSaveMonthlyTarget}
                className="mt-3 w-full bg-brand-600 text-white py-2 px-4 rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
              >
                목표 저장
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">이번 달 진행률</span>
                <span className="text-sm font-semibold text-brand-600">
                  {Math.min(
                    100,
                    (user!.totalSavings / monthlyTarget) * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (user!.totalSavings / monthlyTarget) * 100
                    )}%`,
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
                <h4 className="text-sm font-medium text-gray-900">
                  주간 리포트
                </h4>
                <p className="text-xs text-gray-500">주간 절약 현황 알림</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    weekly: !prev.weekly,
                  }))
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
                <h4 className="text-sm font-medium text-gray-900">
                  챌린지 알림
                </h4>
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
                    notifications.challenges
                      ? "translate-x-6"
                      : "translate-x-0.5"
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
                onClick={() => toast("기능 준비 중입니다.")}
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
              onClick={() => setShowExportModal(true)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📊</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    데이터 내보내기
                  </div>
                  <div className="text-xs text-gray-500">
                    절약 기록을 Excel로 내보내기
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

        {/* 로그아웃 */}
        <div className="pb-6">
          <button
            onClick={async () => {
              try {
                await logout();
                navigate("/login");
              } catch (error) {
                console.error("로그아웃 실패:", error);
                navigate("/login");
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          >
            <span className="text-lg">🚪</span>
            <span className="text-sm font-medium">로그아웃</span>
          </button>
        </div>

        {/* 앱 정보 */}
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">앱 정보</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>버전</span>
              <span>v{BUILD_INFO.VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span>마지막 업데이트</span>
              <span>
                {new Date(BUILD_INFO.BUILD_TIME).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>빌드 번호</span>
              <span>#{BUILD_INFO.BUILD_NUMBER}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-3 text-xs text-gray-500">
              <button
                onClick={() => navigate("/privacy-policy")}
                className="hover:text-brand-600"
              >
                개인정보처리방침
              </button>
              <button
                onClick={() => navigate("/terms-of-service")}
                className="hover:text-brand-600"
              >
                서비스 이용약관
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="hover:text-brand-600"
              >
                문의하기
              </button>
            </div>
          </div>
        </div>

        {/* Excel 내보내기 모달 */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                데이터 내보내기
              </h3>

              <div className="space-y-3">
                {/* 전체 내보내기 */}
                <button
                  onClick={handleExportAll}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        전체 기록
                      </div>
                      <div className="text-xs text-gray-500">
                        모든 절약 기록 ({records.length}건)
                      </div>
                    </div>
                  </div>
                </button>

                {/* 기간별 내보내기 */}
                <button
                  onClick={() => handleExportByPeriod(7)}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        최근 7일
                      </div>
                      <div className="text-xs text-gray-500">
                        일주일간의 절약 기록
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleExportByPeriod(30)}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🗓️</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        최근 30일
                      </div>
                      <div className="text-xs text-gray-500">
                        한 달간의 절약 기록
                      </div>
                    </div>
                  </div>
                </button>

                {/* 카테고리별 내보내기 */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    카테고리별
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["음식", "교통", "쇼핑", "엔터테인먼트"].map(
                      (category) => (
                        <button
                          key={category}
                          onClick={() => handleExportByCategory(category)}
                          className="p-2 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          {category}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* 모달 닫기 */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
