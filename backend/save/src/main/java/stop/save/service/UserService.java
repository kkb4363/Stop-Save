package stop.save.service;

import stop.save.entity.User;
import stop.save.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 사용자 등록
    public User registerUser(User user) {
        // 중복 체크
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 기본값 설정
        user.setLevel(1);
        user.setExperience(0);
        user.setTotalSavings(0L);

        return userRepository.save(user);
    }

    // 사용자 로그인 (간단한 버전)
    public Optional<User> loginUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    // 사용자 정보 조회
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // 경험치 추가 및 레벨업 처리
    public User addExperience(Long userId, Integer exp) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            int currentExp = user.getExperience() + exp;
            user.setExperience(currentExp);

            // 레벨업 계산 (100exp = 1레벨)
            int newLevel = (currentExp / 100) + 1;
            if (newLevel > user.getLevel()) {
                user.setLevel(newLevel);
            }

            return userRepository.save(user);
        }
        throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }

    // 총 절약 금액 업데이트
    public User updateTotalSavings(Long userId, Long amount) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTotalSavings(user.getTotalSavings() + amount);
            return userRepository.save(user);
        }
        throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }

    // 사용자 정보 수정
    public User updateUser(User user) {
        return userRepository.save(user);
    }
}