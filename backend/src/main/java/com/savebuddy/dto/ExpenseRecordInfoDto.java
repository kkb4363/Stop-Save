package com.savebuddy.dto;

import com.savebuddy.entity.ExpenseRecord;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ExpenseRecordInfoDto {
    private Long count;
    private Long totalAmount;
    private List<ExpenseRecord> data;
}
