'use client';

import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  /**
   * Base filename without extension (e.g., "hero-image")
   * The component will automatically load AVIF, WebP, and PNG versions
   */
  src: string;

  /**
   * Alt text for accessibility
   */
  alt: string;

  /**
   * Enable responsive image sizes
   * Generates srcSet with @sm, @md, @lg variants
   */
  responsive?: boolean;

  /**
   * Custom sizes attribute for responsive images
   * Default: "(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"
   */
  sizes?: string;
}

/**
 * OptimizedImage Component
 *
 * Automatically serves images in modern formats (AVIF, WebP) with PNG fallback.
 * Supports responsive images with multiple sizes.
 *
 * @example
 * // Simple usage
 * <OptimizedImage
 *   src="hero-image"
 *   alt="Hero section"
 *   width={1920}
 *   height={1080}
 * />
 *
 * @example
 * // Responsive with custom sizes
 * <OptimizedImage
 *   src="hero-image"
 *   alt="Hero section"
 *   width={1920}
 *   height={1080}
 *   responsive
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 *
 * @example
 * // Fill container
 * <OptimizedImage
 *   src="background"
 *   alt="Background"
 *   fill
 *   style={{ objectFit: 'cover' }}
 * />
 */
export const OptimizedImage = ({
  src,
  alt,
  responsive = false,
  sizes,
  ...props
}: OptimizedImageProps) => {
  // Extract base path and filename
  const basePath = '/images/optimized';
  const baseFilename = src.replace(/\.(png|jpg|jpeg|webp|avif)$/i, '');

  // Default sizes for responsive images
  const defaultSizes =
    '(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px';
  const imageSizes = sizes || defaultSizes;

  if (responsive) {
    // Generate srcSet for responsive images
    const avifSrcSet = [
      `${basePath}/${baseFilename}@sm.avif 640w`,
      `${basePath}/${baseFilename}@md.avif 768w`,
      `${basePath}/${baseFilename}@lg.avif 1200w`,
      `${basePath}/${baseFilename}.avif 1920w`,
    ].join(', ');

    const webpSrcSet = [
      `${basePath}/${baseFilename}@sm.webp 640w`,
      `${basePath}/${baseFilename}@md.webp 768w`,
      `${basePath}/${baseFilename}@lg.webp 1200w`,
      `${basePath}/${baseFilename}.webp 1920w`,
    ].join(', ');

    return (
      <picture>
        <source srcSet={avifSrcSet} sizes={imageSizes} type="image/avif" />
        <source srcSet={webpSrcSet} sizes={imageSizes} type="image/webp" />
        <Image
          src={`${basePath}/${baseFilename}.png`}
          alt={alt}
          sizes={imageSizes}
          {...props}
        />
      </picture>
    );
  }

  // Simple usage with format fallbacks
  return (
    <picture>
      <source srcSet={`${basePath}/${baseFilename}.avif`} type="image/avif" />
      <source srcSet={`${basePath}/${baseFilename}.webp`} type="image/webp" />
      <Image src={`${basePath}/${baseFilename}.png`} alt={alt} {...props} />
    </picture>
  );
};
