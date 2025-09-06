// JWT 토큰을 자동으로 포함하는 fetch 래퍼
export const apiClient = {
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    // localStorage에서 JWT 토큰 가져오기
    const token = localStorage.getItem("jwt_token");

    // 기본 헤더 설정
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    // JWT 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 요청 옵션 병합
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include", // 쿠키도 함께 보내기 (하위 호환성)
    };

    const response = await fetch(url, requestOptions);

    // 401 에러 시 토큰 제거
    if (response.status === 401) {
      localStorage.removeItem("jwt_token");
      console.log("🔑 JWT 토큰 만료 - 제거됨");
    }

    return response;
  },

  async get(url: string, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, { ...options, method: "GET" });
  },

  async post(
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put(
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete(url: string, options: RequestInit = {}): Promise<Response> {
    return this.fetch(url, { ...options, method: "DELETE" });
  },
};
