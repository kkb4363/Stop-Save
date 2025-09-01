
# 소비 멈춰 적금 앱 개발 가이드

## 목차

1. [프로젝트 개요](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#1-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B0%9C%EC%9A%94)
2. [기술 스택](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#2-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D)
3. [개발 환경 설정](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#3-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95)
4. [데이터베이스 엔티티](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#4-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%97%94%ED%8B%B0%ED%8B%B0)
5. [Repository 레이어](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#5-repository-%EB%A0%88%EC%9D%B4%EC%96%B4)
6. [Service 레이어](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#6-service-%EB%A0%88%EC%9D%B4%EC%96%B4)
7. [Controller 레이어](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#7-controller-%EB%A0%88%EC%9D%B4%EC%96%B4)
8. [애플리케이션 실행](https://claude.ai/chat/f441d80d-1635-4836-92a1-510d0cfc929e#8-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%EC%8B%A4%ED%96%89)

---

## 1. 프로젝트 개요

### 앱명

**소비 멈춰 적금** (Save & Stop)

### 핵심 컨셉

일상의 작은 소비를 멈추고 그 금액을 적금하는 과정을 게임처럼 재미있게 만드는 마이크로 세이빙 앱

### 주요 기능

- 소비 멈춤 기록 (커피, 택시, 배달음식 등)
- 가상 적금 잔액 관리
- 레벨 시스템 및 경험치
- 챌린지 시스템
- 통계 및 시각화

### 차별화 포인트

- 지출 기록이 아닌 **절약 기록**에 초점
- 게임화 요소로 재미 제공
- 소액 중심의 일상 절약

---

## 2. 기술 스택

### 프론트엔드

- **React + Vite** (빠른 개발 환경)
- **TypeScript** (타입 안정성)
- **Zustand** (가벼운 상태 관리)
- **TailwindCSS** (빠른 스타일링)
- **PrimeReact** (UI 컴포넌트 라이브러리)

### 백엔드

- **Java + Spring Boot** (안정적인 백엔드)
- **JSP** (서버 사이드 렌더링)
- **MySQL** (데이터베이스)
- **Gradle** (빌드 도구)

---

## 3. 개발 환경 설정

### 3.1 Spring Boot 프로젝트 생성

**Start.spring.io 설정:**

- **Project**: Gradle - Groovy
- **Language**: Java
- **Spring Boot**: 3.2.x
- **Group**: `stop`
- **Artifact**: `save
- **Package name**: `stop.save`
- **Packaging**: Jar
- **Java**: 17

**Dependencies:**
1. Spring Web
2. Spring Data JPA
3. MySQL Driver
4. Spring Boot DevTools
5. Validation
6. Spring Security

### 3.2 MySQL 데이터베이스 설정

```sql
CREATE DATABASE savings_db;
```

### 3.3 application.properties 설정

```properties
# MySQL 설정
spring.datasource.url=jdbc:mysql://localhost:3306/savings_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=your_password_here

# JPA 설정
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# 서버 포트
server.port=8080
```

### 3.4 패키지 구조

```
com.savingstop.savings/
├── SavingsApplication.java
├── entity/
├── repository/
├── service/
├── controller/
└── dto/
```

---

## 4. 데이터베이스 엔티티

### 4.1 User 엔티티

```java
package com.savingstop.savings.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String username;
    
    @NotBlank
    @Email
    @Column(unique = true)
    private String email;
    
    @NotBlank
    private String password;
    
    private String nickname;
    private Integer level = 1;
    private Integer experience = 0;
    private Long totalSavings = 0L;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // 생성자, Getter, Setter 생략...
}
```

### 4.2 SavingRecord 엔티티

```java
package com.savingstop.savings.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "saving_records")
public class SavingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @NotBlank
    private String itemName; // 절약한 아이템
    
    @NotNull
    private Long amount; // 절약 금액
    
    private String category; // 카테고리
    private String memo; // 메모
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // 생성자, Getter, Setter 생략...
}
```

### 4.3 Challenge 엔티티

```java
package com.savingstop.savings.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenges")
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String title; // 챌린지 제목
    
    private String description; // 챌린지 설명
    
    @NotNull
    private Long targetAmount; // 목표 금액
    
    @NotNull
    private Integer duration; // 기간 (일)
    
    @NotNull
    private Integer experienceReward; // 보상 경험치
    
    @NotNull
    private Boolean isActive = true; // 활성 상태
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // 생성자, Getter, Setter 생략...
}
```

---

## 5. Repository 레이어

### 5.1 UserRepository

```java
package com.savingstop.savings.repository;

import com.savingstop.savings.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Query("UPDATE User u SET u.level = :level WHERE u.id = :userId")
    void updateUserLevel(@Param("userId") Long userId, @Param("level") Integer level);
}
```

### 5.2 SavingRecordRepository

```java
package com.savingstop.savings.repository;

import com.savingstop.savings.entity.SavingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SavingRecordRepository extends JpaRepository<SavingRecord, Long> {
    
    List<SavingRecord> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT sr FROM SavingRecord sr WHERE sr.user.id = :userId " +
           "AND DATE(sr.createdAt) = DATE(CURRENT_DATE)")
    List<SavingRecord> findTodaySavingsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT sr FROM SavingRecord sr WHERE sr.user.id = :userId " +
           "AND YEAR(sr.createdAt) = YEAR(CURRENT_DATE) " +
           "AND MONTH(sr.createdAt) = MONTH(CURRENT_DATE)")
    List<SavingRecord> findThisMonthSavingsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COALESCE(SUM(sr.amount), 0) FROM SavingRecord sr WHERE sr.user.id = :userId")
    Long getTotalSavingsAmountByUserId(@Param("userId") Long userId);
    
    @Query("SELECT sr.category, COALESCE(SUM(sr.amount), 0) FROM SavingRecord sr " +
           "WHERE sr.user.id = :userId GROUP BY sr.category")
    List<Object[]> getCategorySavingsStatsByUserId(@Param("userId") Long userId);
    
    List<SavingRecord> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
```

### 5.3 ChallengeRepository

```java
package com.savingstop.savings.repository;

import com.savingstop.savings.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    
    List<Challenge> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Challenge> findByTargetAmountBetweenAndIsActiveTrue(Long minAmount, Long maxAmount);
    List<Challenge> findByDurationAndIsActiveTrueOrderByTargetAmountAsc(Integer duration);
}
```

---

## 6. Service 레이어

### 6.1 UserService

```java
package com.savingstop.savings.service;

import com.savingstop.savings.entity.User;
import com.savingstop.savings.repository.UserRepository;
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
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        user.setLevel(1);
        user.setExperience(0);
        user.setTotalSavings(0L);
        
        return userRepository.save(user);
    }
    
    // 사용자 로그인
    public Optional<User> loginUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
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
}
```

### 6.2 SavingRecordService

```java
package com.savingstop.savings.service;

