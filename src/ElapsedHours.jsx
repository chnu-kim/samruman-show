import React from 'react';

export default function ElapsedHours({ timeElapsed, onToggle }) {
  const { days = 0, hours = 0 } = timeElapsed || {};
  const totalHours = days * 24 + hours;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle && onToggle();
    }
  };

  return (
    <div
      className="countdown-timer-container"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer' }}
      aria-label={`${totalHours}시간 경과 보기에서 카운트다운으로 전환`}
    >
      <div className="countdown-timer">
        <span className="countdown-seconds">{totalHours}</span>시간 기록
      </div>
    </div>
  );
}
