import { useEffect, useState, useRef } from 'react';
import { Pointer } from 'lucide-react';
import styles from './TutorialHint.module.css';

export interface TargetPositions {
  aboutApp: { x: number; y: number };
  backButton: { x: number; y: number };
}

export interface TutorialHintProps {
  isVisible: boolean;
  targetPositions: TargetPositions;
  onAnimationComplete: () => void;
  onAnimationPhase?: (phase: 'click-about' | 'click-back') => void;
}

type AnimationPhase =
  | 'idle'
  | 'appearing'
  | 'on-about'
  | 'clicking-about'
  | 'moving-to-back'
  | 'clicking-back'
  | 'disappearing';

interface PhaseConfig {
  duration: number;
  nextPhase: AnimationPhase | null;
  animationClass?: string;
}

const PHASE_CONFIG: Record<AnimationPhase, PhaseConfig> = {
  idle: { duration: 0, nextPhase: null },
  appearing: { duration: 300, nextPhase: 'on-about' },
  'on-about': { duration: 1000, nextPhase: 'clicking-about' },
  'clicking-about': {
    duration: 500,
    nextPhase: 'moving-to-back',
    animationClass: 'clicking',
  },
  'moving-to-back': { duration: 1500, nextPhase: 'clicking-back' },
  'clicking-back': {
    duration: 1000,
    nextPhase: 'disappearing',
    animationClass: 'clicking',
  },
  disappearing: {
    duration: 1000,
    nextPhase: null,
    animationClass: 'disappearing',
  },
};

export const TutorialHint: React.FC<TutorialHintProps> = ({
  isVisible,
  targetPositions,
  onAnimationComplete,
  onAnimationPhase,
}) => {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);
  const frozenTargetsRef = useRef<TargetPositions>(targetPositions);

  // Update position dynamically when targetPositions change (e.g., on hover)
  useEffect(() => {
    if (phase !== 'idle' && isAnimatingRef.current) {
      frozenTargetsRef.current = targetPositions;

      // Update position based on current phase
      const updatePosition = () => {
        if (
          phase === 'appearing' ||
          phase === 'on-about' ||
          phase === 'clicking-about'
        ) {
          setPosition(targetPositions.aboutApp);
        } else if (
          phase === 'moving-to-back' ||
          phase === 'clicking-back' ||
          phase === 'disappearing'
        ) {
          setPosition(targetPositions.backButton);
        }
      };

      // Use microtask to avoid synchronous setState
      Promise.resolve().then(updatePosition);
    }
  }, [targetPositions, phase]);

  useEffect(() => {
    if (isVisible && !isAnimatingRef.current) {
      frozenTargetsRef.current = targetPositions;

      Promise.resolve().then(() => {
        setPosition(frozenTargetsRef.current.aboutApp);
        isAnimatingRef.current = true;
        setPhase('appearing');
      });
    }
  }, [isVisible, targetPositions]);

  useEffect(() => {
    if (!isVisible && phase !== 'idle') {
      if (timerRef.current) clearTimeout(timerRef.current);

      isAnimatingRef.current = false;
      Promise.resolve().then(() => setPhase('idle'));
      return;
    }

    if (!isVisible || phase === 'idle') return;

    const config = PHASE_CONFIG[phase];

    if (timerRef.current) clearTimeout(timerRef.current);

    if (phase === 'moving-to-back') {
      setPosition(frozenTargetsRef.current.backButton);
    }

    if (phase === 'clicking-about' && onAnimationPhase)
      onAnimationPhase('click-about');
    else if (phase === 'clicking-back' && onAnimationPhase)
      onAnimationPhase('click-back');

    if (config.nextPhase) {
      timerRef.current = setTimeout(
        () => setPhase(config.nextPhase!),
        config.duration
      );
    } else if (phase === 'disappearing') {
      timerRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        setPhase('idle');
        onAnimationComplete();
      }, config.duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, isVisible, onAnimationComplete, onAnimationPhase]);

  if (phase === 'idle') return null;

  const config = PHASE_CONFIG[phase];

  const handAnimationClass = config.animationClass
    ? styles[config.animationClass]
    : '';

  const noTransition = phase === 'appearing';

  return (
    <div
      className={`${styles.tutorialHint} ${styles.visible} ${
        noTransition ? styles.noTransition : ''
      }`}
      aria-hidden="true"
      role="presentation"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <Pointer className={`${styles.handIcon} ${handAnimationClass}`} />
    </div>
  );
};
