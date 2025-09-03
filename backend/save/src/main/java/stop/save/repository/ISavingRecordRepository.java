package stop.save.repository;

import stop.save.entity.SavingRecord;
import stop.save.entity.User;

import java.util.Date;
import java.util.List;

public interface ISavingRecordRepository {
    // 해당 유저에 모든 레코드 가져오기
    List<SavingRecord> list(Long userId);

//    List<SavingRecord> list(Long userId, Date date);

    // 이번 달 절약 총 금액
//    Long monthTotalAmount(Long userId);
//
//    // 최근 7일 절약 총 금액
//    Long weekTotalAmount(Long userId);

    // 해당 날짜에 절약한 데이터

}
