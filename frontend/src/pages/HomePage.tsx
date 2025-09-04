import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import ReactConfetti from "react-confetti";

export default function HomePage() {
  const { user } = useAuthStore();
  const {
    todayTotalAmount,
    monthTotalCount,
    monthTotalAmount,
    latestRecords,
    totalAmount,
    fetchTodayAmount,
    fetchMonthAmount,
    fetchTotalAmount,
    fetchMonthCount,
    fetchLatestRecords,
  } = useSavingRecordStore();

  useEffect(() => {
    if (user?.id) {
      fetchTodayAmount(user.id);
      fetchMonthAmount(user.id);
      fetchLatestRecords(user.id);
      fetchMonthCount(user.id);
      fetchTotalAmount(user.id);
    }
  }, [
    user?.id,
    fetchTodayAmount,
    fetchMonthAmount,
    fetchLatestRecords,
    fetchMonthCount,
    fetchTotalAmount,
  ]);

  const { state } = useLocation();
  const success = state?.success;
  const [isSuccess, setIsSuccess] = useState(false);

  // 사용자 레벨과 경험치 (백엔드 데이터 사용)
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
          <div className="absolute top-[80px] right-0 left-0 flex items-center justify-center text-2xl font-bold text-[#0284c7] animate-pulse">
            🎉 절약 등록이 완료됐어요~ 🎉
          </div>
        </>
      )}

      {/* 메인 카드 */}
      <div className="card p-6 gradient-card">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {user?.nickname || user?.username || "사용자"} 님의 절약
          </p>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalAmount.toLocaleString()}원
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">Lv.{level}</span>
            <span className="text-xs text-gray-600">Lv.{level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            다음 레벨까지 {nextLevelXP} XP
          </p>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="오늘 절약"
          value={`${todayTotalAmount.toLocaleString()}원`}
          icon="💰"
          trend={
            todayTotalAmount > 0 ? `+${todayTotalAmount.toLocaleString()}` : "0"
          }
        />
        <StatCard
          title="이번 달"
          value={`${monthTotalAmount.toLocaleString()}원`}
          icon="📈"
          trend={`${monthTotalCount}회 절약`}
        />
      </div>

      {/* 최근 기록 */}
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
            <span className="text-xs text-gray-300">|</span>
            <Link
              to="/stats"
              className="text-xs text-brand-600 hover:text-brand-700"
            >
              통계
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

      {/* 빠른 액션 */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/record" className="card card-hover p-4 text-center">
          <div className="text-2xl mb-2">➕</div>
          <p className="text-sm font-medium text-gray-900">절약 등록</p>
        </Link>
        <Link to="/challenges" className="card card-hover p-4 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <p className="text-sm font-medium text-gray-900">챌린지</p>
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
