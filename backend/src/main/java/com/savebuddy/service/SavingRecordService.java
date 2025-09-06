package com.savebuddy.service;

import com.savebuddy.dto.RecordInfoDto;
import com.savebuddy.entity.SavingRecord;
import com.savebuddy.entity.User;
import com.savebuddy.repository.OAuth2UserRepository;
import com.savebuddy.repository.SavingRecordRepository;
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
public class SavingRecordService {

    @Autowired
    private SavingRecordRepository savingRecordRepository;

    @Autowired
    private OAuth2UserRepository oAuth2UserRepository;

    @Autowired
    private OAuth2UserService oAuth2UserService;

    // 절약 기록 등록
    public SavingRecord createSavingRecord(String email, String itemName, Long amount, String category, String memo) {
        Optional<User> userOpt = oAuth2UserService.findByEmail(email);
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

        // 사용자 총 절약 금액 & 경험치 추가(1회당 10exp)
        user.setTotalSavings(user.getTotalSavings() + amount);
        user.setExperience(user.getExperience() + 10);
        oAuth2UserRepository.save(user);

        return savedRecord;
    }

    // 총 절약 기록 조회
    public List<SavingRecord> allRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);
        return savingRecordRepository.findByUserIdOrderByCreatedAtDesc(optUser.get().getId());
    }

    // 오늘 절약 조회
    public RecordInfoDto todayRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        List<SavingRecord> list = savingRecordRepository.findTodaySavingsByUserId(optUser.get().getId());

        return RecordInfoDto.builder()
                .totalAmount(list.stream().mapToLong(re -> re.getAmount()).sum())
                .count(list.stream().count())
                .data(list)
                .build();
    }

    // 이번달 절약 조회
    public RecordInfoDto monthRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        List<SavingRecord> list = savingRecordRepository.findThisMonthSavingsByUserId(optUser.get().getId());

        return RecordInfoDto.builder()
                .totalAmount(list.stream().mapToLong(re -> re.getAmount()).sum())
                .count(list.stream().count())
                .data(list)
                .build();
    }

    // 최근 3가지 절약 기록
    public List<SavingRecord> getLatestRecords(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        List<SavingRecord> list = savingRecordRepository.findByUserIdOrderByCreatedAtDesc(optUser.get().getId());

        return list.stream()
                .sorted((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(3).toList();
    }

    // 최근 7일 절약 통계
    public Map<DayOfWeek, Long> getWeekRecordsStatus(String email){
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        LocalDateTime startDate = LocalDate.now().minusDays(6).atStartOfDay();
        LocalDateTime endDate = LocalDate.now().atTime(LocalTime.MAX);

        List<SavingRecord> list = savingRecordRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(optUser.get().getId(), startDate, endDate);


        Map<DayOfWeek, Long> status = list.stream()
                .collect(Collectors.groupingBy(
                        sr -> sr.getCreatedAt().getDayOfWeek(),
                        Collectors.summingLong(SavingRecord::getAmount)
                ));

        return status;
    }


    // 카테고리별 통계
    public List<Object[]> getCategorySavingsStats(String email) {
        Optional<User> optUser = oAuth2UserService.findByEmail(email);

        return savingRecordRepository.getCategorySavingsStatsByUserId(optUser.get().getId());
    }

    // 기간별 절약 기록
    public List<SavingRecord> getSavingRecordsByPeriod(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return savingRecordRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
    }

    // 절약 기록 삭제
    public void deleteSavingRecord(Long recordId, String email) {
        Optional<SavingRecord> recordOpt = savingRecordRepository.findById(recordId);
        if (recordOpt.isPresent()) {
            SavingRecord record = recordOpt.get();
            if (record.getUser().getEmail().equals(email)) {
                savingRecordRepository.delete(record);
            } else {
                throw new RuntimeException("권한이 없습니다.");
            }
        } else {
            throw new RuntimeException("기록을 찾을 수 없습니다.");
        }
    }
}