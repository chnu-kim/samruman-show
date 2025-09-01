import React, {useEffect, useRef, useState} from 'react';
import './Countdown.css';
import './ScreenTransition.css';
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
  const [phase, setPhase] = useState('full'); // 'full' | 'minutes' | 'seconds' | 'elapsed'
  const [showTransition, setShowTransition] = useState(false);

  // Track whether we were still counting down on the previous tick to detect crossing 0
  const prevPositiveRef = useRef(null);
  const hasTriggeredTransitionRef = useRef(false);

  useEffect(() => {
    const targetDate = new Date('2025-09-01T21:00:00+09:00'); // 9 PM KST

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      // Detect the precise moment we cross from > 0 to <= 0
      const wasPositive = prevPositiveRef.current === true;
      const crossedToZero = wasPositive && difference <= 0;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({days, hours, minutes, seconds});
        setHasStarted(false);

        // Phase handling: ramp up intensity as time approaches
        if (difference <= 60 * 1000) {
          setPhase('seconds');
        } else if (difference <= 60 * 60 * 1000) {
          setPhase('minutes');
        } else {
          setPhase('full');
        }
      } else {
        const elapsedMs = now.getTime() - targetDate.getTime();
        const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);

        setTimeElapsed({days, hours, minutes, seconds});
        setHasStarted(true);
        setPhase('elapsed');
      }

      // Trigger one-time screen transition exactly at 0
      if (crossedToZero && !hasTriggeredTransitionRef.current) {
        hasTriggeredTransitionRef.current = true;
        setShowTransition(true);
        // Hide overlay after the animation completes
        setTimeout(() => setShowTransition(false), 1600);
      }

      // Update previous sign for next tick
      prevPositiveRef.current = difference > 0;
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const isStarted = hasStarted;
  const effectivePhase = isStarted ? 'elapsed' : phase;

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

        <TimerContainer time={isStarted ? timeElapsed : timeLeft} phase={effectivePhase} />
      </div>

      {showTransition && (
        <div className="transition-overlay" aria-hidden="true">
          <div className="transition-flash" />
          <div className="transition-content">
            <h2 className="transition-title">
              <span className="title-highlight">삼루먼쇼</span> 시작
            </h2>
            <div className="transition-scanline" />
          </div>
        </div>
      )}
    </div>
  );
}