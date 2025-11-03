'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './GlassSwitcher.module.css';

export interface SwitcherOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

interface GlassSwitcherProps {
  options: SwitcherOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  legend?: string;
}

export const GlassSwitcher: React.FC<GlassSwitcherProps> = ({
  options,
  value,
  onChange,
  className = '',
  legend = 'Switch options',
}) => {
  const switcherRef = useRef<HTMLFieldSetElement>(null);
  const optionRefs = useRef<(HTMLLabelElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const currentIndex = options.findIndex((opt) => opt.value === value);

  // Update indicator position based on active option
  useEffect(() => {
    const updateIndicator = () => {
      if (
        switcherRef.current &&
        currentIndex !== -1 &&
        optionRefs.current[currentIndex]
      ) {
        const switcherWidth = switcherRef.current.offsetWidth;
        const padding = 6; // padding from CSS
        const availableWidth = switcherWidth - padding * 2;
        const optionCount = options.length;
        const optionWidth = availableWidth / optionCount;

        // Calculate position for space-evenly distribution
        const leftPosition = padding + currentIndex * optionWidth;

        setIndicatorStyle({
          left: leftPosition,
          width: optionWidth,
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateIndicator, 0);

    // Update on window resize
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [currentIndex, options.length]);

  const handleChange = (optionValue: string) => {
    onChange(optionValue);
  };

  return (
    <fieldset ref={switcherRef} className={`${styles.switcher} ${className}`}>
      <legend className={styles.switcherLegend}>{legend}</legend>

      {/* Sliding indicator */}
      <div
        className={styles.indicator}
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {options.map((option, index) => (
        <label
          key={option.value}
          ref={(el) => {
            optionRefs.current[index] = el;
          }}
          className={styles.switcherOption}
          htmlFor={`switcher-${option.value}`}
        >
          <input
            type="radio"
            id={`switcher-${option.value}`}
            name="switcher"
            value={option.value}
            checked={value === option.value}
            onChange={() => handleChange(option.value)}
            className={styles.switcherInput}
            aria-label={option.ariaLabel || option.label}
          />
          {option.icon ? (
            <span className={styles.switcherIcon}>{option.icon}</span>
          ) : (
            <span className={styles.switcherText}>{option.label}</span>
          )}
        </label>
      ))}
    </fieldset>
  );
};

export default GlassSwitcher;
