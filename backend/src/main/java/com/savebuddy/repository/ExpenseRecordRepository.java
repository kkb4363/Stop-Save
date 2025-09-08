package com.savebuddy.repository;

import com.savebuddy.entity.ExpenseRecord;
import com.savebuddy.entity.SavingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRecordRepository extends JpaRepository<ExpenseRecord, Long> {

    // 사용자별 소비 기록 조회
    List<ExpenseRecord> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 사용자별 오늘 소비 기록
    @Query("SELECT er FROM ExpenseRecord er WHERE er.user.id = :userId " +
            "AND DATE(er.createdAt) = DATE(CURRENT_DATE)")
    List<ExpenseRecord> findTodaySavingsByUserId(@Param("userId") Long userId);

    // 사용자별 이번 달 소비 기록
    @Query("SELECT er FROM ExpenseRecord er WHERE er.user.id = :userId " +
            "AND YEAR(er.createdAt) = YEAR(CURRENT_DATE) " +
            "AND MONTH(er.createdAt) = MONTH(CURRENT_DATE)")
    List<ExpenseRecord> findThisMonthSavingsByUserId(@Param("userId") Long userId);

    // 카테고리별 소비 통계
    @Query("SELECT er.category, COALESCE(SUM(er.amount), 0) FROM ExpenseRecord er " +
            "WHERE er.user.id = :userId GROUP BY er.category")
    List<Object[]> getCategorySavingsStatsByUserId(@Param("userId") Long userId);

    // 기간별 소비 기록
    List<ExpenseRecord> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId, LocalDateTime startDate, LocalDateTime endDate);



}