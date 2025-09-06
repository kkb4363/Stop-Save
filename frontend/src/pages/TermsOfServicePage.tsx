import { useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
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
          <h1 className="text-xl font-bold text-gray-900">서비스 이용약관</h1>
        </div>

        {/* 내용 */}
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제1조 (목적)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              이 약관은 소비 멈춰 적금 서비스(이하 "서비스")를 이용함에 있어
              서비스 운영자와 이용자의 권리, 의무 및 책임사항을 규정함을
              목적으로 합니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제2조 (정의)
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <strong>1. "서비스"</strong>란 소비 멈춰 적금 앱을 통해 제공되는
                절약 기록, 통계, 챌린지 등의 모든 서비스를 의미합니다.
              </li>
              <li>
                <strong>2. "이용자"</strong>란 이 약관에 따라 서비스를 이용하는
                회원을 말합니다.
              </li>
              <li>
                <strong>3. "회원"</strong>이란 서비스에 개인정보를 제공하여
                회원등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며,
                서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제3조 (약관의 효력 및 변경)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그
                효력을 발생합니다.
              </p>
              <p>
                2. 서비스 운영자는 필요하다고 인정되는 경우 이 약관을 변경할 수
                있으며, 약관이 변경된 경우 지체없이 공지합니다.
              </p>
              <p>
                3. 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고
                탈퇴할 수 있습니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제4조 (회원가입)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 회원가입은 이용자가 약관의 내용에 대하여 동의를 하고
                회원가입신청을 한 후 서비스 운영자가 이러한 신청에 대하여
                승낙함으로써 체결됩니다.
              </p>
              <p>
                2. 서비스 운영자는 다음 각 호에 해당하는 신청에 대하여는 승낙을
                하지 않거나 사후에 이용계약을 해지할 수 있습니다:
              </p>
              <ul className="ml-4 space-y-1">
                <li>
                  • 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이
                  있는 경우
                </li>
                <li>• 실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>
                  • 허위의 정보를 기재하거나, 서비스 운영자가 제시하는 내용을
                  기재하지 않은 경우
                </li>
                <li>
                  • 기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이
                  있다고 판단되는 경우
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제5조 (서비스의 제공)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 서비스 운영자는 회원에게 아래와 같은 서비스를 제공합니다:
              </p>
              <ul className="ml-4 space-y-1">
                <li>• 절약 기록 및 관리 서비스</li>
                <li>• 절약 통계 및 분석 서비스</li>
                <li>• 절약 챌린지 참여 서비스</li>
                <li>• 데이터 내보내기 서비스</li>
                <li>• 기타 서비스 운영자가 정하는 서비스</li>
              </ul>
              <p>
                2. 서비스 운영자는 서비스를 일정범위로 분할하여 각 범위별로
                이용가능시간을 별도로 지정할 수 있습니다. 다만, 이러한 경우에는
                그 내용을 사전에 공지합니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제6조 (서비스의 중단)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 서비스 운영자는 컴퓨터 등 정보통신설비의 보수점검, 교체 및
                고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을
                일시적으로 중단할 수 있습니다.
              </p>
              <p>
                2. 서비스 운영자는 제1항의 사유로 서비스의 제공이 일시적으로
                중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여
                배상하지 않습니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제7조 (회원의 의무)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. 이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="ml-4 space-y-1">
                <li>• 신청 또는 변경시 허위 내용의 등록</li>
                <li>• 타인의 정보 도용</li>
                <li>• 서비스 운영자가 게시한 정보의 변경</li>
                <li>
                  • 서비스 운영자가 금지한 정보(컴퓨터 프로그램 등)의 송신 또는
                  게시
                </li>
                <li>
                  • 서비스 운영자 기타 제3자의 저작권 등 지적재산권에 대한 침해
                </li>
                <li>
                  • 서비스 운영자 기타 제3자의 명예를 손상시키거나 업무를
                  방해하는 행위
                </li>
                <li>
                  • 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에
                  반하는 정보를 서비스에 공개 또는 게시하는 행위
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제8조 (저작권의 귀속 및 이용제한)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 서비스에 의해 작성된 저작물에 대한 저작권 기타 지적재산권은
                서비스 운영자에게 귀속됩니다.
              </p>
              <p>
                2. 이용자는 서비스를 이용함으로써 얻은 정보 중 서비스 운영자에게
                지적재산권이 귀속된 정보를 서비스 운영자의 사전 승낙없이 복제,
                송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로
                이용하거나 제3자에게 이용하게 하여서는 안됩니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제9조 (개인정보보호)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              서비스 운영자는 이용자의 개인정보를 보호하기 위해
              개인정보보호정책을 수립하여 시행하고 있으며, 관련 법령에 의거하여
              이용자의 개인정보를 보호합니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제10조 (손해배상)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 서비스 운영자는 무료로 제공되는 서비스와 관련하여 회원에게
                어떠한 손해가 발생하더라도 동 손해가 서비스 운영자의 고의 또는
                중대한 과실에 의한 경우를 제외하고 이에 대하여 책임을 부담하지
                아니합니다.
              </p>
              <p>
                2. 서비스 운영자는 회원이 서비스에 게재한 정보, 자료, 사실의
                신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제11조 (면책조항)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 서비스 운영자는 천재지변 또는 이에 준하는 불가항력으로 인하여
                서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
                면제됩니다.
              </p>
              <p>
                2. 서비스 운영자는 이용자의 귀책사유로 인한 서비스 이용의 장애에
                대하여 책임을 지지 않습니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              제12조 (분쟁해결)
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                1. 서비스 운영자는 이용자가 제기하는 정당한 의견이나 불만을
                반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를
                설치·운영합니다.
              </p>
              <p>
                2. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우
                민사소송법상의 관할 법원에 제기합니다.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>본 약관은 2024년 1월 1일부터 시행됩니다.</strong>
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              서비스 이용과 관련하여 문의사항이 있으시면{" "}
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

