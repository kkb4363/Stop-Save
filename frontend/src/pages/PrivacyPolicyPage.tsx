import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container-app">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">개인정보 처리방침</h1>
        </div>

        {/* 내용 */}
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. 개인정보의 처리 목적
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              소비 멈춰 적금 서비스(이하 "서비스")는 다음의 목적을 위하여
              개인정보를 처리합니다:
            </p>
            <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-600">
              <li>• 서비스 회원가입 및 관리</li>
              <li>• 절약 기록 및 통계 서비스 제공</li>
              <li>• 챌린지 참여 및 진행상황 관리</li>
              <li>• 서비스 이용에 따른 본인확인, 개인식별</li>
              <li>• 불법 이용방지 및 비인가 사용방지</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. 처리하는 개인정보의 항목
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-md font-medium text-gray-800">필수항목</h3>
                <p className="text-sm text-gray-600 mt-1">
                  사용자명, 닉네임, 이메일 주소, 비밀번호(암호화 저장)
                </p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-800">선택항목</h3>
                <p className="text-sm text-gray-600 mt-1">
                  프로필 사진, 월간 절약 목표, 알림 설정
                </p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-800">
                  자동 수집 항목
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. 개인정보의 처리 및 보유기간
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-600">
              <li>
                • 회원 탈퇴 시까지 (단, 관계법령 위반에 따른 수사·조사 등이
                진행중인 경우에는 해당 수사·조사 종료시까지)
              </li>
              <li>• 부정 이용방지를 위한 기록: 6개월</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서
              명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정
              등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를
              제3자에게 제공합니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. 개인정보처리의 위탁
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              현재 개인정보 처리업무를 외부에 위탁하고 있지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. 정보주체의 권리·의무 및 행사방법
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련
              권리를 행사할 수 있습니다:
            </p>
            <ul className="ml-4 space-y-1 text-sm text-gray-600">
              <li>• 개인정보 처리현황 통지요구</li>
              <li>• 오류 등이 있을 경우 정정·삭제 요구</li>
              <li>• 처리정지 요구</li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              권리 행사는 개인정보보호법 시행규칙 별지 제8호에 따라 작성하여
              서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는
              이에 대해 지체없이 조치하겠습니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. 개인정보의 안전성 확보조치
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에
              필요한 기술적/관리적 및 물리적 조치를 하고 있습니다:
            </p>
            <ul className="ml-4 space-y-1 text-sm text-gray-600">
              <li>• 개인정보 취급 직원의 최소화 및 교육</li>
              <li>• 개인정보에 대한 접근 제한</li>
              <li>• 개인정보의 암호화</li>
              <li>• 해킹 등에 대비한 기술적 대책</li>
              <li>• 개인정보처리시스템 등의 접근권한 관리</li>
              <li>• 접속기록의 보관 및 위변조 방지</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. 개인정보 보호책임자
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
                처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
                같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p>
                  <strong>개인정보 보호책임자</strong>
                </p>
                <p>이메일: kkb4363@naver.com</p>
                <p>연락처: kkb4363@naver.com</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. 개인정보 처리방침 변경
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>본 방침은 2024년 1월 1일부터 시행됩니다.</strong>
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              개인정보 처리와 관련하여 문의사항이 있으시면{" "}
              <a
                href="mailto:kkb4363@naver.com"
                className="text-brand-600 hover:underline"
              >
                kkb4363@naver.com
              </a>
              으로 연락해 주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
