package stop.save.controller;

import stop.save.entity.Challenge;
import stop.save.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    // 모든 활성 챌린지 조회
    @GetMapping
    public ResponseEntity<List<Challenge>> getActiveChallenges() {
        List<Challenge> challenges = challengeService.getActiveChallenges();
        return ResponseEntity.ok(challenges);
    }

    // 챌린지 상세 조회
    @GetMapping("/{challengeId}")
    public ResponseEntity<?> getChallengeById(@PathVariable Long challengeId) {
        Optional<Challenge> challenge = challengeService.getChallengeById(challengeId);
        if (challenge.isPresent()) {
            return ResponseEntity.ok(challenge.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 추천 챌린지 조회
    @GetMapping("/recommend/{userTotalSavings}")
    public ResponseEntity<List<Challenge>> getRecommendedChallenges(@PathVariable Long userTotalSavings) {
        List<Challenge> challenges = challengeService.getRecommendedChallenges(userTotalSavings);
        return ResponseEntity.ok(challenges);
    }

    // 기간별 챌린지 조회 (7일, 30일 등)
    @GetMapping("/duration/{duration}")
    public ResponseEntity<List<Challenge>> getChallengesByDuration(@PathVariable Integer duration) {
        List<Challenge> challenges = challengeService.getChallengesByDuration(duration);
        return ResponseEntity.ok(challenges);
    }
}