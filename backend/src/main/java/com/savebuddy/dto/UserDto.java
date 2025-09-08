package com.savebuddy.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @Builder
public class UserDto {
    private Long id;
    private String email;
    private String nickname;
    private String username;
    private Integer level;
    private Integer experience;
    private Long totalSavings;
    private Long totalExpense;
    private Long monthlyTarget;
    private String picture;
    private String sub;
}
