import React from 'react';
import './CountdownIntense.css';

export default function TimerContainer({ time, phase }) {
  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = time || {};

  // Minutes phase: show MM:SS prominently
  if (phase === 'minutes') {
    const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
    return (
      <div className="countdown-timer-container">
        <div className="countdown-timer countdown-timer--minutes">
          {totalMinutes.toString().padStart(2, '0')}:
          <span className="countdown-seconds">{seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  // Seconds phase: show SS only for maximum tension
  if (phase === 'seconds') {
    const totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
    return (
      <div className="countdown-timer-container">
        <div className="countdown-timer countdown-timer--seconds">
          <span className="countdown-seconds-only">
            {totalSeconds.toString().padStart(1, '0')}
          </span>
        </div>
      </div>
    );
  }

  // Default (full or elapsed): show DD:HH:MM:SS
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
