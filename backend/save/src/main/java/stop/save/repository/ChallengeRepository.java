package stop.save.repository;

import stop.save.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    // 활성 상태인 챌린지만 조회
    List<Challenge> findByIsActiveTrueOrderByCreatedAtDesc();

    // 목표 금액 범위로 챌린지 조회
    List<Challenge> findByTargetAmountBetweenAndIsActiveTrue(Long minAmount, Long maxAmount);

    // 기간별 챌린지 조회
    List<Challenge> findByDurationAndIsActiveTrueOrderByTargetAmountAsc(Integer duration);
}