package stop.save.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // OAuth2 관련 필드 추가
    private String picture; // 구글 프로필 이미지

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // 기본값은 USER

    @Enumerated(EnumType.STRING)
    private LoginType loginType = LoginType.GENERAL; // 로그인 타입

    // 기본 생성자
    public User() {}

    // OAuth2용 생성자 추가
    public User(String email, String nickname, String picture) {
        this.email = email;
        this.nickname = nickname;
        this.picture = picture;
        this.loginType = LoginType.GOOGLE;
        this.role = Role.USER;
    }

    // 기존 Getter, Setter 메서드들
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public Long getTotalSavings() { return totalSavings; }
    public void setTotalSavings(Long totalSavings) { this.totalSavings = totalSavings; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // OAuth2 관련 Getter, Setter 추가
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LoginType getLoginType() { return loginType; }
    public void setLoginType(LoginType loginType) { this.loginType = loginType; }

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

    public enum LoginType {
        GENERAL, GOOGLE
    }
}