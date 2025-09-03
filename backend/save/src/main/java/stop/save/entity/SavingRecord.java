package stop.save.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity @Table(name = "saving_records") @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SavingRecord {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long amount; // 절약 금액

    private String category; // 카테고리 (음식, 교통, 쇼핑 등)

    @CreationTimestamp
    private LocalDateTime createdAt;

    @NotBlank
    private String itemName; // 절약한 아이템 (커피, 택시 등)

    private String memo; // 메모

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") @JsonIgnore
    private User user;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMemo() { return memo; }
    public void setMemo(String memo) { this.memo = memo; }

    public LocalDateTime getCreatedAt() { return createdAt; }

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