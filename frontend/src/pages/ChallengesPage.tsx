import { useState } from "react";
import { useSavingsStore } from "../store/useSavingsStore";

const DAILY_CHALLENGES = [
  {
    id: "coffee",
    title: "커피 한 잔 참기",
    reward: 5000,
    icon: "☕",
    description: "오늘 하루 커피를 마시지 않기",
  },
  {
    id: "snack",
    title: "간식 참기",
    reward: 3000,
    icon: "🍿",
    description: "편의점 간식 구매하지 않기",
  },
  {
    id: "taxi",
    title: "택시 대신 대중교통",
    reward: 8000,
    icon: "🚕",
    description: "택시 대신 지하철/버스 이용하기",
  },
];

const WEEKLY_CHALLENGES = [
  {
    id: "delivery",
    title: "배달음식 0회",
    reward: 30000,
    icon: "🍕",
    description: "이번 주 배달음식 주문하지 않기",
  },
  {
    id: "shopping",
    title: "충동구매 참기",
    reward: 25000,
    icon: "🛍️",
    description: "계획에 없던 쇼핑 참기",
  },
];

const MONTHLY_CHALLENGES = [
  {
    id: "target",
    title: "10만원 절약하기",
    reward: 100000,
    icon: "🎯",
    description: "한 달간 10만원 이상 절약하기",
  },
  {
    id: "streak",
    title: "30일 연속 절약",
    reward: 50000,
    icon: "🔥",
    description: "30일 연속으로 절약 기록하기",
  },
];

export default function ChallengesPage() {
  const { records, balance } = useSavingsStore();
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const completeChallenge = (challengeId: string) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId]);
    }
  };

  // 오늘 기록 확인
  const today = new Date().toDateString();
  const todayRecords = records.filter(
    (record) => new Date(record.createdAt).toDateString() === today
  );

  return (
    <div className="space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">챌린지</h1>
        <p className="text-sm text-gray-600">절약 챌린지에 도전해보세요!</p>
      </div>

      {/* 진행 상황 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">오늘의 성과</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-600">
              {todayRecords.length}
            </div>
            <div className="text-xs text-gray-500">오늘 절약 횟수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-600">
              {completedChallenges.length}
            </div>
            <div className="text-xs text-gray-500">완료한 챌린지</div>
          </div>
        </div>
      </div>

      {/* 일일 챌린지 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">일일 챌린지</h3>
        <div className="space-y-3">
          {DAILY_CHALLENGES.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={isCompleted}
                onComplete={() => completeChallenge(challenge.id)}
                period="일일"
              />
            );
          })}
        </div>
      </div>

      {/* 주간 챌린지 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">주간 챌린지</h3>
        <div className="space-y-3">
          {WEEKLY_CHALLENGES.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={isCompleted}
                onComplete={() => completeChallenge(challenge.id)}
                period="주간"
              />
            );
          })}
        </div>
      </div>

      {/* 월간 챌린지 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-4">월간 챌린지</h3>
        <div className="space-y-3">
          {MONTHLY_CHALLENGES.map((challenge) => {
            const isCompleted =
              challenge.id === "target"
                ? balance >= 100000
                : completedChallenges.includes(challenge.id);
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={isCompleted}
                onComplete={() => completeChallenge(challenge.id)}
                period="월간"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({
  challenge,
  isCompleted,
  onComplete,
  period,
}: {
  challenge: any;
  isCompleted: boolean;
  onComplete: () => void;
  period: string;
}) {
  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        isCompleted
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white hover:border-brand-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isCompleted ? "bg-green-100" : "bg-brand-100"
          }`}
        >
          <span className="text-xl">{isCompleted ? "✅" : challenge.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{challenge.title}</h4>
            <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded-full">
              {period}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-600">
              +{challenge.reward.toLocaleString()}원
            </span>
            {!isCompleted && (
              <button
                onClick={onComplete}
                className="text-xs px-3 py-1 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                완료하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
