'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './SplashScreen.module.css';
import { preloadAssets, type PreloadedAssets } from '@/utils/assetPreloader';
import { loadThreeJsModules } from '@/utils/lazyThreeLoader';

type AnimationPhase = 'text-in' | 'hold' | 'fade-out' | 'complete';

export interface SplashScreenProps {
  onComplete?: () => void;
  onAssetsReady?: (assets: PreloadedAssets) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete = () => {},
  onAssetsReady = () => {},
} = {}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<AnimationPhase>('text-in');
  const [showAssembling, setShowAssembling] = useState(false);
  const [showTechnicalStack, setShowTechnicalStack] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [fadingOut, setFadingOut] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Mount effect - only render on client
  useEffect(() => {
    // Reset sphere expansion state when splash screen mounts (on page refresh)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sphere-expanded', 'false');
      sessionStorage.setItem('iphone-widget-interacted', 'false');
      // Add class to hide content during splash
      document.body.classList.add('splash-active');
    }
    setIsMounted(true);

    return () => {
      // Remove class when splash unmounts
      if (typeof window !== 'undefined') {
        document.body.classList.remove('splash-active');
      }
    };
  }, []);

  // Asset preloading effect - runs in parallel with animation
  useEffect(() => {
    if (!isMounted) return;

    const loadAssets = async () => {
      try {
        // Start preloading assets immediately
        const [assets, threeModules] = await Promise.all([
          preloadAssets(),
          loadThreeJsModules(),
        ]);

        // Combine assets with Three.js modules
        const completeAssets: PreloadedAssets = {
          ...assets,
          threeModules,
        };

        setAssetsReady(true);
        onAssetsReady?.(completeAssets);

        // Dispatch custom event for PageWithSplash to receive assets
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('splash-assets-ready', { detail: completeAssets })
          );
        }
      } catch (error) {
        console.error('Asset preloading failed:', error);
        // Continue anyway - graceful degradation
        // The scene will load assets synchronously as fallback
      }
    };

    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

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
          TYPING_START: 800,
          TYPING_DURATION: 1200, // 1.5 seconds for typing effect
          FADE_OUT_START: 2000,
          FADE_OUT_DURATION: 300,
          COMPLETE: 2300,
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
      // Remove splash-active class to show content
      if (typeof window !== 'undefined') {
        document.body.classList.remove('splash-active');
      }
      onComplete?.();
    }, TIMELINE.COMPLETE);
    timers.push(timer6);

    timersRef.current = timers;

    // Cleanup function
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* Optional: Visual indicator when assets are ready */}
      {assetsReady && (
        <div
          className={styles.readyIndicator}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            color: 'rgba(186, 255, 233, 0.6)',
            fontSize: '14px',
            opacity: phase === 'fade-out' ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          ✓
        </div>
      )}

      <span className={styles.srOnly}>
        Assembling Technical Stack. Compiling innovation. Please wait.
      </span>
    </div>
  );
};
