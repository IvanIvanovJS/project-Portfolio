'use client';
import React, { useEffect, useRef } from 'react';
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
  const prevIndexRef = useRef<number>(0);

  const currentIndex = options.findIndex((opt) => opt.value === value);

  useEffect(() => {
    if (
      switcherRef.current &&
      currentIndex !== -1 &&
      currentIndex !== prevIndexRef.current
    ) {
      switcherRef.current.setAttribute(
        'c-previous',
        String(prevIndexRef.current + 1)
      );
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex]);

  const handleChange = (optionValue: string) => {
    onChange(optionValue);
  };

  return (
    <fieldset
      ref={switcherRef}
      className={`${styles.switcher} ${className}`}
      c-previous="1"
    >
      <legend className={styles.switcherLegend}>{legend}</legend>

      <svg className={styles.switcherFilter}>
        <defs>
          <filter id="switcher">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
          </filter>
        </defs>
      </svg>

      {options.map((option, index) => (
        <label
          key={option.value}
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
            c-option={String(index + 1)}
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
