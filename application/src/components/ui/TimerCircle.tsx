import React from 'react';

type TimerProps = {
  duration: number;
  timeLeft: number;
};

const radius = 50;
const circumference = 2 * Math.PI * radius;

const TimerCircle: React.FC<TimerProps> = ({ duration, timeLeft }) => {
  const progressPercent = timeLeft / duration;
  const strokeDashoffset = circumference * (1 - progressPercent);

  let strokeColor = '#22c55e';
  if (progressPercent <= 0.5 && progressPercent > 0.25) {
    strokeColor = '#eab308';
  } else if (progressPercent <= 0.25) {
    strokeColor = '#dc2626';
  }

  const blinking = progressPercent <= 0.1;

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .blink {
          animation: blink 1s infinite;
        }
      `}</style>

      <div className="flex flex-col items-center space-y-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* cercle de fond */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          {/* cercle de progression */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className={blinking ? 'blink' : ''}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
          {/* temps restant */}
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="32"
            fontWeight="bold"
            fill={strokeColor}
          >
            {timeLeft}s
          </text>
        </svg>
        <div className="text-gray-700 font-semibold">Temps restant</div>
      </div>
    </>
  );
};

export default TimerCircle;