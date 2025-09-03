import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import { getCompletedChallengeIds } from "../utils/challengeStorage";
import {
  checkAndCompleteAutoChallenges,
  CHALLENGES,
} from "../utils/challengeAutoComplete";
import ReactConfetti from "react-confetti";

// 챌린지를 기간별로 분류
const DAILY_CHALLENGES = CHALLENGES.filter((c) => c.period === "daily");
const WEEKLY_CHALLENGES = CHALLENGES.filter((c) => c.period === "weekly");
const MONTHLY_CHALLENGES = CHALLENGES.filter((c) => c.period === "monthly");

export default function ChallengesPage() {
  const { user } = useAuthStore();
  const { records, fetchUserRecords } = useSavingRecordStore();
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCompleteChallenge = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000); // 2초 후 사라짐
  };

  // 사용자 데이터 로드
  useEffect(() => {
    if (user?.id) {
      fetchUserRecords(user.id);
    }
  }, [user?.id, fetchUserRecords]);

  // 완료된 챌린지 로드 및 자동 완료 확인
  useEffect(() => {
    if (user?.id && records.length > 0) {
      // 로컬스토리지에서 완료된 챌린지 로드
      const storedCompletions = getCompletedChallengeIds(user.id);
      setCompletedChallenges(storedCompletions);

      // 자동 챌린지 완료 확인
      checkAndCompleteAutoChallenges(records, user.id, (challengeId) => {
        // 새로 완료된 챌린지 알림
        if (!storedCompletions.includes(challengeId)) {
          // 완료 알림
          handleCompleteChallenge();
        }
      }).then((newCompletions) => {
        if (newCompletions.length > 0) {
          // 새로 완료된 챌린지가 있으면 상태 업데이트
          const updatedCompletions = getCompletedChallengeIds(user.id);
          setCompletedChallenges(updatedCompletions);
        }
      });
    }
  }, [user?.id, records]);

  return (
    <div className="space-y-6 pt-6">
      {showCelebration && (
        <>
          <ReactConfetti />
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-pink-600 animate-bounce">
            🎉 챌린지를 완료했어요~ 🎉
          </div>
        </>
      )}

      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">챌린지</h1>
        <p className="text-sm text-gray-600">
          {user?.nickname || user?.username || "사용자"}님, 절약 챌린지에
          도전해보세요!
        </p>
      </div>

      {/* 진행 상황 */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">챌린지 성과</h3>
        <div className="grid grid-cols-1 gap-4">
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
            const isCompleted = completedChallenges.includes(challenge.id);
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={isCompleted}
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
  period,
}: {
  challenge: any;
  isCompleted: boolean;
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
            {isCompleted && (
              <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
                완료됨 ✓
              </span>
            )}
            {!isCompleted && (
              <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg">
                자동 완료 대기중
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
