import React from 'react';

type TimerBarProps = {
  duration: number;
  timeLeft: number;
};

const TimerBar: React.FC<TimerBarProps> = ({ duration, timeLeft }) => {
  const progressPercent = (timeLeft / duration) * 100;

  let barColor = 'bg-green-500';
  if (progressPercent <= 50 && progressPercent > 25) {
    barColor = 'bg-yellow-400';
  } else if (progressPercent <= 25) {
    barColor = 'bg-red-600';
  }

  const blinkingClass = progressPercent <= 10 ? 'animate-blink' : '';

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.5s infinite;
        }
      `}</style>
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="flex justify-between mb-1 font-semibold text-gray-700">
          <span>Temps restant</span>
          <span className={`font-bold ${progressPercent <= 25 ? 'text-red-600' : ''}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className={`${barColor} h-6 transition-all duration-1000 ease-linear ${blinkingClass}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default TimerBar;