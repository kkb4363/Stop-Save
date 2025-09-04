package stop.save.service;

import stop.save.dto.SavingRecordDto;
import stop.save.entity.SavingRecord;
import stop.save.entity.User;
import stop.save.repository.SavingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stop.save.repository.SavingRecordRepository2;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@Transactional
public class SavingRecordService {

    @Autowired
    private SavingRecordRepository savingRecordRepository;

    @Autowired
    private SavingRecordRepository2 savingRecordRepository2;

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

    // 오늘의 총 절약 금액
    public Long getTodayTotalAmount(Long userId) {
        List<SavingRecord> records = savingRecordRepository2.list(userId);
        return records.stream().mapToLong(sr -> sr.getAmount()).sum();
    }

    // 이번달 총 절약 금액
    public Long getMonthTotalAmount(Long userId){
        return filterMonthRecords(userId).mapToLong(sr -> sr.getAmount()).sum();
    }

    // 이번달 절약 횟수
    public Long getMonthTotalCount(Long userId){
        return filterMonthRecords(userId).count();
    }

    // 최근 3가지 절약 기록
    public List<SavingRecord> getLatestRecords(Long userId){
        List<SavingRecord> records = savingRecordRepository2.list(userId)
                .stream()
                .sorted((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(3).toList();

        return records;
    }

    private Stream<SavingRecord> filterMonthRecords(Long userId){
        LocalDateTime startOfMonth = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);

        List<SavingRecord> records = savingRecordRepository2.list(userId);

        return records.stream().filter(sr -> {
            LocalDateTime createdAt = sr.getCreatedAt();
            return !createdAt.isBefore(startOfMonth) && createdAt.isBefore(endOfMonth);
        });
    }

    // 총 절약 금액
    public Long totalAmount(Long userId){
        return savingRecordRepository2.list(userId).stream().mapToLong(sr -> sr.getAmount()).sum();
    }

    // 총 절약 기록
    public List<SavingRecord> getAllRecords(Long userId){
        return savingRecordRepository2.list(userId).stream().toList();
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