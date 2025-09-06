// 모바일 브라우저 호환성을 위한 토큰 저장 유틸리티

class TokenStorage {
  private fallbackStorage: { [key: string]: string } = {};

  setToken(token: string): void {
    console.log("🔄 토큰 저장 시도:", token.substring(0, 20) + "...");

    try {
      // 1. localStorage 시도
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("jwt_token", token);
        console.log("✅ localStorage에 토큰 저장 성공");
        return;
      }
    } catch (error) {
      console.warn("⚠️ localStorage 저장 실패:", error);
    }

    try {
      // 2. sessionStorage 시도
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("jwt_token", token);
        console.log("✅ sessionStorage에 토큰 저장 성공");
        return;
      }
    } catch (error) {
      console.warn("⚠️ sessionStorage 저장 실패:", error);
    }

    // 3. 메모리 저장 (마지막 수단)
    this.fallbackStorage["jwt_token"] = token;
    console.log("✅ 메모리에 토큰 저장 성공 (fallback)");
  }

  getToken(): string | null {
    try {
      // 1. localStorage 확인
      if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("jwt_token");
        if (token) {
          console.log("✅ localStorage에서 토큰 조회 성공");
          return token;
        }
      }
    } catch (error) {
      console.warn("⚠️ localStorage 조회 실패:", error);
    }

    try {
      // 2. sessionStorage 확인
      if (typeof sessionStorage !== "undefined") {
        const token = sessionStorage.getItem("jwt_token");
        if (token) {
          console.log("✅ sessionStorage에서 토큰 조회 성공");
          return token;
        }
      }
    } catch (error) {
      console.warn("⚠️ sessionStorage 조회 실패:", error);
    }

    // 3. 메모리에서 확인
    const token = this.fallbackStorage["jwt_token"];
    if (token) {
      console.log("✅ 메모리에서 토큰 조회 성공 (fallback)");
      return token;
    }

    console.log("❌ 모든 저장소에서 토큰 없음");
    return null;
  }

  removeToken(): void {
    console.log("🗑️ 토큰 제거 시작");

    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("jwt_token");
        console.log("✅ localStorage에서 토큰 제거");
      }
    } catch (error) {
      console.warn("⚠️ localStorage 제거 실패:", error);
    }

    try {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem("jwt_token");
        console.log("✅ sessionStorage에서 토큰 제거");
      }
    } catch (error) {
      console.warn("⚠️ sessionStorage 제거 실패:", error);
    }

    // 메모리에서도 제거
    delete this.fallbackStorage["jwt_token"];
    console.log("✅ 메모리에서 토큰 제거");
  }

  hasToken(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

export const tokenStorage = new TokenStorage();
