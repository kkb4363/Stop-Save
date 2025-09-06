package com.savebuddy.dto;

import com.savebuddy.entity.SavingRecord;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
public class SavingRecordDto {
    private Long id;
    private String email;
    private Long userId;
    private String itemName;
    private Long amount;
    private String category;
    private String memo;
    private LocalDateTime createdAt;
}

