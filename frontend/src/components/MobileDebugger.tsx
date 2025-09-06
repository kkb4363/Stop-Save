import { useState, useEffect } from "react";
import { tokenStorage } from "../utils/tokenStorage";

interface DebugInfo {
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
  data?: any;
}

export const MobileDebugger = () => {
  const [logs, setLogs] = useState<DebugInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>({});

  useEffect(() => {
    // 디바이스 정보 수집
    const info = {
      userAgent: navigator.userAgent,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
      localStorage: typeof localStorage !== "undefined",
      sessionStorage: typeof sessionStorage !== "undefined",
      currentUrl: window.location.href,
      hasToken: !!tokenStorage.getToken(),
      tokenPreview: tokenStorage.getToken()?.substring(0, 20) + "..." || "none",
    };
    setDeviceInfo(info);

    // 콘솔 로그 캡처
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (
      level: "info" | "success" | "warning" | "error",
      message: string,
      data?: any
    ) => {
      const newLog: DebugInfo = {
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        data,
      };
      setLogs((prev) => [...prev.slice(-19), newLog]); // 최대 20개 로그 유지
    };

    console.log = (...args) => {
      originalLog(...args);
      if (
        args[0]?.includes?.("🔍") ||
        args[0]?.includes?.("✅") ||
        args[0]?.includes?.("❌") ||
        args[0]?.includes?.("📱")
      ) {
        addLog("info", args.join(" "), args[1]);
      }
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog("warning", args.join(" "));
    };

    console.error = (...args) => {
      originalError(...args);
      addLog("error", args.join(" "));
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-50 text-xs"
        style={{ fontSize: "10px", padding: "8px" }}
      >
        🐛 DEBUG
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 p-2 overflow-auto text-xs">
      <div className="bg-white rounded p-3 max-h-full overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm">모바일 디버거</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            닫기
          </button>
        </div>

        {/* 디바이스 정보 */}
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <h4 className="font-semibold mb-2">디바이스 정보</h4>
          <div className="space-y-1 text-xs">
            <div>
              <strong>모바일:</strong> {deviceInfo.isMobile ? "예" : "아니오"}
            </div>
            <div>
              <strong>localStorage:</strong>{" "}
              {deviceInfo.localStorage ? "사용가능" : "불가능"}
            </div>
            <div>
              <strong>토큰 있음:</strong>{" "}
              {deviceInfo.hasToken ? "예" : "아니오"}
            </div>
            <div>
              <strong>토큰 미리보기:</strong> {deviceInfo.tokenPreview}
            </div>
            <div>
              <strong>현재 URL:</strong> {deviceInfo.currentUrl}
            </div>
          </div>
        </div>

        {/* 실시간 상태 */}
        <div className="mb-4 p-2 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">현재 상태</h4>
          <button
            onClick={() => {
              const info = {
                hasToken: !!tokenStorage.getToken(),
                tokenPreview:
                  tokenStorage.getToken()?.substring(0, 20) + "..." || "none",
                currentUrl: window.location.href,
              };
              setDeviceInfo((prev) => ({ ...prev, ...info }));
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs mb-2"
          >
            상태 새로고침
          </button>
        </div>

        {/* 로그 */}
        <div className="space-y-1">
          <h4 className="font-semibold">실시간 로그</h4>
          {logs.length === 0 ? (
            <div className="text-gray-500">로그가 없습니다.</div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs ${
                  log.level === "error"
                    ? "bg-red-100"
                    : log.level === "warning"
                    ? "bg-yellow-100"
                    : log.level === "success"
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}
              >
                <div className="font-mono text-xs">
                  <span className="text-gray-500">{log.timestamp}</span>{" "}
                  {log.message}
                </div>
                {log.data && (
                  <pre className="text-xs mt-1 overflow-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>

        {/* 테스트 버튼들 */}
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">테스트</h4>
          <button
            onClick={() => {
              console.log("🔍 수동 토큰 테스트:", tokenStorage.getToken());
            }}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-2"
          >
            토큰 확인
          </button>
          <button
            onClick={() => {
              fetch(
                "https://save-buddy-69f54793f2e7.herokuapp.com/api/users/me",
                {
                  headers: {
                    Authorization: `Bearer ${tokenStorage.getToken()}`,
                  },
                }
              )
                .then((res) => {
                  console.log("🔍 API 테스트 응답:", res.status);
                  return res.json();
                })
                .then((data) => console.log("🔍 API 테스트 데이터:", data))
                .catch((err) => console.error("❌ API 테스트 실패:", err));
            }}
            className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
          >
            API 테스트
          </button>
        </div>
      </div>
    </div>
  );
};
