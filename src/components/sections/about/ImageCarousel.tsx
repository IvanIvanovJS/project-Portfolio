'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real image)
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(1); // Start at 1
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragDistance = useRef(0);
  const startTime = useRef(0);
  const isTouchInteraction = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Sync isPlaying with autoPlay prop
  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  const goToNext = useCallback(() => {
    if (isDragging || isTransitioning) return;
    setIsTransitioning(true);

    setCurrentIndex((prev) => prev + 1);

    setTimeout(() => {
      setIsTransitioning(false);
      // If we're at the clone of first image, jump to real first image
      setCurrentIndex((prev) => {
        if (prev === images.length + 1) {
          // Disable transition and jump instantly
          if (wrapperRef.current) {
            wrapperRef.current.style.transition = 'none';
          }
          setTimeout(() => {
            if (wrapperRef.current) {
              wrapperRef.current.style.transition = '';
            }
          }, 50);
          return 1;
        }
        return prev;
      });
    }, 400);
  }, [images.length, isDragging, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isDragging || isTransitioning) return;
    setIsTransitioning(true);

    setCurrentIndex((prev) => prev - 1);

    setTimeout(() => {
      setIsTransitioning(false);
      // If we're at the clone of last image, jump to real last image
      setCurrentIndex((prev) => {
        if (prev === 0) {
          // Disable transition and jump instantly
          if (wrapperRef.current) {
            wrapperRef.current.style.transition = 'none';
          }
          setTimeout(() => {
            if (wrapperRef.current) {
              wrapperRef.current.style.transition = '';
            }
          }, 50);
          return images.length;
        }
        return prev;
      });
    }, 400);
  }, [images.length, isDragging, isTransitioning]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index + 1); // +1 because of clone at start
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
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

  // Drag handlers
  const handleDragStart = (clientX: number) => {
    if (isTransitioning) return;

    setIsDragging(true);
    startX.current = clientX;
    currentX.current = clientX;
    startTime.current = Date.now();

    // Disable CSS transition during drag
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;

    currentX.current = clientX;
    dragDistance.current = currentX.current - startX.current;

    // Apply inline transform during drag (like helper.js)
    if (wrapperRef.current) {
      const slideWidth = wrapperRef.current.offsetWidth;
      const baseTransform = -currentIndexRef.current * slideWidth;
      const sensitivity = 1.0; // Same as helper.js
      const dragOffset = dragDistance.current * sensitivity;
      wrapperRef.current.style.transform = `translateX(${baseTransform + dragOffset}px)`;
    }

    // Prevent vertical scrolling during horizontal drag
    if (Math.abs(dragDistance.current) > 10) {
      // This would need event object, handled in touch/mouse handlers
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const dragTime = Date.now() - startTime.current;
    const velocity = Math.abs(dragDistance.current) / dragTime;
    const threshold = 50;

    // Determine if we should change slides
    const shouldChangeSlide =
      Math.abs(dragDistance.current) > threshold || velocity > 0.5;

    if (wrapperRef.current) {
      // Re-enable CSS transition
      wrapperRef.current.style.transition =
        'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      // Clear inline transform
      wrapperRef.current.style.transform = '';
    }

    if (shouldChangeSlide) {
      setIsTransitioning(true);
      if (dragDistance.current < 0) {
        // Dragged left - go to next
        setCurrentIndex((prev) => prev + 1);

        setTimeout(() => {
          setIsTransitioning(false);
          // Check if we need to loop
          setCurrentIndex((prev) => {
            if (prev === images.length + 1) {
              if (wrapperRef.current) {
                wrapperRef.current.style.transition = 'none';
              }
              setTimeout(() => {
                if (wrapperRef.current) {
                  wrapperRef.current.style.transition = '';
                }
              }, 50);
              return 1;
            }
            return prev;
          });
        }, 400);
      } else {
        // Dragged right - go to previous
        setCurrentIndex((prev) => prev - 1);

        setTimeout(() => {
          setIsTransitioning(false);
          // Check if we need to loop
          setCurrentIndex((prev) => {
            if (prev === 0) {
              if (wrapperRef.current) {
                wrapperRef.current.style.transition = 'none';
              }
              setTimeout(() => {
                if (wrapperRef.current) {
                  wrapperRef.current.style.transition = '';
                }
              }, 50);
              return images.length;
            }
            return prev;
          });
        }, 400);
      }
    }

    // Reset drag state
    dragDistance.current = 0;
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    e.stopPropagation();
    isTouchInteraction.current = true;
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    handleDragMove(e.touches[0].clientX);

    // Prevent vertical scrolling during horizontal drag
    if (Math.abs(dragDistance.current) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleDragEnd();
    isTouchInteraction.current = false;
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTransitioning || isTouchInteraction.current) return;
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isTouchInteraction.current) return;
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    if (isTouchInteraction.current) return;
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isTouchInteraction.current) return;
    handleDragEnd();
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
        <div
          ref={wrapperRef}
          className={styles.slidesWrapper}
          data-position={currentIndex}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Clone of last image for infinite loop */}
          <div key="clone-last" className={styles.slideItem}>
            <Image
              src={images[images.length - 1].src}
              alt={images[images.length - 1].alt}
              fill
              className={styles.carouselImage}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              draggable={false}
            />
            {images[images.length - 1].caption && (
              <div className={styles.captionOverlay}>
                <p className={styles.captionText}>
                  {images[images.length - 1].caption}
                </p>
                {images[images.length - 1].subCaption && (
                  <p className={styles.subCaptionText}>
                    {images[images.length - 1].subCaption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Original images */}
          {images.map((image, index) => (
            <div key={index} className={styles.slideItem}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={styles.carouselImage}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={index === 0}
                draggable={false}
              />
              {image.caption && (
                <div className={styles.captionOverlay}>
                  <p className={styles.captionText}>{image.caption}</p>
                  {image.subCaption && (
                    <p className={styles.subCaptionText}>{image.subCaption}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Clone of first image for infinite loop */}
          <div key="clone-first" className={styles.slideItem}>
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className={styles.carouselImage}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              draggable={false}
            />
            {images[0].caption && (
              <div className={styles.captionOverlay}>
                <p className={styles.captionText}>{images[0].caption}</p>
                {images[0].subCaption && (
                  <p className={styles.subCaptionText}>
                    {images[0].subCaption}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className={styles.counter}>
          {currentIndex === 0
            ? images.length
            : currentIndex === images.length + 1
              ? 1
              : currentIndex}{' '}
          / {images.length}
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
                  index + 1 === currentIndex ||
                  (index === 0 && currentIndex === images.length + 1) ||
                  (index === images.length - 1 && currentIndex === 0)
                    ? styles.indicatorActive
                    : ''
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
