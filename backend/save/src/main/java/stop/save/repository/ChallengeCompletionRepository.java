package stop.save.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import stop.save.entity.ChallengeCompletion;
import stop.save.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeCompletionRepository extends JpaRepository<ChallengeCompletion, Long> {

    // 특정 사용자의 모든 챌린지 완료 기록
    List<ChallengeCompletion> findByUserOrderByCompletedAtDesc(User user);

    // 특정 사용자의 특정 챌린지 완료 기록
    Optional<ChallengeCompletion> findByUserAndChallengeId(User user, String challengeId);

    // 특정 기간 내 완료된 챌린지 확인
    @Query("SELECT cc FROM ChallengeCompletion cc WHERE cc.user = :user AND cc.challengeId = :challengeId AND cc.completedAt >= :since")
    Optional<ChallengeCompletion> findRecentCompletion(@Param("user") User user, 
                                                      @Param("challengeId") String challengeId, 
                                                      @Param("since") LocalDateTime since);

    // 사용자의 기간별 완료된 챌린지 개수
    @Query("SELECT COUNT(cc) FROM ChallengeCompletion cc WHERE cc.user = :user AND cc.period = :period AND cc.completedAt >= :since")
    Long countByUserAndPeriodSince(@Param("user") User user, 
                                   @Param("period") ChallengeCompletion.ChallengePeriod period, 
                                   @Param("since") LocalDateTime since);

    // 사용자의 총 완료 챌린지 개수
    Long countByUser(User user);

    // 사용자의 총 보상 금액
    @Query("SELECT COALESCE(SUM(cc.rewardAmount), 0) FROM ChallengeCompletion cc WHERE cc.user = :user")
    Long getTotalRewardsByUser(@Param("user") User user);
}
