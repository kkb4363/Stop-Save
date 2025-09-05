package com.savebuddy.service;

import com.savebuddy.entity.User;
import com.savebuddy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 사용자 등록
    public User registerUser(User user) {
        // 중복 체크
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 기본값 설정
        user.setLevel(1);
        user.setExperience(0);
        user.setTotalSavings(0L);

        return userRepository.save(user);
    }



    // 사용자 정보 조회
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // 경험치 추가 및 레벨업 처리
    public User addExperience(Long userId, Integer exp) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            int currentExp = user.getExperience() + exp;
            user.setExperience(currentExp);

            // 레벨업 계산 (100exp = 1레벨)
            int newLevel = (currentExp / 100) + 1;
            if (newLevel > user.getLevel()) {
                user.setLevel(newLevel);
            }

            return userRepository.save(user);
        }
        throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }

    // 총 절약 금액 업데이트
    public User updateTotalSavings(Long userId, Long amount) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTotalSavings(user.getTotalSavings() + amount);
            return userRepository.save(user);
        }
        throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }

    // 사용자 정보 수정
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // OAuth2 사용자 등록 또는 업데이트
    public User saveOrUpdateOAuth2User(String email, String nickname, String picture) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            // 기존 사용자 정보 업데이트
            User user = existingUser.get();
            user.setNickname(nickname);
            user.setPicture(picture);
            return userRepository.save(user);
        } else {
            // 새 OAuth2 사용자 생성
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setNickname(nickname);
            newUser.setPicture(picture);
            newUser.setLoginType(User.LoginType.GOOGLE);
            newUser.setRole(User.Role.USER);

            // OAuth2 사용자를 위한 username 자동 생성 (email 기반)
            String username = email.split("@")[0] + "_" + System.currentTimeMillis();
            newUser.setUsername(username);

            // OAuth2 사용자는 password가 필요 없음 (null 허용)

            // 기본값 설정
            newUser.setLevel(1);
            newUser.setExperience(0);
            newUser.setTotalSavings(0L);

            return userRepository.save(newUser);
        }
    }

    // 이메일로 사용자 조회
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 세션에서 현재 사용자 가져오기
    public User getCurrentUser(jakarta.servlet.http.HttpSession session) {
        return (User) session.getAttribute("user");
    }

    // 월간 목표 금액 설정
    public User updateMonthlyTarget(Long userId, Long monthlyTarget) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setMonthlyTarget(monthlyTarget);
            return userRepository.save(user);
        }
        throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }

    // 월간 목표 금액 조회
    public Long getMonthlyTarget(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getMonthlyTarget();
        }
        throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }
}