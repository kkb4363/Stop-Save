import type { SavingRecord, Challenge } from "../types/user";
import { challengeCompletionService } from "../services/challengeCompletionService";
import { challengeService } from "../services/challengeService";

// 로컬 챌린지 타입 정의 (기존 로직과 호환성 유지)
interface LocalChallenge {
  id: string;
  title: string;
  reward: number;
  icon: string;
  description: string;
  category?: string; // 특정 카테고리 챌린지용
  amount?: number; // 특정 금액 챌린지용
  period: "daily" | "weekly" | "monthly";
}

// 백엔드에서 활성 챌린지 목록 가져오기
export const getActiveChallenges = async (): Promise<Challenge[]> => {
  try {
    return await challengeService.getActiveChallenges();
  } catch (error) {
    console.error("활성 챌린지 목록을 가져오는데 실패했습니다:", error);
    return [];
  }
};

// 백엔드 챌린지를 로컬 챌린지 형태로 변환 (기존 로직 호환성 유지)
const convertToLocalChallenge = (challenge: Challenge): LocalChallenge => {
  // 기간을 일수 기준으로 변환
  let period: "daily" | "weekly" | "monthly" = "daily";
  if (challenge.duration <= 1) {
    period = "daily";
  } else if (challenge.duration <= 7) {
    period = "weekly";
  } else {
    period = "monthly";
  }

  return {
    id: challenge.id.toString(),
    title: challenge.title,
    reward: challenge.experienceReward,
    icon: getIconForChallenge(challenge.title), // 제목 기반으로 아이콘 매핑
    description: challenge.description,
    amount: challenge.targetAmount,
    period: period,
  };
};

// 챌린지 제목 기반으로 아이콘 매핑
const getIconForChallenge = (title: string): string => {
  if (title.includes("커피")) return "☕";
  if (title.includes("택시") || title.includes("교통")) return "🚕";
  if (title.includes("배달") || title.includes("음식")) return "🍕";
  if (title.includes("쇼핑") || title.includes("구매")) return "🛍️";
  if (title.includes("목표") || title.includes("절약")) return "🎯";
  if (title.includes("연속") || title.includes("스트릭")) return "🔥";
  return "🏆"; // 기본 아이콘
};

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

      case "weekly": {
        // 지난 7일 기록들
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return recordDate >= weekAgo;
      }

      case "monthly": {
        // 지난 30일 기록들
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return recordDate >= monthAgo;
      }

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
  const currentDate = new Date();

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

// 진행 중인 챌린지 완료 요청들을 추적
const pendingCompletions = new Set<string>();

// 자동 챌린지 완료 확인
export const checkAndCompleteAutoChallenges = async (
  records: SavingRecord[],
  userId: number,
  onChallengeCompleted?: (
    challengeId: string,
    challenge: LocalChallenge
  ) => void
): Promise<string[]> => {
  const completedChallenges: string[] = [];

  try {
    // 백엔드에서 활성 챌린지 목록 가져오기
    const backendChallenges = await getActiveChallenges();
    const localChallenges = backendChallenges.map(convertToLocalChallenge);

    for (const challenge of localChallenges) {
      try {
        let isCompleted = false;
        const periodRecords = getRecordsByPeriod(records, challenge.period);

        // 챌린지 완료 조건 확인 - 백엔드 챌린지는 targetAmount 기준으로 판단
        if (challenge.amount) {
          if (challenge.period === "monthly") {
            // 월간 챌린지: 기간 내 총 절약 금액
            const totalAmount = periodRecords.reduce(
              (sum, record) => sum + record.amount,
              0
            );
            isCompleted = totalAmount >= challenge.amount;
          } else if (challenge.period === "weekly") {
            // 주간 챌린지: 기간 내 총 절약 금액
            const totalAmount = periodRecords.reduce(
              (sum, record) => sum + record.amount,
              0
            );
            isCompleted = totalAmount >= challenge.amount;
          } else {
            // 일일 챌린지: 오늘 절약 금액
            const dailyAmount = periodRecords.reduce(
              (sum, record) => sum + record.amount,
              0
            );
            isCompleted = dailyAmount >= challenge.amount;
          }
        } else {
          // 금액이 없는 챌린지 (예: 연속 기록)
          if (challenge.title.includes("연속")) {
            const consecutiveDays = getConsecutiveDays(records);
            isCompleted = consecutiveDays >= 30;
          } else {
            // 기본적으로 기간 내 기록이 있으면 완료
            isCompleted = periodRecords.length > 0;
          }
        }

        if (isCompleted) {
          const completionKey = `${userId}-${challenge.id}-${challenge.period}`;

          // 이미 진행 중인 요청이 있으면 스킵
          if (pendingCompletions.has(completionKey)) {
            console.log(`⏳ 챌린지 "${challenge.title}" 이미 처리 중...`);
            continue;
          }

          // 백엔드에서 이미 완료된 챌린지인지 확인
          try {
            const statusResponse =
              await challengeCompletionService.getChallengeStatus(
                challenge.id,
                challenge.period
              );

            if (statusResponse.isCompleted) {
              console.log(`✅ 챌린지 "${challenge.title}" 이미 완료됨`);
              continue;
            }
          } catch (error) {
            console.error(`챌린지 상태 확인 실패: ${challenge.title}`, error);
            // 상태 확인 실패 시 계속 진행
          }

          completedChallenges.push(challenge.id);

          // 백엔드에 완료 상태 저장
          pendingCompletions.add(completionKey);

          try {
            await challengeCompletionService.completeChallenge({
              challengeId: challenge.id,
              challengeTitle: challenge.title,
              period: challenge.period,
              rewardAmount: challenge.reward,
            });
            console.log(`✅ 챌린지 "${challenge.title}" 완료 저장 성공`);
          } catch (error) {
            console.error(
              `❌ 챌린지 "${challenge.title}" 완료 저장 실패:`,
              error
            );
            // 저장 실패 시 완료 목록에서 제거
            const index = completedChallenges.indexOf(challenge.id);
            if (index > -1) {
              completedChallenges.splice(index, 1);
            }
          } finally {
            // 요청 완료 후 추적에서 제거
            pendingCompletions.delete(completionKey);
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
  } catch (error) {
    console.error("챌린지 목록을 가져오는데 실패했습니다:", error);
  }

  return completedChallenges;
};
