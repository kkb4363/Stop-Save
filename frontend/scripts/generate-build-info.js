import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 현재 시간을 ISO 형식으로 생성
const buildTime = new Date().toISOString();

// package.json에서 버전 정보 읽기
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);
const version = packageJson.version || "1.0.0";

// 빌드 번호 생성 (타임스탬프 기반)
const buildNumber = Math.floor(Date.now() / 1000).toString();

// 빌드 정보 파일 내용 생성
const buildInfoContent = `// 이 파일은 빌드 시 자동으로 생성됩니다.
export const BUILD_INFO = {
  BUILD_TIME: "${buildTime}",
  VERSION: "${version}",
  BUILD_NUMBER: "${buildNumber}"
} as const;`;

// 파일 저장
const outputPath = path.join(
  __dirname,
  "..",
  "src",
  "constants",
  "buildInfo.ts"
);
fs.writeFileSync(outputPath, buildInfoContent, "utf8");

console.log(`✅ 빌드 정보 생성 완료: ${buildTime}`);
console.log(`📦 버전: ${version}`);
console.log(`🔢 빌드 번호: ${buildNumber}`);