import com.savingstop.savings.entity.SavingRecord;
import com.savingstop.savings.entity.User;
import com.savingstop.savings.repository.SavingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SavingRecordService {
    
    @Autowired
    private SavingRecordRepository savingRecordRepository;
    
    @Autowired
    private UserService userService;
    
    // 절약 기록 등록
    public SavingRecord createSavingRecord(Long userId, String itemName, Long amount, String category, String memo) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        
        User user = userOpt.get();
        SavingRecord record = new SavingRecord();
        record.setUser(user);
        record.setItemName(itemName);
        record.setAmount(amount);
        record.setCategory(category);
        record.setMemo(memo);
        
        SavingRecord savedRecord = savingRecordRepository.save(record);
        
        // 사용자 총 절약 금액 업데이트
        userService.updateTotalSavings(userId, amount);
        
        // 경험치 추가 (절약 1회당 10exp)
        userService.addExperience(userId, 10);
        
        return savedRecord;
    }
    
    // 사용자별 절약 기록 조회
    public List<SavingRecord> getUserSavingRecords(Long userId) {
        return savingRecordRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // 오늘의 절약 기록
    public List<SavingRecord> getTodaySavingRecords(Long userId) {
        return savingRecordRepository.findTodaySavingsByUserId(userId);
    }
    
    // 이번 달 절약 기록
    public List<SavingRecord> getThisMonthSavingRecords(Long userId) {
        return savingRecordRepository.findThisMonthSavingsByUserId(userId);
    }
    
    // 총 절약 금액 조회
    public Long getTotalSavingsAmount(Long userId) {
        return savingRecordRepository.getTotalSavingsAmountByUserId(userId);
    }
    
    // 카테고리별 통계
    public List<Object[]> getCategorySavingsStats(Long userId) {
        return savingRecordRepository.getCategorySavingsStatsByUserId(userId);
    }
    
    // 기간별 절약 기록
    public List<SavingRecord> getSavingRecordsByPeriod(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return savingRecordRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
    }
    
    // 절약 기록 삭제
    public void deleteSavingRecord(Long recordId, Long userId) {
        Optional<SavingRecord> recordOpt = savingRecordRepository.findById(recordId);
        if (recordOpt.isPresent()) {
            SavingRecord record = recordOpt.get();
            if (record.getUser().getId().equals(userId)) {
                savingRecordRepository.delete(record);
            } else {
                throw new RuntimeException("권한이 없습니다.");
            }
        } else {
            throw new RuntimeException("기록을 찾을 수 없습니다.");
        }
    }
}
```

### 6.3 ChallengeService

```java
package com.savingstop.savings.service;

