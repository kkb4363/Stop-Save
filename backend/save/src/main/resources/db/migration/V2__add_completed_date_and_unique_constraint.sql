-- V2: 중복 방지를 위한 completed_date 컬럼 및 유니크 제약조건 추가

-- 1. completed_date 컬럼 추가
ALTER TABLE challenge_completions 
ADD COLUMN completed_date DATE;

-- 2. 기존 데이터의 completed_date 값 설정
UPDATE challenge_completions 
SET completed_date = DATE(completed_at) 
WHERE completed_date IS NULL;

-- 3. completed_date 컬럼을 NOT NULL로 변경
ALTER TABLE challenge_completions 
MODIFY COLUMN completed_date DATE NOT NULL;

-- 4. 중복 기록 정리 (같은 사용자, 같은 챌린지, 같은 기간, 같은 날짜의 중복 제거)
DELETE c1 FROM challenge_completions c1
INNER JOIN challenge_completions c2 
WHERE c1.id > c2.id 
AND c1.user_id = c2.user_id 
AND c1.challenge_id = c2.challenge_id 
AND c1.period = c2.period 
AND c1.completed_date = c2.completed_date;

-- 5. 유니크 제약조건 추가
ALTER TABLE challenge_completions 
ADD CONSTRAINT uk_user_challenge_period_date 
UNIQUE (user_id, challenge_id, period, completed_date);
