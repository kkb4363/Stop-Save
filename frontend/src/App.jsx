import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("long"); // "long" | "short"
  const [price1, setPrice1] = useState(100000);
  const [price2, setPrice2] = useState(90000);
  const [ratio1, setRatio1] = useState(25);

  const ratio2 = 100 - ratio1;

  const qty1 = price1 > 0 ? ratio1 / price1 : 0;
  const qty2 = price2 > 0 ? ratio2 / price2 : 0;
  const avgPrice = qty1 + qty2 > 0 ? 100 / (qty1 + qty2) : 0;

  const fmt = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const isLong = mode === "long";
  const accent = isLong ? "#0F6E56" : "#993C1D";
  const accentBg = isLong ? "#E1F5EE" : "#FAECE7";
  const accentText = isLong ? "#085041" : "#4A1B0C";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2.5rem 2rem",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>
          BTC 평단 계산기
        </h2>

        {/* 롱/숏 토글 */}
        <div
          style={{
            display: "flex",
            background: "#f0f0ee",
            borderRadius: 10,
            padding: 4,
            gap: 4,
          }}
        >
          {["long", "short"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "7px 28px",
                border: "none",
                borderRadius: 7,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
                background:
                  mode === m
                    ? m === "long"
                      ? "#0F6E56"
                      : "#993C1D"
                    : "transparent",
                color: mode === m ? "#fff" : "#888",
              }}
            >
              {m === "long" ? "롱 (Long)" : "숏 (Short)"}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 그리드: 입력 2열 + 결과 1열 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* 1차 진입 */}
        <div style={cardStyle}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
          >
            <span style={sectionTitle}>1차 진입</span>
            <span style={{ ...badge, background: "#E6F1FB", color: "#0C447C" }}>
              {ratio1}%
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>진입 가격 (USDT)</label>
            <input
              type="number"
              value={price1}
              onChange={(e) => setPrice1(Number(e.target.value))}
              style={inputStyle}
            />
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 6 }}>
              {price1 > 0 ? `$${fmt(price1)}` : "—"}
            </div>
          </div>

          <div>
            <label style={labelStyle}>비중</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="range"
                min={1}
                max={99}
                value={ratio1}
                onChange={(e) => setRatio1(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  minWidth: 40,
                  fontWeight: 500,
                  fontSize: 15,
                  color: "#111",
                  textAlign: "right",
                }}
              >
                {ratio1}%
              </span>
            </div>
            <div style={{ ...ratioBar, marginTop: 10 }}>
              <div
                style={{
                  width: `${ratio1}%`,
                  background: "#378ADD",
                  transition: "width 0.2s",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>

        {/* 2차 진입 */}
        <div style={cardStyle}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
          >
            <span style={sectionTitle}>2차 진입</span>
            <span style={{ ...badge, background: "#EEEDFE", color: "#3C3489" }}>
              {ratio2}%
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>진입 가격 (USDT)</label>
            <input
              type="number"
              value={price2}
              onChange={(e) => setPrice2(Number(e.target.value))}
              style={inputStyle}
            />
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 6 }}>
              {price2 > 0 ? `$${fmt(price2)}` : "—"}
            </div>
          </div>

          <div>
            <label style={labelStyle}>비중 (자동)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: "#f0f0ee",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${ratio2}%`,
                    height: "100%",
                    background: "#7F77DD",
                    transition: "width 0.2s",
                  }}
                />
              </div>
              <span
                style={{
                  minWidth: 40,
                  fontWeight: 500,
                  fontSize: 15,
                  color: "#111",
                  textAlign: "right",
                }}
              >
                {ratio2}%
              </span>
            </div>
            <div style={{ ...ratioBar, marginTop: 10 }}>
              <div
                style={{
                  width: `${ratio2}%`,
                  background: "#7F77DD",
                  transition: "width 0.2s",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>

        {/* 결과 카드 */}
        <div
          style={{
            ...cardStyle,
            background: accentBg,
            border: `1px solid ${accent}22`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: accent,
                }}
              />
              <span
                style={{ fontSize: 13, fontWeight: 500, color: accentText }}
              >
                {isLong ? "롱 포지션" : "숏 포지션"} 평균 단가
              </span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 13,
                  color: accentText,
                  opacity: 0.6,
                  marginBottom: 6,
                }}
              >
                평균 단가
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 500,
                  color: accentText,
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                }}
              >
                {avgPrice > 0 ? fmt(avgPrice) : "—"}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: accentText,
                  opacity: 0.5,
                  marginTop: 4,
                }}
              >
                USDT
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${accent}22`,
              paddingTop: 16,
              marginTop: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: accentText,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                >
                  1차 가격
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 500, color: accentText }}
                >
                  ${fmt(price1)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: accentText,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                >
                  2차 가격
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 500, color: accentText }}
                >
                  ${fmt(price2)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: accentText,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                >
                  1차 비중
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 500, color: accentText }}
                >
                  {ratio1}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: accentText,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                >
                  2차 비중
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 500, color: accentText }}
                >
                  {ratio2}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 비중 통합 바 */}
      <div
        style={{ background: "#f0f0ee", borderRadius: 8, padding: "14px 18px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#aaa",
            marginBottom: 8,
          }}
        >
          <span>비중 분포</span>
          <span>
            1차 {ratio1}% · 2차 {ratio2}%
          </span>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              width: `${ratio1}%`,
              background: "#378ADD",
              transition: "width 0.2s",
            }}
          />
          <div
            style={{
              width: `${ratio2}%`,
              background: "#7F77DD",
              transition: "width 0.2s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "0.5px solid #e0e0e0",
  borderRadius: 14,
  padding: "1.5rem",
};

const labelStyle = {
  fontSize: 13,
  color: "#888",
  marginBottom: 6,
  display: "block",
};

const sectionTitle = {
  fontSize: 13,
  fontWeight: 500,
  color: "#555",
  marginRight: 8,
};

const badge = {
  display: "inline-block",
  fontSize: 12,
  fontWeight: 500,
  padding: "3px 10px",
  borderRadius: 6,
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "0.5px solid #ddd",
  borderRadius: 8,
  fontSize: 15,
  boxSizing: "border-box",
  outline: "none",
};

const ratioBar = {
  height: 4,
  background: "#f0f0ee",
  borderRadius: 4,
  overflow: "hidden",
  display: "flex",
};
