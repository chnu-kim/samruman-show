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

  // Audio refs
  const tickAudioRef = useRef(null);
  const impactAudioRef = useRef(null);
  const lastSecondPlayedRef = useRef(null);

  // Track whether we were still counting down on the previous tick to detect crossing 0
  const prevPositiveRef = useRef(null);
  const hasTriggeredTransitionRef = useRef(false);

  // Initialize and preload sounds; best-effort unlock on first user gesture
  useEffect(() => {
    const tick = new Audio((process.env.PUBLIC_URL || '') + '/tick.mp3');
    tick.preload = 'auto';
    tick.volume = 0.45;

    const impact = new Audio((process.env.PUBLIC_URL || '') + '/impact.mp3');
    impact.preload = 'auto';
    impact.volume = 0.8;

    tickAudioRef.current = tick;
    impactAudioRef.current = impact;

    const unlock = () => {
      const a = tickAudioRef.current;
      const b = impactAudioRef.current;
      if (a) {
        a.muted = true;
        a.play().then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        }).catch(() => {});
      }
      if (b) {
        b.muted = true;
        b.play().then(() => {
          b.pause();
          b.currentTime = 0;
          b.muted = false;
        }).catch(() => {});
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      if (tickAudioRef.current) {
        tickAudioRef.current.pause();
      }
      if (impactAudioRef.current) {
        impactAudioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date('2025-09-01T20:57:00+09:00'); // 9 PM KST

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

          // Play tick sound once per new second for the last 60s
          const sec = Math.floor((difference % (1000 * 60)) / 1000);
          if (lastSecondPlayedRef.current !== sec) {
            lastSecondPlayedRef.current = sec;
            const a = tickAudioRef.current;
            if (a) {
              try {
                a.currentTime = 0;
                // .play() may be blocked until user interaction; best-effort
                a.play().catch(() => {});
              } catch (e) {
                // ignore
              }
            }
          }
        } else if (difference <= 60 * 60 * 1000) {
          setPhase('minutes');
          lastSecondPlayedRef.current = null; // reset when leaving seconds-phase
        } else {
          setPhase('full');
          lastSecondPlayedRef.current = null;
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

      // Trigger one-time screen transition exactly at 0 (with impact sound)
      if (crossedToZero && !hasTriggeredTransitionRef.current) {
        hasTriggeredTransitionRef.current = true;
        setShowTransition(true);

        const b = impactAudioRef.current;
        if (b) {
          try {
            b.currentTime = 0;
            b.play().catch(() => {});
          } catch (e) {
            // ignore
          }
        }

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