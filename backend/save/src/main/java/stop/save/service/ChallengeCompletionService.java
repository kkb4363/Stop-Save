package stop.save.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stop.save.entity.ChallengeCompletion;
import stop.save.entity.User;
import stop.save.repository.ChallengeCompletionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChallengeCompletionService {

    private final ChallengeCompletionRepository challengeCompletionRepository;

    /**
     * 챌린지 완료 기록 저장
     */
    public synchronized ChallengeCompletion completeChallenge(User user, String challengeId, String challengeTitle, 
                                               ChallengeCompletion.ChallengePeriod period, Integer rewardAmount) {
        
        // 중복 완료 방지 - 기간에 따라 다르게 처리
        LocalDateTime checkSince = getCheckSinceTime(period);
        Optional<ChallengeCompletion> existingCompletion = challengeCompletionRepository
                .findRecentCompletion(user, challengeId, checkSince);
        
        if (existingCompletion.isPresent()) {
            log.info("챌린지 {} 이미 완료됨 (사용자: {}, 완료일: {})", 
                    challengeId, user.getId(), existingCompletion.get().getCompletedAt());
            return existingCompletion.get();
        }

        try {
            // 새로운 완료 기록 생성
            ChallengeCompletion completion = new ChallengeCompletion(user, challengeId, challengeTitle, period, rewardAmount);
            ChallengeCompletion saved = challengeCompletionRepository.save(completion);
            
            log.info("챌린지 완료 저장: {} (사용자: {}, 보상: {}원)", challengeTitle, user.getId(), rewardAmount);
            return saved;
            
        } catch (Exception e) {
            // 유니크 제약조건 위반 등으로 실패한 경우, 기존 기록 다시 조회
            log.warn("챌린지 완료 저장 실패, 기존 기록 조회: {}", e.getMessage());
            Optional<ChallengeCompletion> retryCompletion = challengeCompletionRepository
                    .findRecentCompletion(user, challengeId, checkSince);
            
            if (retryCompletion.isPresent()) {
                return retryCompletion.get();
            }
            
            // 그래도 없으면 예외 발생
            throw new RuntimeException("챌린지 완료 처리 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 사용자의 모든 챌린지 완료 기록 조회
     */
    @Transactional(readOnly = true)
    public List<ChallengeCompletion> getUserChallengeCompletions(User user) {
        return challengeCompletionRepository.findByUserOrderByCompletedAtDesc(user);
    }

    /**
     * 특정 챌린지의 최근 완료 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isRecentlyCompleted(User user, String challengeId, ChallengeCompletion.ChallengePeriod period) {
        LocalDateTime checkSince = getCheckSinceTime(period);
        return challengeCompletionRepository.findRecentCompletion(user, challengeId, checkSince).isPresent();
    }

    /**
     * 사용자의 총 완료 챌린지 개수
     */
    @Transactional(readOnly = true)
    public Long getTotalCompletionCount(User user) {
        return challengeCompletionRepository.countByUser(user);
    }

    /**
     * 사용자의 총 챌린지 보상 금액
     */
    @Transactional(readOnly = true)
    public Long getTotalRewards(User user) {
        return challengeCompletionRepository.getTotalRewardsByUser(user);
    }

    /**
     * 기간별 체크 시작 시간 계산
     */
    private LocalDateTime getCheckSinceTime(ChallengeCompletion.ChallengePeriod period) {
        LocalDateTime now = LocalDateTime.now();
        
        switch (period) {
            case DAILY:
                // 오늘 00:00:00부터
                return now.toLocalDate().atStartOfDay();
            case WEEKLY:
                // 7일 전부터
                return now.minusDays(7);
            case MONTHLY:
                // 30일 전부터
                return now.minusDays(30);
            default:
                return now.minusDays(1);
        }
    }
}
