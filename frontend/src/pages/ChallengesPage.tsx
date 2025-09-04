import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSavingRecordStore } from "../store/useSavingRecordStore";
import {
  checkAndCompleteAutoChallenges,
  getActiveChallenges,
} from "../utils/challengeAutoComplete";
import { challengeCompletionService } from "../services/challengeCompletionService";
import type { Challenge } from "../types/user";
import ReactConfetti from "react-confetti";

export default function ChallengesPage() {
  const { user } = useAuthStore();
  const { records, fetchUserRecords } = useSavingRecordStore();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);

  // 챌린지를 기간별로 분류
  const DAILY_CHALLENGES = challenges.filter((c) => c.duration <= 1);
  const WEEKLY_CHALLENGES = challenges.filter(
    (c) => c.duration > 1 && c.duration <= 7
  );
  const MONTHLY_CHALLENGES = challenges.filter((c) => c.duration > 7);

  const handleCompleteChallenge = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };

  // 그냥..
  useEffect(() => {
    handleCompleteChallenge();
  }, []);

  // 챌린지 목록 로드
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoading(true);
        const activeChallenges = await getActiveChallenges();
        setChallenges(activeChallenges);
      } catch (error) {
        console.error("챌린지 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, []);

  // 사용자 데이터 로드
  useEffect(() => {
    if (user?.id) {
      fetchUserRecords(user.id);
    }
  }, [user?.id, fetchUserRecords]);

  // 완료된 챌린지 로드
  useEffect(() => {
    const loadCompletedChallenges = async () => {
      if (!user?.id) return;

      try {
        const completionsResponse =
          await challengeCompletionService.getChallengeCompletions();
        const completedIds = completionsResponse.completions.map(
          (c) => c.challengeId
        );
        setCompletedChallenges(completedIds);
      } catch (error) {
        console.error("완료된 챌린지 로드 실패:", error);
      }
    };

    if (user?.id) {
      loadCompletedChallenges();
    }
  }, [user?.id]);

  // 자동 챌린지 완료 확인
  useEffect(() => {
    if (user?.id && records.length > 0 && challenges.length > 0) {
      checkAndCompleteAutoChallenges(records, user.id, (challengeId) => {
        // 새로 완료된 챌린지 알림
        if (!completedChallenges.includes(challengeId)) {
          handleCompleteChallenge();
        }
      }).then((newCompletions) => {
        if (newCompletions.length > 0) {
          // 완료된 챌린지 목록 다시 로드
          challengeCompletionService
            .getChallengeCompletions()
            .then((response) => {
              const completedIds = response.completions.map(
                (c) => c.challengeId
              );
              setCompletedChallenges(completedIds);
            })
            .catch((error) =>
              console.error("완료된 챌린지 업데이트 실패:", error)
            );
        }
      });
    }
  }, [user?.id, records, challenges, completedChallenges]);

  if (loading) {
    return (
      <div className="space-y-6 pt-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">챌린지</h1>
          <p className="text-sm text-gray-600">챌린지를 불러오는 중...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      {showCelebration && (
        <>
          <ReactConfetti />
          {/* <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-pink-600 animate-bounce">
            🎉 챌린지를 완료했어요~ 🎉
          </div> */}
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
      {DAILY_CHALLENGES.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">일일 챌린지</h3>
          <div className="space-y-3">
            {DAILY_CHALLENGES.map((challenge) => {
              const isCompleted = completedChallenges.includes(
                challenge.id.toString()
              );
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
      )}

      {/* 주간 챌린지 */}
      {WEEKLY_CHALLENGES.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">주간 챌린지</h3>
          <div className="space-y-3">
            {WEEKLY_CHALLENGES.map((challenge) => {
              const isCompleted = completedChallenges.includes(
                challenge.id.toString()
              );
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
      )}

      {/* 월간 챌린지 */}
      {MONTHLY_CHALLENGES.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">월간 챌린지</h3>
          <div className="space-y-3">
            {MONTHLY_CHALLENGES.map((challenge) => {
              const isCompleted = completedChallenges.includes(
                challenge.id.toString()
              );
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
      )}

      {/* 챌린지가 없는 경우 */}
      {challenges.length === 0 && !loading && (
        <div className="card p-6 text-center">
          <div className="text-gray-500 mb-2">🎯</div>
          <h3 className="font-medium text-gray-900 mb-1">
            활성 챌린지가 없습니다
          </h3>
          <p className="text-sm text-gray-600">
            새로운 챌린지가 곧 개발될 예정입니다!
          </p>
        </div>
      )}
    </div>
  );
}

function ChallengeCard({
  challenge,
  isCompleted,
  period,
}: {
  challenge: Challenge;
  isCompleted: boolean;
  period: string;
}) {
  // 챌린지 제목 기반으로 아이콘 결정
  const getIcon = (title: string) => {
    if (title.includes("커피")) return "☕";
    if (title.includes("택시") || title.includes("교통")) return "🚕";
    if (title.includes("배달") || title.includes("음식")) return "🍕";
    if (title.includes("쇼핑") || title.includes("구매")) return "🛍️";
    if (title.includes("목표") || title.includes("절약")) return "🎯";
    if (title.includes("연속") || title.includes("스트릭")) return "🔥";
    return "🏆";
  };

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
          <span className="text-xl">
            {isCompleted ? "✅" : getIcon(challenge.title)}
          </span>
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
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-brand-600">
                경험치 +{challenge.experienceReward.toLocaleString()}
              </span>
              {challenge.targetAmount > 0 && (
                <span className="text-xs text-gray-500">
                  목표: {challenge.targetAmount.toLocaleString()}원
                </span>
              )}
            </div>
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
