package stop.save.repository;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import stop.save.entity.SavingRecord;
import stop.save.entity.User;

import java.util.List;

@Repository
public class SavingRecordRepository2 implements ISavingRecordRepository{

    private final EntityManager em;

    public SavingRecordRepository2(EntityManager em) {
        this.em = em;
    }

    @Override
    public List<SavingRecord> list(Long userId) {
        return em.createQuery(
                        "select sr from SavingRecord sr where sr.user.id = :userId",
                        SavingRecord.class)
                .setParameter("userId", userId)
                .getResultList();
    }


}
