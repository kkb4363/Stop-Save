package com.savebuddy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter @Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @Email
    @Column(unique = true)
    private String email;

    @Column(nullable = true) // OAuth2 로그인시에는 null이 될 수 있음
    private String password;

    private String nickname;

    private Integer level = 1;

    private Integer experience = 0;

    private Long totalSavings = 0L;

    private Long monthlyTarget = 100000L; // 기본 월간 목표: 10만원

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // OAuth2 관련 필드
    private String picture; // 구글 프로필 이미지

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // 기본값은 USER

    private String loginType = "GOOGLE"; // 로그인 타입


    // OAuth2 사용자 정보 업데이트 메서드
    public User update(String nickname, String picture) {
        this.nickname = nickname;
        this.picture = picture;
        return this;
    }

    // 내부 enum 정의
    public enum Role {
        USER, ADMIN
    }

}