import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import ReactConfetti from "react-confetti";

export default function HomePage() {
  const { user } = useAuthStore();

  const {
    todayRecords,
    monthRecords,
    latestRecords,
    fetchTodayRecords,
    fetchMonthRecords,
    fetchLatestRecords,
  } = useSavingRecordStore();

  useEffect(() => {
    if (user?.id) {
      console.log("🏠 HomePage 데이터 새로고침 시작");
      fetchTodayRecords();
      fetchMonthRecords();
      fetchLatestRecords();
    }
  }, [user?.id, fetchTodayRecords, fetchMonthRecords, fetchLatestRecords]);

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        console.log("🔄 페이지 포커스 - 데이터 새로고침");
        fetchTodayRecords();
        fetchMonthRecords();
        fetchLatestRecords();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.id, fetchTodayRecords, fetchMonthRecords, fetchLatestRecords]);

  const { state } = useLocation();
  const success = state?.success;
  const successType = state?.type; // 'expense' 또는 undefined (절약)
  const [isSuccess, setIsSuccess] = useState(false);

  // 사용자 레벨과 경험치
  const level = user?.level || 1;
  const experience = user?.experience || 0;
  const nextLevelXP = Math.max(0, level * 100 - experience);
  const progressPercent = (experience / (level * 100)) * 100;

  useEffect(() => {
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);
    }
  }, [success]);

  return (
    <div className="space-y-6 pt-6">
      {isSuccess && (
        <>
          <ReactConfetti />
          <div className="absolute top-[80px] right-0 left-0 flex items-center justify-center text-2xl font-bold animate-pulse">
            {successType === "expense" ? (
              <span className="text-red-600">
                💸 소비 등록이 완료됐어요~ 💸
              </span>
            ) : (
              <span className="text-[#0284c7]">
                🎉 절약 등록이 완료됐어요~ 🎉
              </span>
            )}
          </div>
        </>
      )}

      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="오늘의 절약"
          value={`${todayRecords?.totalAmount?.toLocaleString()}원`}
          icon="💰"
          trend={`${todayRecords?.count}회 절약`}
        />
        <StatCard
          title="오늘의 소비"
          value={`${monthRecords?.totalAmount?.toLocaleString()}원`}
          icon="💸"
          trend={`${monthRecords?.count}회 소비`}
        />
      </div>

      {/* 최근 절약 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">최근 절약</h3>
          <div className="flex items-center gap-2">
            <Link
              to="/list"
              className="text-xs text-brand-600 hover:text-brand-700"
            >
              전체보기
            </Link>
          </div>
        </div>

        {latestRecords?.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm text-gray-500 mb-4">
              첫 절약을 시작해보세요!
            </p>
            <Link to="/record" className="btn-primary inline-block">
              절약 등록하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {latestRecords?.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-sm">
                      {record.category === "음식"
                        ? "🍔"
                        : record.category === "교통"
                        ? "🚗"
                        : record.category === "쇼핑"
                        ? "🛍️"
                        : record.category === "엔터테인먼트"
                        ? "🎬"
                        : record.category === "생필품"
                        ? "🛒"
                        : record.category === "의료"
                        ? "🏥"
                        : record.category === "교육"
                        ? "📚"
                        : "💡"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {record.memo || record.itemName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-brand-600">
                  +{record.amount.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 최근 소비 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">최근 소비</h3>
          <div className="flex items-center gap-2">
            <Link
              to="/list"
              className="text-xs text-red-600 hover:text-red-700"
            >
              전체보기
            </Link>
          </div>
        </div>

        {/* 임시로 빈 데이터 상태 - 백엔드 연동 시 실제 소비 데이터로 교체 */}
        {true ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💳</div>
            <p className="text-sm text-gray-500 mb-4">
              첫 소비를 등록해보세요!
            </p>
            <Link
              to="/expense"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors"
            >
              소비 등록하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 실제 소비 데이터가 있을 때의 구조 - 백엔드 연동 시 사용 */}
            {[].map((expense: any) => (
              <div
                key={expense.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-sm">
                      {expense.category === "음식"
                        ? "🍔"
                        : expense.category === "교통"
                        ? "🚗"
                        : expense.category === "쇼핑"
                        ? "🛍️"
                        : expense.category === "엔터테인먼트"
                        ? "🎬"
                        : expense.category === "생필품"
                        ? "🛒"
                        : expense.category === "의료"
                        ? "🏥"
                        : expense.category === "교육"
                        ? "📚"
                        : "💡"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {expense.memo || expense.itemName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-red-600">
                  -{expense.amount.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 빠른 액션 */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/record" className="card card-hover p-4 text-center">
          <div className="text-2xl mb-2">🐷</div>
          <p className="text-sm font-medium text-gray-900">절약 등록</p>
        </Link>
        <Link to="/expense" className="card card-hover p-4 text-center">
          <div className="text-2xl mb-2">💳</div>
          <p className="text-sm font-medium text-gray-900">소비 등록</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: string;
  trend: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{trend}</div>
    </div>
  );
}
