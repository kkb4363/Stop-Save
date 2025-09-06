package com.savebuddy.repository;

import com.savebuddy.entity.SavingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SavingRecordRepository extends JpaRepository<SavingRecord, Long> {

    // 사용자별 절약 기록 조회
    List<SavingRecord> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 사용자별 오늘 절약 기록
    @Query("SELECT sr FROM SavingRecord sr WHERE sr.user.id = :userId " +
            "AND DATE(sr.createdAt) = DATE(CURRENT_DATE)")
    List<SavingRecord> findTodaySavingsByUserId(@Param("userId") Long userId);

    // 사용자별 이번 달 절약 기록
    @Query("SELECT sr FROM SavingRecord sr WHERE sr.user.id = :userId " +
            "AND YEAR(sr.createdAt) = YEAR(CURRENT_DATE) " +
            "AND MONTH(sr.createdAt) = MONTH(CURRENT_DATE)")
    List<SavingRecord> findThisMonthSavingsByUserId(@Param("userId") Long userId);

    // 카테고리별 절약 통계
    @Query("SELECT sr.category, COALESCE(SUM(sr.amount), 0) FROM SavingRecord sr " +
            "WHERE sr.user.id = :userId GROUP BY sr.category")
    List<Object[]> getCategorySavingsStatsByUserId(@Param("userId") Long userId);

    // 기간별 절약 기록
    List<SavingRecord> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId, LocalDateTime startDate, LocalDateTime endDate);



}