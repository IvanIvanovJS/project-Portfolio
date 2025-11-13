'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './SplashScreen.module.css';

type AnimationPhase = 'text-in' | 'hold' | 'fade-out' | 'complete';

export const SplashScreen: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<AnimationPhase>('text-in');
  const [showAssembling, setShowAssembling] = useState(false);
  const [showTechnicalStack, setShowTechnicalStack] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [fadingOut, setFadingOut] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Mount effect - only render on client
  useEffect(() => {
    // Reset sphere expansion state when splash screen mounts (on page refresh)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sphere-expanded', 'false');
    }
    setIsMounted(true);
  }, []);

  // Main animation timeline effect
  useEffect(() => {
    if (!isMounted) return;
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Timeline configuration
    const TIMELINE = prefersReducedMotion
      ? {
          ASSEMBLING_IN: 0,
          TECHNICAL_STACK_IN: 100,
          TYPING_START: 200,
          TYPING_DURATION: 100,
          FADE_OUT_START: 400,
          FADE_OUT_DURATION: 100,
          COMPLETE: 500,
        }
      : {
          ASSEMBLING_IN: 0,
          TECHNICAL_STACK_IN: 500,
          TYPING_START: 1000,
          TYPING_DURATION: 1500, // 1.5 seconds for typing effect
          FADE_OUT_START: 2500,
          FADE_OUT_DURATION: 500,
          COMPLETE: 3000,
        };

    const fullText = 'Compiling innovation...';

    // Start text animations sequence
    const timer1 = setTimeout(() => {
      setShowAssembling(true);
    }, TIMELINE.ASSEMBLING_IN);

    const timer2 = setTimeout(() => {
      setShowTechnicalStack(true);
    }, TIMELINE.TECHNICAL_STACK_IN);

    // Store timer references for cleanup
    const timers: NodeJS.Timeout[] = [timer1, timer2];

    // Typing effect for subtext
    if (!prefersReducedMotion) {
      const charDelay = TIMELINE.TYPING_DURATION / fullText.length;
      for (let i = 0; i <= fullText.length; i++) {
        const typingTimer = setTimeout(
          () => {
            setTypedText(fullText.slice(0, i));
          },
          TIMELINE.TYPING_START + i * charDelay
        );
        timers.push(typingTimer);
      }
    } else {
      // Show full text immediately for reduced motion
      const instantTimer = setTimeout(() => {
        setTypedText(fullText);
      }, TIMELINE.TYPING_START);
      timers.push(instantTimer);
    }

    // Start fade-out
    const timer5 = setTimeout(() => {
      setPhase('fade-out');
      setFadingOut(true);
    }, TIMELINE.FADE_OUT_START);
    timers.push(timer5);

    // Remove splash from DOM
    const timer6 = setTimeout(() => {
      setPhase('complete');
      setIsVisible(false);
    }, TIMELINE.COMPLETE);
    timers.push(timer6);

    timersRef.current = timers;

    // Cleanup function
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, [isMounted]);

  // Don't render anything on server or after splash is hidden
  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading application"
      className={`${styles.splashContainer} ${fadingOut ? styles.fadeOutSplash : ''}`}
    >
      <div aria-hidden="true" className={styles.textContainer}>
        <div
          className={`${styles.mainText} ${showAssembling ? styles.slideInLeft : ''} ${phase === 'fade-out' ? styles.fadeOutText : ''}`}
        >
          Assembling
        </div>
        <div
          className={`${styles.mainText} ${showTechnicalStack ? styles.slideInRight : ''} ${phase === 'fade-out' ? styles.fadeOutText : ''}`}
        >
          Technical Stack
        </div>
        <div
          className={`${styles.subText} ${typedText ? styles.visible : ''} ${phase === 'fade-out' ? styles.fadeOutText : ''}`}
        >
          {typedText}
          {typedText && <span className={styles.cursor}>|</span>}
        </div>
      </div>
      <span className={styles.srOnly}>
        Assembling Technical Stack. Compiling innovation. Please wait.
      </span>
    </div>
  );
};
