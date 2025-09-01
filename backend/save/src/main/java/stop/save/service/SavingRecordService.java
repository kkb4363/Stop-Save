package stop.save.service;

import stop.save.entity.SavingRecord;
import stop.save.entity.User;
import stop.save.repository.SavingRecordRepository;
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