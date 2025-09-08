import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import { useExpenseRecordStore } from "../store/useExpenseRecordStore";
import { Link } from "react-router-dom";
import type { SavingRecord, ExpenseRecord } from "../types/user";

export default function ListPage() {
  const { user } = useAuthStore();
  const { records, fetchAllRecords, deleteRecord, isLoading } =
    useSavingRecordStore();

  const {
    records: expenseRecords,
    fetchAllRecords: fetchAllExpenseRecords,
    deleteRecord: deleteExpenseRecord,
  } = useExpenseRecordStore();

  // 필터 상태 제거

  // 탭 상태 (절약/소비)
  const [activeTab, setActiveTab] = useState<"savings" | "expenses">("savings");

  // 달력 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 더보기 상태
  const [showAll, setShowAll] = useState(false);
  const ITEMS_PER_PAGE = 5; // 처음에 보여줄 항목 수

  // 삭제 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<
    SavingRecord | ExpenseRecord | null
  >(null);

  // 클릭으로 삭제 모달 열기
  const handleRecordClick = (record: SavingRecord | ExpenseRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    try {
      if (activeTab === "savings") {
        await deleteRecord(recordToDelete.id);
        console.log("✅ 절약 기록 삭제 완료");
      } else {
        await deleteExpenseRecord(recordToDelete.id);
        console.log("✅ 소비 기록 삭제 완료");
      }
      setShowDeleteModal(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error(
        `❌ ${activeTab === "savings" ? "절약" : "소비"} 기록 삭제 실패:`,
        error
      );
      alert(
        `${activeTab === "savings" ? "절약" : "소비"} 기록 삭제에 실패했습니다.`
      );
    }
  };

  // 삭제 취소
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  // 사용자 데이터 로드
  useEffect(() => {
    if (user?.id) {
      fetchAllRecords();
      fetchAllExpenseRecords();
    }
  }, [user?.id, fetchAllRecords, fetchAllExpenseRecords]);

  // 달력 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return formatDateKey(date1) === formatDateKey(date2);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
    setShowAll(false);
  };

  // 현재 탭에 따른 데이터 필터링
  const currentTabRecords = activeTab === "savings" ? records : expenseRecords;

  // 현재 월의 모든 기록들 (달력에 점 표시용)
  const currentMonthRecords = currentTabRecords.filter((record) => {
    const recordDate = new Date(record.createdAt);
    return (
      recordDate.getMonth() === currentDate.getMonth() &&
      recordDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // 날짜별 기록 그룹화
  const recordsByDate = currentMonthRecords.reduce((groups, record) => {
    const dateKey = formatDateKey(new Date(record.createdAt));
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(record);
    return groups;
  }, {} as Record<string, typeof records>);

  // 선택된 날짜의 기록들
  const selectedDateRecords = selectedDate
    ? (recordsByDate[formatDateKey(selectedDate)] || []).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  // 더보기 기능을 위한 표시할 기록들
  const displayedRecords = showAll
    ? selectedDateRecords
    : selectedDateRecords.slice(0, ITEMS_PER_PAGE);

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
      case "생필품":
        return "🛒";
      case "의료":
        return "🏥";
      case "교육":
        return "📚";
      default:
        return "💡";
    }
  };

  // 달력 렌더링을 위한 날짜 배열 생성
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 이전 달의 빈 날짜들
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">기록 조회</h1>
        <p className="text-sm text-gray-600">
          {activeTab === "savings" ? "절약" : "소비"} 기록을 날짜별로
          확인해보세요
        </p>
      </div>

      {/* 탭 */}
      <div className="card p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => {
              setActiveTab("savings");
              setSelectedDate(null);
              setShowAll(false);
            }}
            className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "savings"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🐷 절약 기록
          </button>
          <button
            onClick={() => {
              setActiveTab("expenses");
              setSelectedDate(null);
              setShowAll(false);
            }}
            className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "expenses"
                ? "bg-red-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            💳 소비 기록
          </button>
        </div>
      </div>

      {/* 달력 */}
      <div className="card p-4">
        {/* 달력 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h3 className="text-lg font-semibold text-gray-900">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h3>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs font-medium py-2 ${
                index === 0
                  ? "text-red-500"
                  : index === 6
                  ? "text-blue-500"
                  : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 달력 날짜들 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="aspect-square" />;
            }

            const dateKey = formatDateKey(date);
            const hasRecords = recordsByDate[dateKey]?.length > 0;
            const isSelected = selectedDate && isSameDate(date, selectedDate);
            const isToday = isSameDate(date, new Date());
            const dayOfWeek = date.getDay();

            return (
              <button
                key={dateKey}
                onClick={() => {
                  setSelectedDate(date);
                  setShowAll(false);
                }}
                className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all relative ${
                  isSelected
                    ? activeTab === "savings"
                      ? "bg-blue-500 text-white"
                      : "bg-red-500 text-white"
                    : isToday
                    ? "bg-gray-200 text-gray-900 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                } ${
                  dayOfWeek === 0
                    ? "text-red-500"
                    : dayOfWeek === 6
                    ? "text-blue-500"
                    : ""
                }`}
              >
                <span className={isSelected || isToday ? "text-current" : ""}>
                  {date.getDate()}
                </span>
                {hasRecords && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected
                        ? "bg-white"
                        : activeTab === "savings"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 달력 하단 정보 */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            이 달 총 {currentMonthRecords.length}개의 기록
            {selectedDate && (
              <span className="ml-2">
                • {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일:{" "}
                {selectedDateRecords.length}개
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 선택된 날짜 금액 표시 */}
      {selectedDate && (
        <div className="card p-4 gradient-card">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일
            </div>
            <div
              className={`text-2xl font-bold mb-1 ${
                activeTab === "savings" ? "text-blue-600" : "text-red-600"
              }`}
            >
              {activeTab === "savings" ? "+" : "-"}
              {selectedDateRecords
                .reduce((sum, record) => sum + record.amount, 0)
                .toLocaleString()}
              원
            </div>
            <p className="text-sm text-gray-600">
              {activeTab === "savings" ? "절약" : "소비"} 총액 (
              {selectedDateRecords.length}개 기록)
            </p>
          </div>
        </div>
      )}

      {/* 선택된 날짜의 기록 목록 */}
      {!selectedDate ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            날짜를 선택해주세요
          </h3>
          <p className="text-sm text-gray-500">
            달력에서 날짜를 클릭하여 해당 날짜의 기록을 확인할 수 있습니다
          </p>
        </div>
      ) : selectedDateRecords.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">
            {activeTab === "savings" ? "🐷" : "💳"}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일에{" "}
            {activeTab === "savings" ? "절약" : "소비"} 기록이 없어요
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {activeTab === "savings"
              ? "절약을 등록해보세요!"
              : "소비를 등록해보세요!"}
          </p>
          <Link
            to={activeTab === "savings" ? "/record" : "/expense"}
            className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "savings"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {activeTab === "savings" ? "절약 등록하기" : "소비 등록하기"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 선택된 날짜 정보 */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
                {selectedDate.getDate()}일 (
                {
                  ["일", "월", "화", "수", "목", "금", "토"][
                    selectedDate.getDay()
                  ]
                }
                )
              </h3>
              <div className="text-sm text-gray-500">
                {selectedDateRecords.length}개 ·{" "}
                {selectedDateRecords
                  .reduce((sum, record) => sum + record.amount, 0)
                  .toLocaleString()}
                원
              </div>
            </div>

            <div className="space-y-3">
              {displayedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer select-none"
                  onClick={() => handleRecordClick(record)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        activeTab === "savings" ? "bg-blue-100" : "bg-red-100"
                      }`}
                    >
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
                          {new Date(record.createdAt).toLocaleTimeString(
                            "ko-KR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold ${
                        activeTab === "savings"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {activeTab === "savings" ? "+" : "-"}
                      {record.amount.toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 더보기 버튼 */}
          {selectedDateRecords.length > ITEMS_PER_PAGE && !showAll && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(true)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "savings"
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                더보기 ({selectedDateRecords.length - ITEMS_PER_PAGE}개 더)
              </button>
            </div>
          )}

          {/* 접기 버튼 */}
          {showAll && selectedDateRecords.length > ITEMS_PER_PAGE && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(false)}
                className="px-6 py-3 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                접기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && recordToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                이 절약 기록을 삭제하시겠습니까?
              </h3>
              <div className="text-sm text-gray-600 mb-2">
                <strong>
                  {recordToDelete.memo || recordToDelete.itemName}
                </strong>
              </div>
              <div className="text-sm text-gray-500">
                {recordToDelete.amount.toLocaleString()}원 ·{" "}
                {recordToDelete.category}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
