package stop.save.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import stop.save.entity.User;
import stop.save.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // React 앱과 연동
public class UserController {

    @Autowired
    private UserService userService;

    // ========== 기존 일반 회원가입/로그인 기능 ==========

    // 사용자 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(createUserResponse(registeredUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        Optional<User> userOpt = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // 세션에 사용자 정보 저장
            HttpSession session = request.getSession();
            session.setAttribute("user", user);

            return ResponseEntity.ok(createUserResponse(user));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "아이디 또는 비밀번호가 잘못되었습니다."));
        }
    }

    // ========== OAuth2 구글 로그인 기능 ==========

    // 현재 로그인된 사용자 정보 조회 (OAuth2 + 일반 로그인 통합)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User, HttpServletRequest request) {
        User user = null;

        // 1. OAuth2 사용자 확인
        if (oauth2User != null) {
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");

            // OAuth2 사용자 정보 저장/업데이트
            user = userService.saveOrUpdateOAuth2User(email, name, picture);

            // 세션에 사용자 정보 저장
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
        }
        // 2. 세션에서 사용자 정보 확인 (일반 로그인)
        else {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("user") != null) {
                user = (User) session.getAttribute("user");
            }
        }

        if (user != null) {
            return ResponseEntity.ok(createUserResponse(user));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "인증되지 않은 사용자입니다."));
        }
    }

    // OAuth2 로그인 성공 후 사용자 정보 조회
    // 이 메서드는 /api/users/me를 통해 호출됨
    // OAuth2 콜백은 Spring Security가 자동으로 처리하고, 
    // 성공 시 defaultSuccessUrl로 리다이렉트됨

    // 로그아웃 (OAuth2 + 일반 로그인 통합)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("message", "로그아웃 되었습니다."));
    }

    // ========== 기존 사용자 관리 기능 ==========

    // 사용자 정보 조회 (ID로)
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(createUserResponse(user.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 사용자 정보 수정
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User user, HttpServletRequest request) {
        try {
            // 현재 로그인된 사용자와 수정하려는 사용자가 같은지 확인
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "인증이 필요합니다."));
            }

            User currentUser = (User) session.getAttribute("user");
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "권한이 없습니다."));
            }

            user.setId(userId);
            User updatedUser = userService.updateUser(user);

            // 세션 정보도 업데이트
            session.setAttribute("user", updatedUser);

            return ResponseEntity.ok(createUserResponse(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 경험치 추가 API
    @PostMapping("/{userId}/experience")
    public ResponseEntity<?> addExperience(@PathVariable Long userId, @RequestBody ExperienceRequest request, HttpServletRequest httpRequest) {
        try {
            // 인증 확인
            HttpSession session = httpRequest.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "인증이 필요합니다."));
            }

            User currentUser = (User) session.getAttribute("user");
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "권한이 없습니다."));
            }

            User updatedUser = userService.addExperience(userId, request.getExperience());

            // 세션 정보 업데이트
            session.setAttribute("user", updatedUser);

            return ResponseEntity.ok(createUserResponse(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 적금액 업데이트 API
    @PostMapping("/{userId}/savings")
    public ResponseEntity<?> updateSavings(@PathVariable Long userId, @RequestBody SavingsRequest request, HttpServletRequest httpRequest) {
        try {
            // 인증 확인
            HttpSession session = httpRequest.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "인증이 필요합니다."));
            }

            User currentUser = (User) session.getAttribute("user");
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "권한이 없습니다."));
            }

            User updatedUser = userService.updateTotalSavings(userId, request.getAmount());

            // 세션 정보 업데이트
            session.setAttribute("user", updatedUser);

            return ResponseEntity.ok(createUserResponse(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ========== 헬퍼 메서드 및 DTO 클래스 ==========

    // 사용자 응답 데이터 생성
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("nickname", user.getNickname());
        response.put("username", user.getUsername());
        response.put("level", user.getLevel());
        response.put("experience", user.getExperience());
        response.put("totalSavings", user.getTotalSavings());
        response.put("monthlyTarget", user.getMonthlyTarget());
        response.put("picture", user.getPicture());
        response.put("loginType", user.getLoginType());
        response.put("role", user.getRole());
        return response;
    }

    // 로그인 요청 DTO
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // 경험치 요청 DTO
    public static class ExperienceRequest {
        private Integer experience;

        public Integer getExperience() { return experience; }
        public void setExperience(Integer experience) { this.experience = experience; }
    }

    // 적금액 요청 DTO
    public static class SavingsRequest {
        private Long amount;

        public Long getAmount() { return amount; }
        public void setAmount(Long amount) { this.amount = amount; }
    }

    // 월간 목표 설정 API
    @PutMapping("/{userId}/monthly-target")
    public ResponseEntity<?> updateMonthlyTarget(@PathVariable Long userId, @RequestBody MonthlyTargetRequest request, HttpServletRequest httpRequest) {
        try {
            // 인증 확인
            HttpSession session = httpRequest.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "인증이 필요합니다."));
            }

            User currentUser = (User) session.getAttribute("user");
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "권한이 없습니다."));
            }

            User updatedUser = userService.updateMonthlyTarget(userId, request.getMonthlyTarget());
            
            // 세션 정보도 업데이트
            session.setAttribute("user", updatedUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("monthlyTarget", updatedUser.getMonthlyTarget());
            response.put("message", "월간 목표 금액이 설정되었습니다.");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 월간 목표 조회 API
    @GetMapping("/{userId}/monthly-target")
    public ResponseEntity<?> getMonthlyTarget(@PathVariable Long userId, HttpServletRequest httpRequest) {
        try {
            // 인증 확인
            HttpSession session = httpRequest.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                return ResponseEntity.status(401).body(Map.of("error", "인증이 필요합니다."));
            }

            User currentUser = (User) session.getAttribute("user");
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "권한이 없습니다."));
            }

            Long monthlyTarget = userService.getMonthlyTarget(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("monthlyTarget", monthlyTarget);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 월간 목표 요청 DTO
    public static class MonthlyTargetRequest {
        private Long monthlyTarget;

        public Long getMonthlyTarget() { return monthlyTarget; }
        public void setMonthlyTarget(Long monthlyTarget) { this.monthlyTarget = monthlyTarget; }
    }
}