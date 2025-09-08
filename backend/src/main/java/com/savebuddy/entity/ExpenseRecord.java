package com.savebuddy.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "expense_records") @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ExpenseRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long amount; // 소비 금액

    private String category; // 카테고리 (음식, 교통, 쇼핑 등)

    @CreationTimestamp
    private LocalDateTime createdAt;

    @NotBlank
    private String itemName; // 소비한 아이템 (커피, 택시 등)

    private String memo; // 메모

    @ManyToOne(fetch = FetchType.LAZY) @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @Override
    public String toString() {
        return "SavingRecord{" +
                "id=" + id +
                ", amount=" + amount +
                ", category='" + category + '\'' +
                ", createdAt=" + createdAt +
                ", itemName='" + itemName + '\'' +
                ", memo='" + memo + '\'' +
                ", user=" + user +
                '}';
    }
}