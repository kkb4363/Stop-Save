import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";

export default function StatsPage() {
  const { user } = useAuthStore();
  const { records, categoryStats, fetchCategoryStats } = useSavingRecordStore();

  useEffect(() => {
    if (user?.id) {
      fetchCategoryStats();
    }
  }, [user?.id, fetchCategoryStats]);

  // 카테고리별 통계 데이터 가공 (백엔드 데이터 사용)
  const categoryData = categoryStats
    .map((stat) => ({
      category: stat.category,
      amount: stat.amount,
      percentage:
        user!.totalSavings > 0 ? (stat.amount / user!.totalSavings) * 100 : 0,
      icon:
        stat.category === "음식"
          ? "🍔"
          : stat.category === "교통"
          ? "🚗"
          : stat.category === "쇼핑"
          ? "🛍️"
          : stat.category === "엔터테인먼트"
          ? "🎬"
          : "💡",
    }))
    .sort((a, b) => b.amount - a.amount);

  // 최근 7일 데이터
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayRecords = records.filter(
      (record) =>
        new Date(record.createdAt).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
      amount: dayRecords.reduce((sum, record) => sum + record.amount, 0),
    };
  });

  const maxDailyAmount = Math.max(...last7Days.map((d) => d.amount), 1);

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">절약 통계</h1>
        <p className="text-sm text-gray-600">
          {user?.nickname || user?.username || "사용자"}님의 절약 현황을
          확인해보세요
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-lg font-bold text-gray-900">
            {user!.totalSavings?.toLocaleString()}원
          </div>
          <div className="text-xs text-gray-500">총 절약 금액</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-lg font-bold text-gray-900">
            {records.length}회
          </div>
          <div className="text-xs text-gray-500">절약 횟수</div>
        </div>
      </div>

      {/* 최근 7일 차트 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">최근 7일 절약</h3>
        <div className="space-y-3">
          {last7Days.map((day, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-xs text-gray-500 w-12 text-right">
                {day.date}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                <div
                  className="gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(day.amount / maxDailyAmount) * 100}%`,
                    minWidth: day.amount > 0 ? "8px" : "0px",
                  }}
                ></div>
              </div>
              <div className="text-xs font-medium text-gray-900 w-16 text-right">
                {day.amount.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 카테고리별 통계 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">카테고리별 절약</h3>
        {categoryData.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-sm text-gray-500">아직 절약 기록이 없어요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categoryData.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-sm">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.amount.toLocaleString()}원
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 레벨 정보 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">내 레벨</h3>
        <div className="text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-brand-600 mb-1">
            Level {user?.level || 1}
          </div>
          <p className="text-sm text-gray-600">
            {(user?.level || 1) === 1
              ? "절약 초보"
              : (user?.level || 1) <= 3
              ? "절약 도전자"
              : (user?.level || 1) <= 5
              ? "절약 전문가"
              : (user?.level || 1) <= 10
              ? "절약 마스터"
              : "절약 전설"}
          </p>
        </div>
      </div>
    </div>
  );
}
