import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useExpenseRecordStore } from "../store/useExpenseRecordStore";

// const QUICK_EXPENSES = [
//   { label: "커피", amount: 4500, category: "음식", icon: "☕" },
//   { label: "점심", amount: 12000, category: "음식", icon: "🍱" },
//   { label: "택시", amount: 8000, category: "교통", icon: "🚕" },
//   { label: "편의점", amount: 3000, category: "생필품", icon: "🏪" },
//   { label: "영화", amount: 15000, category: "엔터테인먼트", icon: "🎬" },
//   { label: "옷", amount: 50000, category: "쇼핑", icon: "👕" },
// ];

const EXPENSE_CATEGORIES = [
  { value: "음식", icon: "🍔" },
  { value: "교통", icon: "🚗" },
  { value: "쇼핑", icon: "🛍️" },
  { value: "생필품", icon: "🏪" },
  { value: "엔터테인먼트", icon: "🎬" },
  { value: "의료", icon: "🏥" },
  { value: "교육", icon: "📚" },
  { value: "기타", icon: "💳" },
];

export default function ExpensePage() {
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("기타");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createRecord } = useExpenseRecordStore();

  const handleSubmit = async () => {
    if (amount === "" || amount <= 0 || !user) return;

    setIsSubmitting(true);

    try {
      await createRecord({
        itemName: memo || category,
        amount: Number(amount),
        category,
        memo,
      });

      // 성공 피드백
      setAmount("");
      setMemo("");
      setIsSubmitting(false);

      // 홈으로 이동
      navigate("/", {
        state: {
          success: true,
          type: "expense",
        },
      });
    } catch (error) {
      console.error("소비 기록 등록 실패:", error);
      setIsSubmitting(false);
      alert("소비 기록 등록에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">소비 등록</h1>
        <p className="text-sm text-gray-600">
          {user?.nickname || user?.username || "사용자"}님, 오늘의 소비를
          기록해보세요
        </p>
      </div>

      {/* 빠른 선택 */}
      {/* <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">빠른 선택</h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_EXPENSES.map((item) => (
            <button
              key={item.label}
              className="card-hover p-3 rounded-xl border border-gray-200 bg-white text-left transition-all"
              onClick={() => {
                setAmount(item.amount);
                setCategory(item.category);
                setMemo(`${item.label} 구매`);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-red-600 font-semibold">
                    -{item.amount.toLocaleString()}원
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div> */}

      {/* 직접 입력 */}
      <div className="card p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">직접 입력</h3>

        {/* 금액 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            소비 금액 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full bg-gray-50 border-0 rounded-xl p-4 pr-12 text-right text-lg font-semibold focus:ring-2 focus:ring-red-500 focus:bg-white"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || "")}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              원
            </span>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <div className="grid grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  category === cat.value
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setCategory(cat.value)}
              >
                <div className="text-lg mb-1">{cat.icon}</div>
                <div className="text-xs font-medium">{cat.value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 메모 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            메모 (선택)
          </label>
          <input
            type="text"
            className="w-full bg-gray-50 border-0 rounded-xl p-4 focus:ring-2 focus:ring-red-500 focus:bg-white"
            placeholder="무엇을 구매하셨나요?"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
      </div>

      {/* 등록 버튼 */}
      <div className="pb-6">
        <button
          onClick={handleSubmit}
          disabled={amount === "" || amount <= 0 || isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            amount && amount > 0 && !isSubmitting
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white active:scale-95 shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              등록 중...
            </div>
          ) : (
            `${amount ? amount.toLocaleString() : "0"}원 소비 등록`
          )}
        </button>
      </div>
    </div>
  );
}
