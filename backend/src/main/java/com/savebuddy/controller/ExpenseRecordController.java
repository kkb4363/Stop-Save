package com.savebuddy.controller;

import com.savebuddy.dto.ExpenseRecordDto;
import com.savebuddy.dto.ExpenseRecordInfoDto;
import com.savebuddy.dto.RecordInfoDto;
import com.savebuddy.dto.SavingRecordDto;
import com.savebuddy.entity.ExpenseRecord;
import com.savebuddy.entity.SavingRecord;
import com.savebuddy.service.ExpenseRecordService;
import com.savebuddy.service.SavingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expense")
public class ExpenseRecordController {

    @Autowired
    private ExpenseRecordService expenseRecordService;

    /**
     * Authentication에서 이메일을 추출하는 유틸리티 메서드
     */
    private String getEmailFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        // JWT 기반 인증
        if (authentication.getPrincipal() instanceof String email) {
            return email;
        }
        // OAuth2 기반 인증
        else if (authentication.getPrincipal() instanceof OidcUser oidcUser) {
            return oidcUser.getEmail();
        }

        return null;
    }

    /**
     * 소비 등록
     * @return
     */
    @PostMapping("/record")
    public ResponseEntity<?> createExpenseRecord(@RequestBody ExpenseRecordDto request, Authentication authentication) {
        try {
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            ExpenseRecord record = expenseRecordService.createExpenseRecord(
                    email,
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

    /**
     * 전체 소비 조회
     * @return
     */
    @GetMapping("/all")
    public ResponseEntity<?> allRecords(Authentication authentication){
        try{
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            List<ExpenseRecord> results = expenseRecordService.allRecords(email);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get all Records"));
        }
    }


    /**
     * 오늘의 소비 조회
     * @return
     */
    @GetMapping("/today")
    public ResponseEntity<?> todayRecords(Authentication authentication){
        try{
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            ExpenseRecordInfoDto results = expenseRecordService.todayRecords(email);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get today Records"));
        }
    }

    /**
     * 이번달 소비 조회
     * @return
     */
    @GetMapping("/month")
    public ResponseEntity<?> monthRecords(Authentication authentication){
        try{
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            ExpenseRecordInfoDto results = expenseRecordService.monthRecords(email);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get month Records"));
        }
    }


    /**
     * 최근 3가지 소비 기록
     * @return
     */
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestRecords(Authentication authentication){
        try{
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            List<ExpenseRecord> results = expenseRecordService.getLatestRecords(email);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get latest Records"));
        }
    }

    /**
     * 최근 일주일 소비 통계
     * @return
     */
    @GetMapping("/week")
    public ResponseEntity<?> getWeekRecords(Authentication authentication){
        try{
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            Map<DayOfWeek, Long> results = expenseRecordService.getWeekRecordsStatus(email);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get Week Records"));
        }
    }

    /**
     * 카테고리별 통계
     * @return
     */
    @GetMapping("/category")
    public ResponseEntity<?> getCategoryRecords(Authentication authentication){
        try{
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            List<Object[]> results = expenseRecordService.getCategorySavingsStats(email);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get Category Records"));
        }
    }

    // 소비 기록 삭제
    @DeleteMapping("/{recordId}")
    public ResponseEntity<?> deleteSavingRecord(@PathVariable Long recordId, Authentication authentication) {
        try {
            String email = getEmailFromAuthentication(authentication);
            if (email == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized", "message", "Authentication required"));
            }

            expenseRecordService.deleteExpenseRecord(recordId, email);
            return ResponseEntity.ok("절약 기록이 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}