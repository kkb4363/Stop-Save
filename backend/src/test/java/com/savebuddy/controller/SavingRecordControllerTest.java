package com.savebuddy.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import com.savebuddy.dto.SavingRecordDto;
import com.savebuddy.entity.SavingRecord;

import java.util.List;

@SpringBootTest
class SavingRecordControllerTest {

    @Autowired
    SavingRecordController sv;

    @Test
    void getLatestRecords() {
        ResponseEntity<List<SavingRecordDto>> test = sv.getLatestRecords(2L);
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

    @Test
    void getAllRecords() {
        ResponseEntity<List<SavingRecord>> test = sv.getAllRecords(2L);
        System.out.println(test);
    }
}