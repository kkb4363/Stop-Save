package com.savebuddy.controller;

import com.savebuddy.dto.SavingRecordDto;
import com.savebuddy.entity.SavingRecord;
import com.savebuddy.service.SavingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "https://stop-save.vercel.app", allowCredentials = "true")
public class SavingRecordController {

    @Autowired
    private SavingRecordService savingRecordService;

    // 절약 기록 등록
    @PostMapping("/record")
    public ResponseEntity<?> createSavingRecord(@RequestBody SavingRecordDto request) {
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

    // 오늘의 총 절약 금액
    @GetMapping("/today/{userId}")
    public ResponseEntity<Long> getUserSavingRecords(@PathVariable Long userId) {
        Long results = savingRecordService.getTodayTotalAmount(userId);
        return ResponseEntity.ok(results);
    }

    // 이번달 총 절약 금액
    @GetMapping("/month/{userId}")
    public ResponseEntity<Long> getMonthTotalAmount(@PathVariable Long userId){
        Long results = savingRecordService.getMonthTotalAmount(userId);
        return ResponseEntity.ok(results);
    }

    // 이번달 절약 횟수
    @GetMapping("/month/count/{userId}")
    public ResponseEntity<Long> getMonthTotalCount(@PathVariable Long userId){
        Long results = savingRecordService.getMonthTotalCount(userId);
        return ResponseEntity.ok(results);
    }

    // 최근 3가지 절약 기록
    @GetMapping("/latest/{userId}")
    public ResponseEntity<List<SavingRecordDto>> getLatestRecords(@PathVariable Long userId){
        List<SavingRecord> records = savingRecordService.getLatestRecords(userId);

        List<SavingRecordDto> results = records.stream().map(r -> SavingRecordDto.builder()
                        .id(r.getId()).itemName(r.getItemName()).amount(r.getAmount()).category(r.getCategory()).memo(r.getMemo()).createdAt(r.getCreatedAt()).build())
                .toList();

        return ResponseEntity.ok(results);
    }

    // 총 절약 금액
    @GetMapping("/all/{userId}")
    public ResponseEntity<Long> getTotalAmount(@PathVariable Long userId){
        Long results = savingRecordService.totalAmount(userId);
        return ResponseEntity.ok(results);
    }

    // 총 절약 기록
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavingRecord>> getAllRecords(@PathVariable Long userId){
        List<SavingRecord> results = savingRecordService.getAllRecords(userId);
        return ResponseEntity.ok(results);
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


}