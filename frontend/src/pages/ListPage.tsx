import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import { Link } from "react-router-dom";

export default function ListPage() {
  const { user } = useAuthStore();
  const { records, totalAmount, fetchUserRecords, fetchTotalAmount } =
    useSavingRecordStore();

  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [filterCategory, setFilterCategory] = useState<string>("전체");

  // 사용자 데이터 로드
  useEffect(() => {
    if (user?.id) {
      fetchUserRecords(user.id);
      fetchTotalAmount(user.id);
    }
  }, [user?.id, fetchUserRecords, fetchTotalAmount]);

  // 카테고리 목록 추출
  const categories = [
    "전체",
    ...new Set(records.map((record) => record.category)),
  ];

  // 필터링 및 정렬된 기록들
  const filteredAndSortedRecords = records
    .filter(
      (record) =>
        filterCategory === "전체" || record.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "amount":
          return b.amount - a.amount;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  // 카테고리별 아이콘 함수
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "음식":
        return "🍔";
      case "교통":
        return "🚗";
      case "쇼핑":
        return "🛍️";
      case "엔터테인먼트":
        return "🎬";
      default:
        return "💡";
    }
  };

  // 월별 그룹화
  const groupedByMonth = filteredAndSortedRecords.reduce((groups, record) => {
    const date = new Date(record.createdAt);
    const monthKey = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(record);
    return groups;
  }, {} as Record<string, typeof records>);

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">절약 기록</h1>
          <p className="text-sm text-gray-600 mt-1">
            총 {filteredAndSortedRecords.length}개의 기록
          </p>
        </div>
      </div>

      {/* 요약 정보 */}
      <div className="card p-4 gradient-card">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalAmount.toLocaleString()}원
          </div>
          <p className="text-sm text-gray-600">
            {filterCategory === "전체" ? "전체" : filterCategory} 절약 총액
          </p>
        </div>
      </div>

      {/* 필터 및 정렬 */}
      <div className="card p-4">
        <div className="space-y-4">
          {/* 카테고리 필터 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterCategory === category
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 옵션 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">정렬</h3>
            <div className="flex gap-2">
              {[
                { value: "date", label: "날짜순" },
                { value: "amount", label: "금액순" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as typeof sortBy)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    sortBy === option.value
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 기록 목록 */}
      {filteredAndSortedRecords.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterCategory === "전체"
              ? "아직 절약 기록이 없어요"
              : `${filterCategory} 카테고리에 기록이 없어요`}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            첫 번째 절약을 등록해보세요!
          </p>
          <Link to="/record" className="btn-primary inline-block">
            절약 등록하기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByMonth).map(([month, monthRecords]) => (
            <div key={month} className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{month}</h3>
                <div className="text-sm text-gray-500">
                  {monthRecords.length}개 기록 ·{" "}
                  {monthRecords
                    .reduce((sum, record) => sum + record.amount, 0)
                    .toLocaleString()}
                  원
                </div>
              </div>

              <div className="space-y-3">
                {monthRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <span className="text-lg">
                          {getCategoryIcon(record.category)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {record.memo || record.itemName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{record.category}</span>
                          <span>•</span>
                          <span>
                            {new Date(record.createdAt).toLocaleDateString(
                              "ko-KR",
                              {
                                month: "short",
                                day: "numeric",
                                weekday: "short",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-brand-600">
                        +{record.amount.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
