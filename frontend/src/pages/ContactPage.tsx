import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 이메일 클라이언트로 문의 메일 작성
    const mailtoLink = `mailto:kkb4363@naver.com?subject=[소비 멈춰 적금] ${
      formData.subject
    }&body=${encodeURIComponent(
      `문의 내용:\n${formData.message}\n\n---\n답변 받을 이메일: ${
        formData.email || "미입력"
      }`
    )}`;

    window.location.href = mailtoLink;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          <h1 className="text-xl font-bold text-gray-900">문의하기</h1>
        </div>

        {/* 연락처 정보 */}
        <div className="card p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              궁금한 점이 있으시나요?
            </h2>
            <p className="text-sm text-gray-600">
              소비 멈춰 적금 서비스에 대한 문의사항을 언제든지 보내주세요.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">이메일</h3>
                <a
                  href="mailto:kkb4363@naver.com"
                  className="text-sm text-brand-600 hover:underline"
                >
                  kkb4363@naver.com
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">빠른 답변</p>
                <p>평일 기준 24시간 이내 답변드립니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">다양한 문의</p>
                <p>
                  기능 개선 제안, 버그 신고, 사용법 문의 등 모든 내용을
                  환영합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-brand-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">개인정보 보호</p>
                <p>
                  문의 내용은 안전하게 보호되며, 답변 목적으로만 사용됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 문의 양식 */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            문의 작성
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                문의 유형
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              >
                <option value="">문의 유형을 선택해주세요</option>
                <option value="기능 문의">기능 문의</option>
                <option value="버그 신고">버그 신고</option>
                <option value="기능 개선 제안">기능 개선 제안</option>
                <option value="계정 문의">계정 문의</option>
                <option value="데이터 문의">데이터 문의</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                답변 받을 이메일 (선택사항)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="답변을 받을 이메일 주소를 입력해주세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                입력하지 않으시면 등록된 계정 이메일로 답변드립니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                문의 내용
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="궁금한 점이나 문의사항을 자세히 작성해주세요.&#10;&#10;• 사용 중인 기기 정보 (iPhone, Android 등)&#10;• 발생한 문제의 상세 상황&#10;• 스크린샷이 있다면 첨부해주세요&#10;&#10;더 자세한 정보를 제공해주시면 더 정확한 답변을 드릴 수 있습니다."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">안내사항</p>
                  <p>
                    문의 작성 버튼을 클릭하면 기본 이메일 앱이 열리며, 작성하신
                    내용이 자동으로 입력됩니다. 이메일을 보내주시면 빠른 시일
                    내에 답변드리겠습니다.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors font-medium"
            >
              문의 작성하기
            </button>
          </form>
        </div>

        {/* FAQ 섹션 */}
        <div className="card p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            자주 묻는 질문
          </h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Q. 데이터가 삭제되었어요
              </h4>
              <p className="text-sm text-gray-600">
                로그아웃 후 다시 로그인해보세요. 서버에 저장된 데이터는 안전하게
                보관됩니다. 문제가 지속되면 문의해주세요.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Q. 월간 목표를 변경하고 싶어요
              </h4>
              <p className="text-sm text-gray-600">
                설정 페이지에서 월간 절약 목표를 언제든지 변경할 수 있습니다.
                슬라이더를 조정한 후 '목표 저장' 버튼을 눌러주세요.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Q. 데이터를 내보내고 싶어요
              </h4>
              <p className="text-sm text-gray-600">
                설정 페이지의 '데이터 내보내기' 기능을 이용하여 Excel 파일로
                절약 기록을 내보낼 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
