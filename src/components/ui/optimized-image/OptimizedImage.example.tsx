/**
 * OptimizedImage Component - Usage Examples
 *
 * Този файл съдържа примери за употреба на OptimizedImage компонента.
 * Не е предназначен за production използване.
 */

import { OptimizedImage } from './OptimizedImage';
import styles from './OptimizedImage.example.module.css';

export function OptimizedImageExamples() {
  return (
    <div className={styles.examples}>
      <h1>OptimizedImage Examples</h1>

      {/* Example 1: Simple usage */}
      <section className={styles.section}>
        <h2>1. Проста употреба</h2>
        <OptimizedImage
          src="iconProfilePicture"
          alt="Profile picture"
          width={651}
          height={521}
        />
      </section>

      {/* Example 2: Responsive image */}
      <section className={styles.section}>
        <h2>2. Responsive изображение</h2>
        <OptimizedImage
          src="dubaiSunraise"
          alt="Dubai sunrise"
          width={1920}
          height={1440}
          responsive
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </section>

      {/* Example 3: Fill container */}
      <section className={styles.section}>
        <h2>3. Fill контейнер</h2>
        <div className={styles.imageContainer}>
          <OptimizedImage
            src="contactBackgroundV5"
            alt="Contact background"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Example 4: Priority image (above-the-fold) */}
      <section className={styles.section}>
        <h2>4. Priority изображение</h2>
        <OptimizedImage
          src="Portfolio-Home"
          alt="Portfolio home"
          width={1840}
          height={921}
          priority
          responsive
        />
      </section>

      {/* Example 5: Grid of images */}
      <section className={styles.section}>
        <h2>5. Галерия</h2>
        <div className={styles.grid}>
          <OptimizedImage
            src="familyBrunch"
            alt="Family brunch"
            width={864}
            height={648}
            responsive
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <OptimizedImage
            src="gardeningHobby"
            alt="Gardening hobby"
            width={866}
            height={650}
            responsive
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <OptimizedImage
            src="mainHobby-min"
            alt="Main hobby"
            width={1920}
            height={1440}
            responsive
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Example 6: Card with image */}
      <section className={styles.section}>
        <h2>6. Card с изображение</h2>
        <div className={styles.card}>
          <OptimizedImage
            src="Kirka-Landing"
            alt="Kirka landing page"
            width={714}
            height={536}
            responsive
          />
          <div className={styles.cardContent}>
            <h3>Project Title</h3>
            <p>Project description goes here...</p>
          </div>
        </div>
      </section>

      {/* Example 7: Hero section */}
      <section className={styles.section}>
        <h2>7. Hero секция</h2>
        <div className={styles.hero}>
          <OptimizedImage
            src="dubaiSunraise"
            alt="Hero background"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className={styles.heroContent}>
            <h1>Welcome</h1>
            <p>This is a hero section with optimized background</p>
          </div>
        </div>
      </section>

      {/* Example 8: Avatar */}
      <section className={styles.section}>
        <h2>8. Avatar</h2>
        <div className={styles.avatar}>
          <OptimizedImage
            src="iconProfilePicture"
            alt="User avatar"
            width={200}
            height={200}
            style={{ borderRadius: '50%' }}
          />
        </div>
      </section>

      {/* Example 9: Comparison - Before/After */}
      <section className={styles.section}>
        <h2>9. Сравнение - Преди/След</h2>
        <div className={styles.comparison}>
          <div>
            <h3>Преди (PNG - 6.15 MB)</h3>
            <img
              src="/images/dubaiSunraise.png"
              alt="Original PNG"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div>
            <h3>След (AVIF - 206 KB)</h3>
            <OptimizedImage
              src="dubaiSunraise"
              alt="Optimized AVIF"
              width={1920}
              height={1440}
              responsive
            />
          </div>
        </div>
      </section>
    </div>
  );
}
