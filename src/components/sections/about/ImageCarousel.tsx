import React from 'react';
import styles from './ImageCarousel.module.css';

interface CarouselImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images: _images,
  autoPlay: _autoPlay = true,
  interval: _interval = 5000,
}) => {
  return (
    <div className={styles.carousel}>
      <div className={styles.imageContainer}>
        {/* Carousel implementation will be added later */}
        <div className={styles.placeholder}>Image Carousel Placeholder</div>
      </div>
      <div className={styles.controls}>
        {/* Navigation controls will be added later */}
      </div>
    </div>
  );
};

export default ImageCarousel;
