import { Link } from "react-router-dom";
import { useSavingsStore } from "../store/useSavingsStore";
import { useAuthStore } from "../store/useAuthStore";

export default function HomePage() {
  const { balance, level, experience, records } = useSavingsStore();
  const { user } = useAuthStore();

  // 오늘 절약한 금액 계산
  const today = new Date().toDateString();
  const todaySavings = records
    .filter((record) => new Date(record.createdAt).toDateString() === today)
    .reduce((sum, record) => sum + record.amount, 0);

  const nextLevelXP = Math.max(0, level * 100 - experience);
  const progressPercent = (experience / (level * 100)) * 100;

  return (
    <div className="space-y-6 pt-6">
      {/* 메인 카드 */}
      <div className="card p-6 gradient-card">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {user?.nickname || user?.username || "사용자"} 님의 절약
          </p>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {balance.toLocaleString()}원
          </div>
          <p className="text-xs text-gray-500">해지일 | 2025.12.31</p>
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
          value={`${todaySavings.toLocaleString()}원`}
          icon="💰"
          trend={todaySavings > 0 ? `+${todaySavings.toLocaleString()}` : "0"}
        />
        <StatCard
          title="이번 달"
          value={`${balance.toLocaleString()}원`}
          icon="📈"
          trend={`${records.length}회 절약`}
        />
      </div>

      {/* 최근 기록 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">최근 절약</h3>
          <Link to="/stats" className="text-xs text-brand-600">
            전체보기
          </Link>
        </div>

        {records.length === 0 ? (
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
            {records.slice(0, 3).map((record) => (
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
                      {record.memo || record.category}
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
