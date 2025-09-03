package stop.save.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import stop.save.entity.SavingRecord;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SavingRecordControllerTest {

    @Autowired
    SavingRecordController sv;

    @Test
    void getLatestRecords() {
        ResponseEntity<List<SavingRecord>> test = sv.getLatestRecords(2L);
        System.out.println(test);
    }

    @Test
    void getMonthTotalCount() {
        ResponseEntity<Long> test = sv.getMonthTotalCount(2L);
        System.out.println(test);
    }

    @Test
    void totalAmount() {
        ResponseEntity<Long> test2 = sv.getTotalAmount(2L);
        System.out.println("test2="+ test2);
    }
}