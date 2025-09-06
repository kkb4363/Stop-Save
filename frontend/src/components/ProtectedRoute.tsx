import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    // OAuth 진행 중인지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const isOAuthCallback =
      urlParams.get("loginSuccess") ||
      window.location.pathname.includes("/oauth2/");

    // OAuth 진행 중이 아닐 때만 사용자 정보 확인
    if (!isOAuthCallback) {
      const checkAuth = async () => {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error("인증 확인 실패:", error);
        }
      };

      checkAuth();
    }
  }, [getCurrentUser]);

  useEffect(() => {
    console.log("ProtectedRoute 상태:", { isLoading, isAuthenticated });

    // OAuth 로그인 진행 중인지 확인
    const urlParams = new URLSearchParams(window.location.search);
    const isOAuthCallback =
      urlParams.get("loginSuccess") ||
      window.location.pathname.includes("/oauth2/");

    // OAuth 진행 중이 아니고, 로딩이 완료되고 인증되지 않은 경우에만 로그인 페이지로 리다이렉트
    if (!isOAuthCallback && !isLoading && !isAuthenticated) {
      console.log("인증되지 않음 - 로그인 페이지로 리다이렉트");
      // OAuth2 로그인 후 잠시 대기하여 세션 설정 시간 확보
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate]);

  // OAuth 콜백 처리 중인지 확인
  const urlParams = new URLSearchParams(window.location.search);
  const isOAuthCallback = urlParams.get("loginSuccess");

  // OAuth 콜백 처리 중이면 사용자 정보 다시 확인
  useEffect(() => {
    if (isOAuthCallback && !isAuthenticated) {
      console.log("OAuth 콜백 감지 - 사용자 정보 재확인");
      getCurrentUser();
    }
  }, [isOAuthCallback, isAuthenticated, getCurrentUser]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 표시
  if (isLoading || (!isAuthenticated && !isOAuthCallback)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isOAuthCallback ? "로그인 처리 중..." : "로딩 중..."}
          </p>
        </div>
      </div>
    );
  }

  // 인증된 사용자만 자식 컴포넌트 렌더링
  return <>{children}</>;
}
