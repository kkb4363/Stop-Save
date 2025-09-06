package com.savebuddy.dto;

import com.savebuddy.entity.SavingRecord;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RecordInfoDto {
    private Long count;
    private Long totalAmount;
    private List<SavingRecord> data;
}
