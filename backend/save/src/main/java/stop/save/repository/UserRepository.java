package stop.save.repository;


import stop.save.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 사용자명으로 찾기
    Optional<User> findByUsername(String username);

    // 이메일로 찾기
    Optional<User> findByEmail(String email);

    // 사용자명 또는 이메일로 찾기
    Optional<User> findByUsernameOrEmail(String username, String email);

    // 사용자명 중복 체크
    boolean existsByUsername(String username);

    // 이메일 중복 체크
    boolean existsByEmail(String email);

    // 경험치로 레벨 업데이트 (커스텀 쿼리)
    @Query("UPDATE User u SET u.level = :level WHERE u.id = :userId")
    void updateUserLevel(@Param("userId") Long userId, @Param("level") Integer level);
}