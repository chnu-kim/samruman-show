import React, {useEffect, useState} from 'react';
import './Countdown.css';
import TimerContainer from './TimerContainer';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2025-09-01T21:00:00+09:00'); // 9 PM KST

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({days, hours, minutes, seconds});
        setHasStarted(false);
      } else {
        const elapsedMs = now.getTime() - targetDate.getTime();
        const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);

        setTimeElapsed({days, hours, minutes, seconds});
        setHasStarted(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const isStarted = hasStarted;

  return (
    <div className="countdown-container">
      <img
        src={'img/ghost.png'}
        alt=""
        className="horror-bg-ghost"
      />
      <img
        src={'img/joker.png'}
        alt=""
        className="horror-bg-joker"
      />
      <img
        src={'img/impressed.png'}
        alt=""
        className="horror-bg-impressed"
      />
      <img
        src={'img/something.png'}
        alt=""
        className="horror-bg-something"
      />

      <div className="countdown-content">
        <h1 className="countdown-title">
          <span className="title-highlight">삼루먼쇼</span>{isStarted ? '로부터' : '까지'}
        </h1>

        <TimerContainer time={isStarted ? timeElapsed : timeLeft} />
      </div>
    </div>
  );
}