package com.savebuddy.service;

import com.savebuddy.dto.ExpenseRecordInfoDto;
import com.savebuddy.entity.ExpenseRecord;
import com.savebuddy.entity.User;
import com.savebuddy.repository.ExpenseRecordRepository;
import com.savebuddy.repository.OAuth2UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseRecordService {

    @Autowired
    private ExpenseRecordRepository expenseRecordRepository;

    @Autowired
    private OAuth2UserRepository oAuth2UserRepository;

    @Autowired
    private OAuth2UserService oAuth2UserService;

    // 소비 기록 등록
    public ExpenseRecord createExpenseRecord(String email, String itemName, Long amount, String category, String memo) {
        Optional<User> userOpt = oAuth2UserService.findByEmail(email);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        User user = userOpt.get();
        ExpenseRecord record = new ExpenseRecord();
        record.setUser(user);
        record.setItemName(itemName);
        record.setAmount(amount);
        record.setCategory(category);
        record.setMemo(memo);

        ExpenseRecord expenseRecord = expenseRecordRepository.save(record);

        // 사용자 총 소비 금액
        user.setTotalExpense(Optional.ofNullable(user.getTotalExpense()).orElse(0L) + amount);
//        user.setExperience(user.getExperience() + 10);
        oAuth2UserRepository.save(user);

        return expenseRecord;
    }

    // 총 소비 기록 조회
    public List<ExpenseRecord> allRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);
        return expenseRecordRepository.findByUserIdOrderByCreatedAtDesc(optUser.get().getId());
    }

    // 오늘 소비 조회
    public ExpenseRecordInfoDto todayRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        List<ExpenseRecord> list = expenseRecordRepository.findTodaySavingsByUserId(optUser.get().getId());

        return ExpenseRecordInfoDto.builder()
                .totalAmount(list.stream().mapToLong(re -> re.getAmount()).sum())
                .count(list.stream().count())
                .data(list)
                .build();
    }

    // 이번달 소비 조회
    public ExpenseRecordInfoDto monthRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        List<ExpenseRecord> list = expenseRecordRepository.findThisMonthSavingsByUserId(optUser.get().getId());

        return ExpenseRecordInfoDto.builder()
                .totalAmount(list.stream().mapToLong(re -> re.getAmount()).sum())
                .count(list.stream().count())
                .data(list)
                .build();
    }

    // 최근 3가지 소비 기록
    public List<ExpenseRecord> getLatestRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        List<ExpenseRecord> list = expenseRecordRepository.findByUserIdOrderByCreatedAtDesc(optUser.get().getId());

        return list.stream()
                .sorted((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(3).toList();
    }

    // 최근 7일 소비 통계
    public Map<DayOfWeek, Long> getWeekRecordsStatus(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        LocalDateTime startDate = LocalDate.now().minusDays(6).atStartOfDay();
        LocalDateTime endDate = LocalDate.now().atTime(LocalTime.MAX);

        List<ExpenseRecord> list = expenseRecordRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(optUser.get().getId(), startDate, endDate);


        Map<DayOfWeek, Long> status = list.stream()
                .collect(Collectors.groupingBy(
                        sr -> sr.getCreatedAt().getDayOfWeek(),
                        Collectors.summingLong(ExpenseRecord::getAmount)
                ));

        return status;
    }


    // 카테고리별 통계
    public List<Object[]> getCategorySavingsStats(String email) {
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        return expenseRecordRepository.getCategorySavingsStatsByUserId(optUser.get().getId());
    }

    // 기간별 소비 기록
    public List<ExpenseRecord> getExpenseRecordsByPeriod(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRecordRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
    }

    // 소비 기록 삭제
    public void deleteExpenseRecord(Long recordId, String email) {
        Optional<ExpenseRecord> recordOpt = expenseRecordRepository.findById(recordId);
        if (recordOpt.isPresent()) {
            ExpenseRecord record = recordOpt.get();
            if (record.getUser().getEmail().equals(email)) {
                User user = record.getUser();
                Long deletedAmount = record.getAmount();

                // 기록 삭제
                expenseRecordRepository.delete(record);

                // 사용자의 총 소비 금액에서 삭제된 금액 차감
                user.setTotalSavings(user.getTotalSavings() - deletedAmount);
                oAuth2UserRepository.save(user);

                System.out.println("소비 기록 삭제 완료: " + deletedAmount + "원, 새로운 총액: " + user.getTotalSavings() + "원");
            } else {
                throw new RuntimeException("권한이 없습니다.");
            }
        } else {
            throw new RuntimeException("기록을 찾을 수 없습니다.");
        }
    }
}