import com.savingstop.savings.entity.Challenge;
import com.savingstop.savings.repository.ChallengeRepository;
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
        Long maxAmount = userTotalSavings + 100000L;
        return challengeRepository.findByTargetAmountBetweenAndIsActiveTrue(minAmount, maxAmount);
    }
    
    // 기간별 챌린지 조회
    public List<Challenge> getChallengesByDuration(Integer duration) {
        return challengeRepository.findByDurationAndIsActiveTrueOrderByTargetAmountAsc(duration);
    }
    
    // 새 챌린지 생성
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
```

---

## 7. Controller 레이어

### 7.1 UserController

```java
package com.savingstop.savings.controller;

import com.savingstop.savings.entity.User;
import com.savingstop.savings.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // 사용자 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // 사용자 로그인
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.badRequest().body("로그인 정보가 올바르지 않습니다.");
        }
    }
    
    // 사용자 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 사용자 정보 수정
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User user) {
        try {
            user.setId(userId);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
}
```

### 7.2 SavingRecordController

```java
package com.savingstop.savings.controller;

import com.savingstop.savings.entity.SavingRecord;
import com.savingstop.savings.service.SavingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "*")
public class SavingRecordController {
    
    @Autowired
    private SavingRecordService savingRecordService;
    
    // 절약 기록 등록
    @PostMapping("/record")
    public ResponseEntity<?> createSavingRecord(@RequestBody SavingRecordRequest request) {
        try {
            SavingRecord record = savingRecordService.createSavingRecord(
                request.getUserId(),
                request.getItemName(),
                request.getAmount(),
                request.getCategory(),
                request.getMemo()
            );
            return ResponseEntity.ok(record);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // 사용자별 절약 기록 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavingRecord>> getUserSavingRecords(@PathVariable Long userId) {
        List<SavingRecord> records = savingRecordService.getUserSavingRecords(userId);
        return ResponseEntity.ok(records);
    }
    
    // 오늘의 절약 기록
    @GetMapping("/today/{userId}")
    public ResponseEntity<List<SavingRecord>> getTodaySavingRecords(@PathVariable Long userId) {
        List<SavingRecord> records = savingRecordService.getTodaySavingRecords(userId);
        return ResponseEntity.ok(records);
    }
    
    // 이번 달 절약 기록
    @GetMapping("/month/{userId}")
    public ResponseEntity<List<SavingRecord>> getThisMonthSavingRecords(@PathVariable Long userId) {
        List<SavingRecord> records = savingRecordService.getThisMonthSavingRecords(userId);
        return ResponseEntity.ok(records);
    }
    
    // 총 절약 금액 조회
    @GetMapping("/total/{userId}")
    public ResponseEntity<Long> getTotalSavingsAmount(@PathVariable Long userId) {
        Long totalAmount = savingRecordService.getTotalSavingsAmount(userId);
        return ResponseEntity.ok(totalAmount);
    }
    
    // 카테고리별 통계
    @GetMapping("/stats/category/{userId}")
    public ResponseEntity<List<Object[]>> getCategorySavingsStats(@PathVariable Long userId) {
        List<Object[]> stats = savingRecordService.getCategorySavingsStats(userId);
        return ResponseEntity.ok(stats);
    }
    
    // 절약 기록 삭제
    @DeleteMapping("/{recordId}/user/{userId}")
    public ResponseEntity<?> deleteSavingRecord(@PathVariable Long recordId, @PathVariable Long userId) {
        try {
            savingRecordService.deleteSavingRecord(recordId, userId);
            return ResponseEntity.ok("절약 기록이 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // 절약 기록 등록 요청 DTO
    public static class SavingRecordRequest {
        private Long userId;
        private String itemName;
        private Long amount;
        private String category;
        private String memo;
        
        // Getter, Setter
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        
        public Long getAmount() { return amount; }
        public void setAmount(Long amount) { this.amount = amount; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public String getMemo() { return memo; }
        public void setMemo(String memo) { this.memo = memo; }
    }
}
```

### 7.3 ChallengeController

```java
package com.savingstop.savings.controller;

import com.savingstop.savings.entity.Challenge;
import com.savingstop.savings.service.ChallengeService;
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
    
    // 기간별 챌린지 조회
    @GetMapping("/duration/{duration}")
    public ResponseEntity<List<Challenge>> getChallengesByDuration(@PathVariable Integer duration) {
        List<Challenge> challenges = challengeService.getChallengesByDuration(duration);
        return ResponseEntity.ok(challenges);
    }
}
```

---

## 8. 애플리케이션 실행

### 8.1 실행 전 체크리스트

- [ ] MySQL 서비스 실행 중
- [ ] `savings_db` 데이터베이스 생성 완료
- [ ] `application.properties` 설정 완료
- [ ] 모든 엔티티, Repository, Service, Controller 클래스 생성 완료

### 8.2 애플리케이션 실행 방법

**IDE에서 실행:** `SavingsApplication.java`의 main 메서드를 실행

**터미널에서 실행:**

```bash
./gradlew bootRun
```

### 8.3 실행 확인

- 브라우저에서 `http://localhost:8080` 접속
- "Whitelabel Error Page"가 나오면 정상 (루트 경로 컨트롤러 없음)
- 콘솔에서 테이블 생성 로그 확인

---

## 9. API 테스트

### 9.1 사용자 등록 테스트

**요청:**

```
POST http://localhost:8080/api/users/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "nickname": "테스트유저"
}
```

**예상 응답:**

```json
{
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "nickname": "테스트유저",
    "level": 1,
    "experience": 0,
    "totalSavings": 0,
    "createdAt": "2025-09-01T10:30:00"
}
```

### 9.2 사용자 로그인 테스트

**요청:**

```
POST http://localhost:8080/api/users/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "password123"
}
```

### 9.3 절약 기록 등록 테스트

**요청:**

```
POST http://localhost:8080/api/savings/record
Content-Type: application/json

{
    "userId": 1,
    "itemName": "아메리카노",
    "amount": 4500,
    "category": "음식",
    "memo": "커피 대신 물 마셨음"
}
```

### 9.4 절약 기록 조회 테스트

**요청:**

```
GET http://localhost:8080/api/savings/user/1
```

### 9.5 오늘의 절약 금액 조회

**요청:**

```
GET http://localhost:8080/api/savings/today/1
```

### 9.6 총 절약 금액 조회

**요청:**

```
GET http://localhost:8080/api/savings/total/1
```

### 9.7 챌린지 목록 조회

**요청:**

```
GET http://localhost:8080/api/challenges
```

---

## 10. 데이터베이스 테이블 구조

애플리케이션 실행 후 자동으로 생성되는 테이블들:

### 10.1 users 테이블

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    total_savings BIGINT DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);
```

### 10.2 saving_records 테이블

```sql
CREATE TABLE saving_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    item_name VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL,
    category VARCHAR(255),
    memo TEXT,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 10.3 challenges 테이블

```sql
CREATE TABLE challenges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount BIGINT NOT NULL,
    duration INT NOT NULL,
    experience_reward INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME
);
```

---

## 11. 다음 단계 개발 계획

### 11.1 우선순위 기능

1. **기본 챌린지 데이터 추가**
2. **사용자 대시보드 API**
3. **통계 API 고도화**
4. **프론트엔드 연동**

### 11.2 추후 개발 예정

1. **뱃지 시스템**
2. **소셜 기능** (친구 추가, 랭킹)
3. **푸시 알림**
4. **데이터 백업/복원**

---

## 12. 트러블슈팅

### 12.1 자주 발생하는 에러

**MySQL 연결 에러:**

- MySQL 서비스 실행 상태 확인
- 데이터베이스 존재 여부 확인
- username/password 확인

**포트 충돌 에러:**

- 8080 포트가 이미 사용 중인 경우
- `application.properties`에서 `server.port=8081`로 변경

**JPA 테이블 생성 실패:**

- MySQL 사용자 권한 확인
- 데이터베이스 문자셋 확인 (UTF-8)

### 12.2 개발 팁

- 로그를 자주 확인하여 에러 조기 발견
- API 테스트는 Postman 활용 권장
- 코드 변경 후 항상 재실행하여 테스트
- 데이터베이스 백업 정기적으로 수행

---

## 13. 개발 완료 체크리스트

### 백엔드 개발 완료 사항

- [x] Spring Boot 프로젝트 생성
- [x] MySQL 데이터베이스 설정
- [x] 엔티티 클래스 생성 (User, SavingRecord, Challenge)
- [x] Repository 인터페이스 생성
- [x] Service 클래스 생성
- [x] Controller 클래스 생성
- [x] 기본 API 엔드포인트 구현

### 다음 개발 단계

- [ ] 기본 챌린지 데이터 추가
- [ ] API 응답 형식 통일 (ResponseDTO)
- [ ] 예외 처리 고도화
- [ ] 프론트엔드 개발 시작

---

**개발 완료 일자:** 2025년 9월 1일  
**개발자:** 1인 개발  
**예상 소요 시간:** 백엔드 기본 구조 완성 (약 4-5시간)

이 문서는 "소비 멈춰 적금" 앱의 백엔드 개발 과정을 단계별로 정리한 가이드입니다. 각 단계를 순서대로 따라하면 기본적인 REST API 서버를 구축할 수 있습니