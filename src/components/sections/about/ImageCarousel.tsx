'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import styles from './ImageCarousel.module.css';
import type { CarouselImage } from '@/types';

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const dragStartX = useRef(0);
  const isTouchInteraction = useRef(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const goToNext = useCallback(() => {
    if (isDragging || isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [images.length, isDragging, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isDragging || isTransitioning) return;
    setIsTransitioning(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [images.length, isDragging, isTransitioning]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [isPlaying, interval, goToNext, images.length]);

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning || isDragging) return;
    e.stopPropagation();
    isTouchInteraction.current = true;
    setIsDragging(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning) return;
    e.stopPropagation();
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning) {
      setIsDragging(false);
      isTouchInteraction.current = false;
      return;
    }

    e.stopPropagation();
    const swipeThreshold = 100; // Increased from 80 to 100
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      setIsTransitioning(true);
      if (diff > 0) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      setTimeout(() => {
        setIsTransitioning(false);
        setIsDragging(false);
        isTouchInteraction.current = false;
      }, 600);
    } else {
      setIsDragging(false);
      isTouchInteraction.current = false;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, togglePlayPause]);

  // Get previous, current, and next indices for continuous carousel
  const getPrevIndex = (index: number) =>
    (index - 1 + images.length) % images.length;
  const getNextIndex = (index: number) => (index + 1) % images.length;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      zIndex: 2,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 1,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1,
    }),
  };

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (images.length === 0) {
    return (
      <div className={styles.carousel}>
        <div className={styles.placeholder}>No images available</div>
      </div>
    );
  }

  return (
    <div
      className={styles.carousel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Image carousel"
    >
      <div className={styles.imageContainer}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            onDragStart={(e) => {
              if (isTransitioning || isDragging || isTouchInteraction.current)
                return;
              setIsDragging(true);
              dragStartX.current = (e as MouseEvent).clientX || 0;
            }}
            onDragEnd={(_e, { offset, velocity }) => {
              if (
                !isDragging ||
                isTransitioning ||
                isTouchInteraction.current
              ) {
                setIsDragging(false);
                return;
              }

              const swipe = swipePower(offset.x, velocity.x);
              const dragThreshold = 15000;

              if (swipe < -dragThreshold) {
                setIsTransitioning(true);
                setDirection(1);
                setCurrentIndex((prev) => (prev + 1) % images.length);
                setTimeout(() => {
                  setIsTransitioning(false);
                  setIsDragging(false);
                }, 600);
              } else if (swipe > dragThreshold) {
                setIsTransitioning(true);
                setDirection(-1);
                setCurrentIndex(
                  (prev) => (prev - 1 + images.length) % images.length
                );
                setTimeout(() => {
                  setIsTransitioning(false);
                  setIsDragging(false);
                }, 600);
              } else {
                setIsDragging(false);
              }
            }}
            className={styles.slidesWrapper}
          >
            {/* Previous Image */}
            <div className={styles.slideItem} style={{ left: '-100%' }}>
              <Image
                src={images[getPrevIndex(currentIndex)].src}
                alt={images[getPrevIndex(currentIndex)].alt}
                fill
                className={styles.carouselImage}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Current Image */}
            <div className={styles.slideItem} style={{ left: '0%' }}>
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className={styles.carouselImage}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={currentIndex === 0}
              />
              {images[currentIndex].caption && (
                <div className={styles.captionOverlay}>
                  <p className={styles.captionText}>
                    {images[currentIndex].caption}
                  </p>
                </div>
              )}
            </div>

            {/* Next Image */}
            <div className={styles.slideItem} style={{ left: '100%' }}>
              <Image
                src={images[getNextIndex(currentIndex)].src}
                alt={images[getNextIndex(currentIndex)].alt}
                fill
                className={styles.carouselImage}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* External Controls - Below Carousel */}
      {images.length > 1 && (
        <div className={styles.externalControls}>
          <div className={styles.indicators}>
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  index === currentIndex ? styles.indicatorActive : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>

          <button
            className={styles.playPauseButton}
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
