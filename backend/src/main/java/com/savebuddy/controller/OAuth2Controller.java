package com.savebuddy.controller;

import com.savebuddy.dto.UserDto;
import com.savebuddy.entity.User;
import com.savebuddy.service.OAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class OAuth2Controller {


    @Autowired
    OAuth2UserService oAuth2UserService;

    /**
     * 현재 로그인된 사용자 조회
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OidcUser oidcUser) {
            try {
                User user = oAuth2UserService.saveOrUpdateOAuth2User(oidcUser.getEmail(), oidcUser.getFullName(), oidcUser.getPicture());

                if (user != null) {
                    // DB에 사용자가 있으면 UserDto로 반환
                    UserDto userDto = UserDto.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .nickname(user.getNickname())
                            .username(user.getUsername())
                            .level(user.getLevel())
                            .experience(user.getExperience())
                            .totalSavings(user.getTotalSavings())
                            .monthlyTarget(user.getMonthlyTarget())
                            .picture(user.getPicture())
                            .sub(oidcUser.getSubject())
                            .build();

                    return ResponseEntity.ok(userDto);
                }
            } catch (Exception e) {
                // DB에서 사용자를 찾을 수 없는 경우
                System.out.println("User not found in DB, returning OAuth info: " + e.getMessage());
            }
        }

        return ResponseEntity.status(401)
                .body(Map.of("error", "Invalid authentication type"));
    }


    /**
     * 로그아웃 (Google 로그아웃 포함)
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            // Spring Security 로그아웃 처리
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }

        return ResponseEntity.ok(Map.of(
                "message", "Logout successful",
                "googleLogoutUrl", "https://accounts.google.com/logout"
        ));
    }


    /**
     * 월간 목표 절약 금액 설정
     */
    @PostMapping("/monthly-target")
    public ResponseEntity<?> updateMonthlyTarget(@RequestBody Long monthlyTarget,
                                                 Authentication authentication) {
        try {
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            oAuth2UserService.updateMonthlyTarget(email, monthlyTarget);

            return ResponseEntity.ok(Map.of("message", "월간 절약 목표 설정이 완료되었습니다."));

        } catch (ClassCastException e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid authentication type"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to update monthly target"));
        }
    }



}

