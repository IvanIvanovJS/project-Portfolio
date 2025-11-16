'use client';

import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

export const SplashScreen: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showAssembling, setShowAssembling] = useState(false);
  const [showTechnicalStack, setShowTechnicalStack] = useState(false);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setIsMounted(true);

    // Reset session storage
    sessionStorage.setItem('sphere-expanded', 'false');
    sessionStorage.setItem('iphone-widget-interacted', 'false');

    const splash = document.getElementById('splash-overlay');
    if (!splash) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const TIMELINE = prefersReducedMotion
      ? {
          ASSEMBLING_IN: 0,
          TECHNICAL_STACK_IN: 100,
          TYPING_START: 200,
          TYPING_DURATION: 100,
          FADE_OUT_START: 400,
          FADE_OUT_DURATION: 700,
        }
      : {
          ASSEMBLING_IN: 0,
          TECHNICAL_STACK_IN: 500,
          TYPING_START: 500,
          TYPING_DURATION: 1200,
          FADE_OUT_START: 1700,
          FADE_OUT_DURATION: 700,
        };

    const fullText = 'Compiling innovation...';
    const timers: NodeJS.Timeout[] = [];

    // Text animations
    timers.push(
      setTimeout(() => setShowAssembling(true), TIMELINE.ASSEMBLING_IN)
    );
    timers.push(
      setTimeout(() => setShowTechnicalStack(true), TIMELINE.TECHNICAL_STACK_IN)
    );

    // Typing effect
    if (!prefersReducedMotion) {
      const charDelay = TIMELINE.TYPING_DURATION / fullText.length;
      for (let i = 0; i <= fullText.length; i++) {
        timers.push(
          setTimeout(
            () => setTypedText(fullText.slice(0, i)),
            TIMELINE.TYPING_START + i * charDelay
          )
        );
      }
    } else {
      timers.push(
        setTimeout(() => setTypedText(fullText), TIMELINE.TYPING_START)
      );
    }

    // Fade out splash
    timers.push(
      setTimeout(() => {
        splash.style.opacity = '0';
      }, TIMELINE.FADE_OUT_START)
    );

    // Remove from DOM
    timers.push(
      setTimeout(() => {
        splash.style.display = 'none';
      }, TIMELINE.FADE_OUT_START + TIMELINE.FADE_OUT_DURATION)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <div
      id="splash-overlay"
      role="status"
      aria-live="polite"
      aria-label="Loading application"
      className={styles.splashOverlay}
      suppressHydrationWarning
    >
      <div aria-hidden="true" className={styles.textContainer}>
        <div
          className={`${styles.mainText} ${isMounted && showAssembling ? styles.slideInLeft : ''}`}
        >
          Assembling
        </div>
        <div
          className={`${styles.mainText} ${isMounted && showTechnicalStack ? styles.slideInRight : ''}`}
        >
          Technical Stack
        </div>
        <div
          className={`${styles.subText} ${isMounted && typedText ? styles.visible : ''}`}
        >
          {isMounted ? typedText : ''}
          {isMounted && typedText && <span className={styles.cursor}>|</span>}
        </div>
      </div>
      <span className={styles.srOnly}>
        Assembling Technical Stack. Compiling innovation. Please wait.
      </span>
    </div>
  );
};
