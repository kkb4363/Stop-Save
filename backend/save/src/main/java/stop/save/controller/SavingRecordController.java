package stop.save.controller;

import stop.save.entity.SavingRecord;
import stop.save.service.SavingRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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