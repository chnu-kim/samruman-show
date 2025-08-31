import React from 'react';

export default function TimerContainer({ time }) {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = time || {};
  return (
    <div className="countdown-timer-container">
      <div className="countdown-timer">
        {days.toString().padStart(2, '0')}:
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        <span className="countdown-seconds">{seconds.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}
