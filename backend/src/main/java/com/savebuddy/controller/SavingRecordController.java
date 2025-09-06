package com.savebuddy.controller;

import com.savebuddy.dto.RecordInfoDto;
import com.savebuddy.dto.SavingRecordDto;
import com.savebuddy.entity.SavingRecord;
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
@RequestMapping("/api/savings")
//@CrossOrigin(origins = "https://stop-save.vercel.app", allowCredentials = "true")
public class SavingRecordController {

    @Autowired
    private SavingRecordService savingRecordService;

    /**
     * 절약 등록
     * @return
     */
    @PostMapping("/record")
    public ResponseEntity<?> createSavingRecord(@RequestBody SavingRecordDto request, Authentication authentication) {
        try {
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            SavingRecord record = savingRecordService.createSavingRecord(
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
     * 전체 절약 조회
     * @return
     */
    @GetMapping("/all")
    public ResponseEntity<?> allRecords(Authentication authentication){
        try{
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            List<SavingRecord> results = savingRecordService.allRecords(email);
            return ResponseEntity.ok(results);

        }catch (ClassCastException e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid authentication type"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get today Records"));
        }
    }


    /**
     * 오늘의 절약 조회
     * @return
     */
    @GetMapping("/today")
    public ResponseEntity<?> todayRecords(Authentication authentication){
        try{
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            RecordInfoDto results = savingRecordService.todayRecords(email);
            return ResponseEntity.ok(results);

        }catch (ClassCastException e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid authentication type"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get today Records"));
        }
    }

    /**
     * 이번달 절약 조회
     * @return
     */
    @GetMapping("/month")
    public ResponseEntity<?> monthRecords(Authentication authentication){
        try{
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            RecordInfoDto results = savingRecordService.monthRecords(email);
            return ResponseEntity.ok(results);

        }catch (ClassCastException e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid authentication type"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get month Records"));
        }
    }


    /**
     * 최근 3가지 절약 기록
     * @return
     */
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestRecords(Authentication authentication){
        try{
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            List<SavingRecord> results = savingRecordService.getLatestRecords(email);
            return ResponseEntity.ok(results);

        }catch (ClassCastException e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid authentication type"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get month Records"));
        }
    }

    /**
     * 최근 일주일 절약 통계
     * @return
     */
    @GetMapping("/week")
    public ResponseEntity<?> getWeekRecords(Authentication authentication){
        try{
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            Map<DayOfWeek, Long> results = savingRecordService.getWeekRecordsStatus(email);
            return ResponseEntity.ok(results);

        }catch (ClassCastException e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid authentication type"));
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
            OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
            String email = oidcUser.getEmail();

            List<Object[]> results = savingRecordService.getCategorySavingsStats(email);
            return ResponseEntity.ok(results);

        }catch (ClassCastException e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid authentication type"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get Category Records"));
        }
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


}