-- 중복 챌린지 완료 기록 정리 스크립트

-- 1. 중복 기록 확인 (실행 전 확인용)
SELECT 
    user_id,
    challenge_id,
    challenge_title,
    period,
    DATE(completed_at) as completed_date,
    COUNT(*) as duplicate_count
FROM challenge_completions 
GROUP BY user_id, challenge_id, period, DATE(completed_at)
HAVING COUNT(*) > 1
ORDER BY user_id, challenge_id, completed_date;

-- 2. 중복 기록 중 가장 오래된 것만 남기고 나머지 삭제
-- 먼저 임시 테이블 생성하여 보존할 기록들의 ID 저장
CREATE TEMPORARY TABLE records_to_keep AS
SELECT MIN(id) as id
FROM challenge_completions
GROUP BY user_id, challenge_id, period, DATE(completed_at);

-- 3. 중복 기록 삭제 (보존할 기록 제외)
DELETE FROM challenge_completions 
WHERE id NOT IN (
    SELECT id FROM records_to_keep
);

-- 4. 임시 테이블 정리
DROP TEMPORARY TABLE records_to_keep;

-- 5. 정리 후 결과 확인
SELECT 
    user_id,
    challenge_id,
    challenge_title,
    period,
    DATE(completed_at) as completed_date,
    COUNT(*) as remaining_count
FROM challenge_completions 
GROUP BY user_id, challenge_id, period, DATE(completed_at)
HAVING COUNT(*) > 1
ORDER BY user_id, challenge_id, completed_date;

-- 6. completed_date 컬럼 추가 (아직 없는 경우)
ALTER TABLE challenge_completions 
ADD COLUMN completed_date DATE;

-- 7. 기존 데이터의 completed_date 업데이트
UPDATE challenge_completions 
SET completed_date = DATE(completed_at) 
WHERE completed_date IS NULL;

-- 8. completed_date 컬럼을 NOT NULL로 변경
ALTER TABLE challenge_completions 
MODIFY COLUMN completed_date DATE NOT NULL;

-- 9. 유니크 제약조건 추가
ALTER TABLE challenge_completions 
ADD CONSTRAINT uk_user_challenge_period_date 
UNIQUE (user_id, challenge_id, period, completed_date);
