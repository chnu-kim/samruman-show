import React, { useState, useEffect } from 'react';
import './Countdown.css';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const isFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="countdown-container">
      {/* 공포스러운 배경 이미지들 */}
      <img 
        src="https://raw.githubusercontent.com/chnu-kim/samruman-show/refs/heads/main/public/img/ghost.png"
        alt="" 
        className="horror-bg-ghost"
      />
      <img 
        src="https://raw.githubusercontent.com/chnu-kim/samruman-show/refs/heads/main/public/img/joker.png"
        alt="" 
        className="horror-bg-joker"
      />
      <img 
        src="https://raw.githubusercontent.com/chnu-kim/samruman-show/refs/heads/main/public/img/impressed.png"
        alt="" 
        className="horror-bg-impressed"
      />
      <img
        src="https://raw.githubusercontent.com/chnu-kim/samruman-show/refs/heads/main/public/img/something.png"
        alt="" 
        className="horror-bg-something"
      />

      <div className="countdown-content">
        <h1 className="countdown-title">
          <span className="title-highlight">삼루먼쇼</span>까지
        </h1>

        {isFinished ? (
          <div className="countdown-finished">
            삼루먼쇼 시작
          </div>
        ) : (
           <div className="countdown-timer-container">
             <div className="countdown-timer">
               {timeLeft.days.toString().padStart(2, '0')}:
               {timeLeft.hours.toString().padStart(2, '0')}:
               {timeLeft.minutes.toString().padStart(2, '0')}:
               <span className="countdown-seconds">{timeLeft.seconds.toString().padStart(2, '0')}</span>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}