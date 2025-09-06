//package com.savebuddy.controller;
//
//import jakarta.servlet.http.HttpSession;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import com.savebuddy.entity.ChallengeCompletion;
//import com.savebuddy.entity.User;
//import com.savebuddy.service.ChallengeCompletionService;
//import com.savebuddy.service.UserService;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/challenges")
//@RequiredArgsConstructor
//@Slf4j
//@CrossOrigin(origins = "https://stop-save.vercel.app", allowCredentials = "true")
//public class ChallengeCompletionController {
//
//    private final ChallengeCompletionService challengeCompletionService;
//    private final UserService userService;
//
//    /**
//     * 챌린지 완료 기록
//     */
//    @PostMapping("/complete")
//    public ResponseEntity<?> completeChallenge(@RequestBody ChallengeCompletionRequest request,
//                                             HttpSession session) {
//        try {
//            User currentUser = userService.getCurrentUser(session);
//            if (currentUser == null) {
//                return ResponseEntity.status(401).body(Map.of("error", "로그인이 필요합니다."));
//            }
//
//            ChallengeCompletion completion = challengeCompletionService.completeChallenge(
//                    currentUser,
//                    request.getChallengeId(),
//                    request.getChallengeTitle(),
//                    ChallengeCompletion.ChallengePeriod.valueOf(request.getPeriod().toUpperCase()),
//                    request.getRewardAmount()
//            );
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("completion", completion);
//            response.put("message", "챌린지가 완료되었습니다!");
//
//            return ResponseEntity.ok(response);
//
//        } catch (Exception e) {
//            log.error("챌린지 완료 처리 실패", e);
//            return ResponseEntity.status(500).body(Map.of("error", "챌린지 완료 처리에 실패했습니다."));
//        }
//    }
//
//    /**
//     * 사용자의 챌린지 완료 기록 조회
//     */
//    @GetMapping("/completions")
//    public ResponseEntity<?> getChallengeCompletions(HttpSession session) {
//        try {
//            User currentUser = userService.getCurrentUser(session);
//            if (currentUser == null) {
//                return ResponseEntity.status(401).body(Map.of("error", "로그인이 필요합니다."));
//            }
//
//            List<ChallengeCompletion> completions = challengeCompletionService.getUserChallengeCompletions(currentUser);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("completions", completions);
//            response.put("totalCount", challengeCompletionService.getTotalCompletionCount(currentUser));
//            response.put("totalRewards", challengeCompletionService.getTotalRewards(currentUser));
//
//            return ResponseEntity.ok(response);
//
//        } catch (Exception e) {
//            log.error("챌린지 완료 기록 조회 실패", e);
//            return ResponseEntity.status(500).body(Map.of("error", "챌린지 완료 기록 조회에 실패했습니다."));
//        }
//    }
//
//    /**
//     * 특정 챌린지 완료 상태 확인
//     */
//    @GetMapping("/status/{challengeId}")
//    public ResponseEntity<?> getChallengeStatus(@PathVariable String challengeId,
//                                              @RequestParam String period,
//                                              HttpSession session) {
//        try {
//            User currentUser = userService.getCurrentUser(session);
//            if (currentUser == null) {
//                return ResponseEntity.status(401).body(Map.of("error", "로그인이 필요합니다."));
//            }
//
//            boolean isCompleted = challengeCompletionService.isRecentlyCompleted(
//                    currentUser,
//                    challengeId,
//                    ChallengeCompletion.ChallengePeriod.valueOf(period.toUpperCase())
//            );
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("challengeId", challengeId);
//            response.put("isCompleted", isCompleted);
//
//            return ResponseEntity.ok(response);
//
//        } catch (Exception e) {
//            log.error("챌린지 상태 확인 실패", e);
//            return ResponseEntity.status(500).body(Map.of("error", "챌린지 상태 확인에 실패했습니다."));
//        }
//    }
//
//    /**
//     * 챌린지 완료 요청 DTO
//     */
//    public static class ChallengeCompletionRequest {
//        private String challengeId;
//        private String challengeTitle;
//        private String period;
//        private Integer rewardAmount;
//
//        // Getters and Setters
//        public String getChallengeId() { return challengeId; }
//        public void setChallengeId(String challengeId) { this.challengeId = challengeId; }
//
//        public String getChallengeTitle() { return challengeTitle; }
//        public void setChallengeTitle(String challengeTitle) { this.challengeTitle = challengeTitle; }
//
//        public String getPeriod() { return period; }
//        public void setPeriod(String period) { this.period = period; }
//
//        public Integer getRewardAmount() { return rewardAmount; }
//        public void setRewardAmount(Integer rewardAmount) { this.rewardAmount = rewardAmount; }
//    }
//}
