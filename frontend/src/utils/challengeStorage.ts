// 챌린지 완료 상태 로컬스토리지 관리
interface ChallengeCompletion {
  challengeId: string;
  completedAt: string;
  period: "daily" | "weekly" | "monthly";
  userId: number;
}

// 로컬스토리지 키
const STORAGE_KEY = "challenge_completions";

// 현재 시간 기준으로 기간별 만료 확인
const isExpired = (
  completedAt: string,
  period: "daily" | "weekly" | "monthly"
): boolean => {
  const completedDate = new Date(completedAt);
  const now = new Date();

  switch (period) {
    case "daily":
      // 다음 날이 되면 만료
      const nextDay = new Date(completedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return now >= nextDay;

    case "weekly":
      // 7일 후 만료
      const nextWeek = new Date(completedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return now >= nextWeek;

    case "monthly":
      // 30일 후 만료
      const nextMonth = new Date(completedDate);
      nextMonth.setDate(nextMonth.getDate() + 30);
      return now >= nextMonth;

    default:
      return false;
  }
};

// 로컬스토리지에서 완료 기록 가져오기
export const getChallengeCompletions = (
  userId: number
): ChallengeCompletion[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const completions: ChallengeCompletion[] = JSON.parse(stored);

    // 사용자별 필터링 및 만료된 항목 제거
    return completions.filter(
      (completion) =>
        completion.userId === userId &&
        !isExpired(completion.completedAt, completion.period)
    );
  } catch (error) {
    console.error("챌린지 완료 기록 로드 실패:", error);
    return [];
  }
};

// 챌린지 완료 저장
export const saveChallengeCompletion = (
  challengeId: string,
  period: "daily" | "weekly" | "monthly",
  userId: number
): void => {
  try {
    const existingCompletions = getChallengeCompletions(userId);

    // 이미 완료된 챌린지인지 확인
    const alreadyCompleted = existingCompletions.some(
      (completion) => completion.challengeId === challengeId
    );

    if (alreadyCompleted) {
      return; // 이미 완료됨
    }

    const newCompletion: ChallengeCompletion = {
      challengeId,
      completedAt: new Date().toISOString(),
      period,
      userId,
    };

    // 모든 사용자의 완료 기록 가져오기
    const stored = localStorage.getItem(STORAGE_KEY);
    const allCompletions: ChallengeCompletion[] = stored
      ? JSON.parse(stored)
      : [];

    // 새 완료 기록 추가
    allCompletions.push(newCompletion);

    // 만료된 기록들 정리
    const validCompletions = allCompletions.filter(
      (completion) => !isExpired(completion.completedAt, completion.period)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validCompletions));
  } catch (error) {
    console.error("챌린지 완료 저장 실패:", error);
  }
};

// 특정 챌린지 완료 여부 확인
export const isChallengeCompleted = (
  challengeId: string,
  userId: number
): boolean => {
  const completions = getChallengeCompletions(userId);
  return completions.some(
    (completion) => completion.challengeId === challengeId
  );
};

// 완료된 챌린지 ID 목록 반환
export const getCompletedChallengeIds = (userId: number): string[] => {
  const completions = getChallengeCompletions(userId);
  return completions.map((completion) => completion.challengeId);
};
