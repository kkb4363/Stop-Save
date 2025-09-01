package stop.save.service;

import stop.save.entity.Challenge;
import stop.save.repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    // 모든 활성 챌린지 조회
    public List<Challenge> getActiveChallenges() {
        return challengeRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    // 챌린지 상세 조회
    public Optional<Challenge> getChallengeById(Long id) {
        return challengeRepository.findById(id);
    }

    // 목표 금액별 챌린지 추천
    public List<Challenge> getRecommendedChallenges(Long userTotalSavings) {
        Long minAmount = userTotalSavings;
        Long maxAmount = userTotalSavings + 100000L; // 현재보다 10만원 높은 범위
        return challengeRepository.findByTargetAmountBetweenAndIsActiveTrue(minAmount, maxAmount);
    }

    // 기간별 챌린지 조회
    public List<Challenge> getChallengesByDuration(Integer duration) {
        return challengeRepository.findByDurationAndIsActiveTrueOrderByTargetAmountAsc(duration);
    }

    // 새 챌린지 생성 (관리자용)
    public Challenge createChallenge(String title, String description, Long targetAmount, Integer duration, Integer experienceReward) {
        Challenge challenge = new Challenge();
        challenge.setTitle(title);
        challenge.setDescription(description);
        challenge.setTargetAmount(targetAmount);
        challenge.setDuration(duration);
        challenge.setExperienceReward(experienceReward);
        challenge.setIsActive(true);

        return challengeRepository.save(challenge);
    }

    // 챌린지 비활성화
    public Challenge deactivateChallenge(Long challengeId) {
        Optional<Challenge> challengeOpt = challengeRepository.findById(challengeId);
        if (challengeOpt.isPresent()) {
            Challenge challenge = challengeOpt.get();
            challenge.setIsActive(false);
            return challengeRepository.save(challenge);
        }
        throw new RuntimeException("챌린지를 찾을 수 없습니다.");
    }
}