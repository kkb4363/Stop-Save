import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import { useExpenseRecordStore } from "../store/useExpenseRecordStore";

export default function StatsPage() {
  const { user } = useAuthStore();
  const {
    records,
    categoryStats,
    fetchCategoryStats,
    fetchAllRecords,
    fetchWeekRecords,
  } = useSavingRecordStore();

  const {
    records: expenseRecords,
    categoryStats: expenseCategoryStats,
    fetchCategoryStats: fetchExpenseCategoryStats,
    fetchAllRecords: fetchAllExpenseRecords,
    fetchWeekRecords: fetchExpenseWeekRecords,
  } = useExpenseRecordStore();

  // 월 선택 상태
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user?.id) {
      // 통계 페이지 진입 시 모든 데이터 새로고침
      fetchCategoryStats();
      fetchAllRecords();
      fetchWeekRecords();
      // 소비 데이터
      fetchExpenseCategoryStats();
      fetchAllExpenseRecords();
      fetchExpenseWeekRecords();
    }
  }, [
    user?.id,
    fetchCategoryStats,
    fetchAllRecords,
    fetchWeekRecords,
    fetchExpenseCategoryStats,
    fetchAllExpenseRecords,
    fetchExpenseWeekRecords,
  ]);

  // 모든 카테고리 목록 생성 (절약 + 소비)
  const allCategories = new Set([
    ...categoryStats.map((stat) => stat.category),
    ...expenseCategoryStats.map((stat) => stat.category),
  ]);

  // 카테고리별 통계 데이터 가공
  const categoryData = Array.from(allCategories)
    .map((category) => {
      const savingsStat = categoryStats.find(
        (stat) => stat.category === category
      );
      const expenseStat = expenseCategoryStats.find(
        (stat) => stat.category === category
      );

      const savingsAmount = savingsStat?.amount || 0;
      const expenseAmount = expenseStat?.amount || 0;

      return {
        category,
        savingsAmount,
        expenseAmount,
        totalAmount: savingsAmount + expenseAmount,
        icon:
          category === "음식"
            ? "🍔"
            : category === "교통"
            ? "🚗"
            : category === "쇼핑"
            ? "🛍️"
            : category === "엔터테인먼트"
            ? "🎬"
            : category === "생필품"
            ? "🛒"
            : category === "의료"
            ? "🏥"
            : category === "교육"
            ? "📚"
            : "💡",
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // 모든 카테고리의 최대 금액 (차트 스케일용)
  const maxCategoryAmount = Math.max(
    ...categoryData.map((item) =>
      Math.max(item.savingsAmount, item.expenseAmount)
    ),
    1
  );

  // 선택된 월의 데이터
  const savingsAmount = user?.totalSavings || 0;
  const expenseAmount = expenseRecords.reduce(
    (sum, record) => sum + record.amount,
    0
  );
  const totalAmount = savingsAmount + expenseAmount;

  // 원형 차트를 위한 데이터
  const savingsPercentage =
    totalAmount > 0 ? (savingsAmount / totalAmount) * 100 : 0;
  const expensePercentage =
    totalAmount > 0 ? (expenseAmount / totalAmount) * 100 : 0;

  // 월 선택 옵션
  const months = [
    { value: 1, label: "1월" },
    { value: 2, label: "2월" },
    { value: 3, label: "3월" },
    { value: 4, label: "4월" },
    { value: 5, label: "5월" },
    { value: 6, label: "6월" },
    { value: 7, label: "7월" },
    { value: 8, label: "8월" },
    { value: 9, label: "9월" },
    { value: 10, label: "10월" },
    { value: 11, label: "11월" },
    { value: 12, label: "12월" },
  ];

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {user?.nickname || user?.username || "사용자"}님의 소비 & 절약 현황을
          확인해보세요
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">🐷</div>
          <div className="text-lg font-bold text-blue-600">
            {user!.totalSavings?.toLocaleString()}원
          </div>
          <div className="text-xs text-gray-500 mb-1">총 절약 금액</div>
          <div className="text-sm font-medium text-gray-700">
            {records.length}회 절약
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">💳</div>
          <div className="text-lg font-bold text-red-600">
            {expenseAmount.toLocaleString()}원
          </div>
          <div className="text-xs text-gray-500 mb-1">총 소비 금액</div>
          <div className="text-sm font-medium text-gray-700">
            {expenseRecords.length}회 소비
          </div>
        </div>
      </div>

      {/* 절약 vs 소비 통합 차트 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">절약 vs 소비</h3>
          {/* <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select> */}
        </div>

        {/* 원형 차트와 범례 */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            {totalAmount > 0 ? (
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* 배경 원 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                />
                {/* 절약 호 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray={`${savingsPercentage * 2.51} 251`}
                  strokeLinecap="round"
                />
                {/* 소비 호 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray={`${expensePercentage * 2.51} 251`}
                  strokeDashoffset={`-${savingsPercentage * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <div className="w-full h-full rounded-full border-8 border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm text-gray-500">데이터 없음</p>
                </div>
              </div>
            )}

            {/* 중앙 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {totalAmount.toLocaleString()}원
                </div>
                <div className="text-xs text-gray-500">총 금액</div>
              </div>
            </div>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700">
              절약 {savingsAmount.toLocaleString()}원 (
              {savingsPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-700">
              소비 {expenseAmount.toLocaleString()}원 (
              {expensePercentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* 카테고리별 상세 차트 */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-4">카테고리별 상세</h4>
          {categoryData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-sm text-gray-500">아직 기록이 없어요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      총 {item.totalAmount.toLocaleString()}원
                    </div>
                  </div>

                  {/* 절약 바 */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-xs text-gray-600">절약</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            maxCategoryAmount > 0
                              ? (item.savingsAmount / maxCategoryAmount) * 100
                              : 0
                          }%`,
                          minWidth: item.savingsAmount > 0 ? "4px" : "0px",
                        }}
                      ></div>
                    </div>
                    <div className="w-16 text-xs font-medium text-blue-600 text-right">
                      {item.savingsAmount.toLocaleString()}원
                    </div>
                  </div>

                  {/* 소비 바 */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-xs text-gray-600">소비</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 relative">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            maxCategoryAmount > 0
                              ? (item.expenseAmount / maxCategoryAmount) * 100
                              : 0
                          }%`,
                          minWidth: item.expenseAmount > 0 ? "4px" : "0px",
                        }}
                      ></div>
                    </div>
                    <div className="w-16 text-xs font-medium text-red-600 text-right">
                      {item.expenseAmount.toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 레벨 정보 */}
      {/* <div className="card p-4">
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
      </div> */}
    </div>
  );
}
