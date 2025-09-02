import { useState } from "react";
import { useSavingsStore } from "../store/useSavingsStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const QUICK_ITEMS = [
  { label: "커피", amount: 4500, category: "음식", icon: "☕" },
  { label: "택시", amount: 12000, category: "교통", icon: "🚕" },
  { label: "배달", amount: 18000, category: "음식", icon: "🍕" },
  { label: "간식", amount: 2500, category: "음식", icon: "🍿" },
  { label: "영화", amount: 15000, category: "엔터테인먼트", icon: "🎬" },
  { label: "쇼핑", amount: 30000, category: "쇼핑", icon: "🛍️" },
];

const CATEGORIES = [
  { value: "음식", icon: "🍔" },
  { value: "교통", icon: "🚗" },
  { value: "쇼핑", icon: "🛍️" },
  { value: "엔터테인먼트", icon: "🎬" },
  { value: "기타", icon: "💡" },
];

export default function RecordPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("기타");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addRecord = useSavingsStore((s) => s.addRecord);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (amount === "" || amount <= 0) return;

    setIsSubmitting(true);

    // 애니메이션을 위한 딜레이
    setTimeout(() => {
      addRecord({
        amount: Number(amount),
        category: category as any,
        memo,
      });

      // 성공 피드백
      setAmount("");
      setMemo("");
      setIsSubmitting(false);

      // 홈으로 이동
      navigate("/");
    }, 500);
  };

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">절약 등록</h1>
        <p className="text-sm text-gray-600">
          {user?.nickname || user?.username || "사용자"}님, 오늘 참은 소비를
          기록해보세요
        </p>
      </div>

      {/* 빠른 선택 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">빠른 선택</h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ITEMS.map((item) => (
            <button
              key={item.label}
              className="card-hover p-3 rounded-xl border border-gray-200 bg-white text-left transition-all"
              onClick={() => {
                setAmount(item.amount);
                setCategory(item.category);
                setMemo(`${item.label} 참음`);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-brand-600 font-semibold">
                    +{item.amount.toLocaleString()}원
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 직접 입력 */}
      <div className="card p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">직접 입력</h3>

        {/* 금액 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            절약 금액
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full text-right text-2xl font-bold bg-gray-50 border-0 rounded-xl pr-8 pl-4 py-4 focus:ring-2 focus:ring-brand-500 focus:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">
              원
            </span>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            카테고리
          </label>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`p-3 rounded-xl border transition-all ${
                  category === cat.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
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
            className="w-full bg-gray-50 border-0 rounded-xl p-4 focus:ring-2 focus:ring-brand-500 focus:bg-white"
            placeholder="어떤 소비를 참았나요?"
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
              ? "gradient-primary text-white active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              저장 중...
            </div>
          ) : (
            `${
              amount ? `${Number(amount).toLocaleString()}원` : "0원"
            } 절약 등록`
          )}
        </button>
      </div>
    </div>
  );
}
