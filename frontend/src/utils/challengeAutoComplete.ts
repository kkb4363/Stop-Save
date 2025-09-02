import type { SavingRecord } from "../types/user";
import { saveChallengeCompletion } from "./challengeStorage";
import { challengeCompletionService } from "../services/challengeCompletionService";

// 챌린지 타입 정의
interface Challenge {
  id: string;
  title: string;
  reward: number;
  icon: string;
  description: string;
  category?: string; // 특정 카테고리 챌린지용
  amount?: number; // 특정 금액 챌린지용
  period: "daily" | "weekly" | "monthly";
}

// 챌린지 정의 (기존 챌린지들을 확장)
export const CHALLENGES: Challenge[] = [
  // 일일 챌린지
  {
    id: "coffee",
    title: "커피 한 잔 참기",
    reward: 5000,
    icon: "☕",
    description: "오늘 하루 커피를 마시지 않기",
    category: "음식",
    amount: 5000,
    period: "daily",
  },
  {
    id: "snack",
    title: "간식 참기",
    reward: 3000,
    icon: "🍿",
    description: "편의점 간식 구매하지 않기",
    category: "음식",
    amount: 3000,
    period: "daily",
  },
  {
    id: "taxi",
    title: "택시 대신 대중교통",
    reward: 8000,
    icon: "🚕",
    description: "택시 대신 지하철/버스 이용하기",
    category: "교통",
    amount: 8000,
    period: "daily",
  },

  // 주간 챌린지
  {
    id: "delivery",
    title: "배달음식 0회",
    reward: 30000,
    icon: "🍕",
    description: "이번 주 배달음식 주문하지 않기",
    category: "음식",
    amount: 30000,
    period: "weekly",
  },
  {
    id: "shopping",
    title: "충동구매 참기",
    reward: 25000,
    icon: "🛍️",
    description: "계획에 없던 쇼핑 참기",
    category: "쇼핑",
    amount: 25000,
    period: "weekly",
  },

  // 월간 챌린지
  {
    id: "target",
    title: "10만원 절약하기",
    reward: 100000,
    icon: "🎯",
    description: "한 달간 10만원 이상 절약하기",
    amount: 100000,
    period: "monthly",
  },
  {
    id: "streak",
    title: "30일 연속 절약",
    reward: 50000,
    icon: "🔥",
    description: "30일 연속으로 절약 기록하기",
    period: "monthly",
  },
];

// 기간별 레코드 필터링
const getRecordsByPeriod = (
  records: SavingRecord[],
  period: "daily" | "weekly" | "monthly"
): SavingRecord[] => {
  const now = new Date();

  return records.filter((record) => {
    const recordDate = new Date(record.createdAt);

    switch (period) {
      case "daily":
        // 오늘 기록들
        return recordDate.toDateString() === now.toDateString();

      case "weekly":
        // 지난 7일 기록들
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return recordDate >= weekAgo;

      case "monthly":
        // 지난 30일 기록들
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return recordDate >= monthAgo;

      default:
        return false;
    }
  });
};

// 연속 기록 일수 계산
const getConsecutiveDays = (records: SavingRecord[]): number => {
  if (records.length === 0) return 0;

  // 날짜별로 그룹화
  const dateGroups = records.reduce((groups, record) => {
    const date = new Date(record.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, SavingRecord[]>);

  const dates = Object.keys(dateGroups).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let consecutiveDays = 0;
  let currentDate = new Date();

  for (const dateStr of dates) {
    const recordDate = new Date(dateStr);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - consecutiveDays);
    expectedDate.setHours(0, 0, 0, 0);
    recordDate.setHours(0, 0, 0, 0);

    if (recordDate.getTime() === expectedDate.getTime()) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return consecutiveDays;
};

// 자동 챌린지 완료 확인
export const checkAndCompleteAutoChallenges = async (
  records: SavingRecord[],
  userId: number,
  onChallengeCompleted?: (challengeId: string, challenge: Challenge) => void
): Promise<string[]> => {
  const completedChallenges: string[] = [];

  for (const challenge of CHALLENGES) {
    try {
      let isCompleted = false;
      const periodRecords = getRecordsByPeriod(records, challenge.period);

      switch (challenge.id) {
        case "coffee":
        case "snack":
        case "taxi":
        case "delivery":
        case "shopping":
          // 특정 카테고리와 금액으로 챌린지 완료 확인
          if (challenge.category && challenge.amount) {
            const categoryAmount = periodRecords
              .filter((record) => record.category === challenge.category)
              .reduce((sum, record) => sum + record.amount, 0);

            isCompleted = categoryAmount >= challenge.amount;
          }
          break;

        case "target":
          // 월간 목표 금액 달성
          const monthlyTotal = periodRecords.reduce(
            (sum, record) => sum + record.amount,
            0
          );
          isCompleted = monthlyTotal >= 100000;
          break;

        case "streak":
          // 30일 연속 기록
          const consecutiveDays = getConsecutiveDays(records);
          isCompleted = consecutiveDays >= 30;
          break;

        default:
          break;
      }

      if (isCompleted) {
        // 로컬스토리지에 완료 상태 저장
        saveChallengeCompletion(challenge.id, challenge.period, userId);
        completedChallenges.push(challenge.id);

        // 백엔드에 완료 상태 저장
        try {
          await challengeCompletionService.completeChallenge({
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            period: challenge.period,
            rewardAmount: challenge.reward,
          });
          console.log(`✅ 챌린지 "${challenge.title}" 백엔드에 저장 완료`);
        } catch (error) {
          console.error(
            `❌ 챌린지 "${challenge.title}" 백엔드 저장 실패:`,
            error
          );
          // 백엔드 저장 실패해도 로컬 완료 상태는 유지
        }

        // 콜백 함수 호출 (알림 등을 위해)
        if (onChallengeCompleted) {
          onChallengeCompleted(challenge.id, challenge);
        }
      }
    } catch (error) {
      console.error(`챌린지 ${challenge.id} 자동 완료 확인 실패:`, error);
    }
  }

  return completedChallenges;
};
