export default function Logo() {
  return (
    <div className="w-6 h-6">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="#4A90E2"
          stroke="#2E5BBA"
          strokeWidth="4"
        />

        {/* Piggy bank body */}
        <ellipse
          cx="100"
          cy="110"
          rx="45"
          ry="35"
          fill="#FFB6C1"
          stroke="#FF69B4"
          strokeWidth="2"
        />

        {/* Piggy bank snout */}
        <ellipse
          cx="130"
          cy="105"
          rx="12"
          ry="8"
          fill="#FFB6C1"
          stroke="#FF69B4"
          strokeWidth="2"
        />

        {/* Nostrils */}
        <circle cx="127" cy="103" r="2" fill="#FF69B4" />
        <circle cx="133" cy="107" r="2" fill="#FF69B4" />

        {/* Eyes */}
        <circle
          cx="85"
          cy="95"
          r="8"
          fill="white"
          stroke="#333"
          strokeWidth="1"
        />
        <circle cx="85" cy="95" r="4" fill="#333" />
        <circle cx="87" cy="93" r="1.5" fill="white" />

        <circle
          cx="110"
          cy="95"
          r="8"
          fill="white"
          stroke="#333"
          strokeWidth="1"
        />
        <circle cx="110" cy="95" r="4" fill="#333" />
        <circle cx="112" cy="93" r="1.5" fill="white" />

        {/* Smile */}
        <path
          d="M 80 115 Q 100 125 120 115"
          stroke="#FF69B4"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Coin slot */}
        <rect x="95" y="75" width="10" height="3" fill="#FF69B4" rx="1" />

        {/* Coin above slot */}
        <circle
          cx="100"
          cy="60"
          r="8"
          fill="#FFD700"
          stroke="#FFA500"
          strokeWidth="2"
        />
        <text
          x="100"
          y="65"
          fontFamily="Arial, sans-serif"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          fill="#FF8C00"
        >
          $
        </text>

        {/* Legs */}
        <ellipse
          cx="75"
          cy="140"
          rx="6"
          ry="10"
          fill="#FFB6C1"
          stroke="#FF69B4"
          strokeWidth="2"
        />
        <ellipse
          cx="95"
          cy="142"
          rx="6"
          ry="10"
          fill="#FFB6C1"
          stroke="#FF69B4"
          strokeWidth="2"
        />
        <ellipse
          cx="105"
          cy="142"
          rx="6"
          ry="10"
          fill="#FFB6C1"
          stroke="#FF69B4"
          strokeWidth="2"
        />
        <ellipse
          cx="125"
          cy="140"
          rx="6"
          ry="10"
          fill="#FFB6C1"
          stroke="#FF69B4"
          strokeWidth="2"
        />

        {/* Tail */}
        <path
          d="M 55 115 Q 45 110 50 100 Q 55 105 60 110"
          stroke="#FF69B4"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
