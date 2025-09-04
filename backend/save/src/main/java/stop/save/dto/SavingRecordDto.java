package stop.save.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
public class SavingRecordDto {
    private Long id;
    private Long userId;
    private String itemName;
    private Long amount;
    private String category;
    private String memo;
    private LocalDateTime createdAt;
}
