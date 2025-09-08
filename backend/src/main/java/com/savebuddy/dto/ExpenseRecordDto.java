package com.savebuddy.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ExpenseRecordDto {
    private Long id;
    private String email;
    private Long userId;
    private String itemName;
    private Long amount;
    private String category;
    private String memo;
    private LocalDateTime createdAt;
}

