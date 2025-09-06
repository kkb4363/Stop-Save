package com.savebuddy.service;


import com.savebuddy.entity.User;
import com.savebuddy.repository.OAuth2UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class OAuth2UserService {

    @Autowired
    private OAuth2UserRepository oAuth2UserRepository;

    // 유저 등록
    public User saveOrUpdateOAuth2User(String email, String nickname, String picture){
        Optional<User> existingUser = oAuth2UserRepository.findByEmail(email);

        if(existingUser.isPresent()){
            User user = existingUser.get();
            user.setNickname(nickname);
            user.setPicture(picture);

            return oAuth2UserRepository.save(user);
        } else{
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setNickname(nickname);
            newUser.setPicture(picture);
            newUser.setLevel(1);
            newUser.setExperience(0);
            newUser.setTotalSavings(0L);

            // OAuth2 사용자를 위한 username 자동 생성 (email 기반)
            String username = email.split("@")[0] + "_" + System.currentTimeMillis();
            newUser.setUsername(username);

            return oAuth2UserRepository.save(newUser);
        }

    }

    // 유저 조회
    public Optional<User> findByEmail(String email) {
        return oAuth2UserRepository.findByEmail(email);
    }

    // 유저 월간 목표 금액 설정
    public User updateMonthlyTarget(String email, Long monthlyTarget){
        Optional<User> existingUser = oAuth2UserRepository.findByEmail(email);

        if(existingUser.isPresent()){
            User user = existingUser.get();
            user.setMonthlyTarget(monthlyTarget);
            return oAuth2UserRepository.save(user);
        }
        throw new RuntimeException("존재하지 않는 사용자입니다.");

    }



}
