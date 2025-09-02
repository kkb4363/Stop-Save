package stop.save.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_completions")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ChallengeCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "challenge_id", nullable = false)
    private String challengeId;

    @Column(name = "challenge_title", nullable = false)
    private String challengeTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "period", nullable = false)
    private ChallengePeriod period;

    @Column(name = "reward_amount", nullable = false)
    private Integer rewardAmount;

    @CreatedDate
    @Column(name = "completed_at", nullable = false, updatable = false)
    private LocalDateTime completedAt;

    public enum ChallengePeriod {
        DAILY, WEEKLY, MONTHLY
    }

    public ChallengeCompletion(User user, String challengeId, String challengeTitle, 
                              ChallengePeriod period, Integer rewardAmount) {
        this.user = user;
        this.challengeId = challengeId;
        this.challengeTitle = challengeTitle;
        this.period = period;
        this.rewardAmount = rewardAmount;
    }
}
