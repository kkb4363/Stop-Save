package stop.save.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenges")
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title; // 챌린지 제목

    private String description; // 챌린지 설명

    @NotNull
    private Long targetAmount; // 목표 금액

    @NotNull
    private Integer duration; // 기간 (일)

    @NotNull
    private Integer experienceReward; // 보상 경험치

    @NotNull
    private Boolean isActive = true; // 활성 상태

    @CreationTimestamp
    private LocalDateTime createdAt;

    // 기본 생성자
    public Challenge() {}

    // Getter, Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getTargetAmount() { return targetAmount; }
    public void setTargetAmount(Long targetAmount) { this.targetAmount = targetAmount; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getExperienceReward() { return experienceReward; }
    public void setExperienceReward(Integer experienceReward) { this.experienceReward = experienceReward; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}