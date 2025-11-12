# OptimizedImage Component

Компонент за автоматично зареждане на изображения в най-оптималния формат (AVIF → WebP → PNG).

## Характеристики

- ✅ Автоматично зареждане на AVIF, WebP и PNG формати
- ✅ Responsive изображения с множество размери
- ✅ Пълна съвместимост с Next.js Image компонента
- ✅ TypeScript типизация
- ✅ Оптимизация за Core Web Vitals

## Основна употреба

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

export default function MyComponent() {
  return (
    <OptimizedImage
      src="hero-image"
      alt="Hero section"
      width={1920}
      height={1080}
    />
  );
}
```

## Responsive изображения

За изображения, които трябва да се адаптират към различни екрани:

```tsx
<OptimizedImage
  src="hero-image"
  alt="Hero section"
  width={1920}
  height={1080}
  responsive
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

## Fill контейнер

За изображения, които запълват родителския контейнер:

```tsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <OptimizedImage
    src="background"
    alt="Background image"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>
```

## Priority изображения

За изображения above-the-fold (видими при зареждане):

```tsx
<OptimizedImage
  src="hero-image"
  alt="Hero section"
  width={1920}
  height={1080}
  priority
/>
```

## Props

| Prop         | Type         | Default                                                        | Description                 |
| ------------ | ------------ | -------------------------------------------------------------- | --------------------------- |
| `src`        | `string`     | -                                                              | Име на файла без разширение |
| `alt`        | `string`     | -                                                              | Alt текст за достъпност     |
| `responsive` | `boolean`    | `false`                                                        | Активира responsive srcSet  |
| `sizes`      | `string`     | `"(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"` | Sizes атрибут за responsive |
| ...rest      | `ImageProps` | -                                                              | Всички Next.js Image props  |

## Примери за реални случаи

### Hero секция

```tsx
<section className={styles.hero}>
  <OptimizedImage
    src="hero-background"
    alt="Hero background"
    fill
    priority
    style={{ objectFit: 'cover', objectPosition: 'center' }}
  />
  <div className={styles.heroContent}>
    <h1>Welcome</h1>
  </div>
</section>
```

### Галерия с проекти

```tsx
<div className={styles.projectGrid}>
  {projects.map((project) => (
    <div key={project.id} className={styles.projectCard}>
      <OptimizedImage
        src={project.image}
        alt={project.title}
        width={600}
        height={400}
        responsive
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <h3>{project.title}</h3>
    </div>
  ))}
</div>
```

### Профилна снимка

```tsx
<div className={styles.avatar}>
  <OptimizedImage
    src="profile-picture"
    alt="Profile photo"
    width={200}
    height={200}
    style={{ borderRadius: '50%' }}
  />
</div>
```

### Carousel изображения

```tsx
<Carousel>
  {images.map((image, index) => (
    <OptimizedImage
      key={index}
      src={image}
      alt={`Slide ${index + 1}`}
      width={1200}
      height={800}
      responsive
    />
  ))}
</Carousel>
```

## Миграция от стандартен Image

### Преди

```tsx
import Image from 'next/image';

<Image src="/images/hero.png" alt="Hero" width={1920} height={1080} />;
```

### След

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage src="hero" alt="Hero" width={1920} height={1080} responsive />;
```

## Performance Tips

1. **Използвайте `priority`** за изображения above-the-fold
2. **Задавайте точни размери** за да избегнете layout shift
3. **Използвайте `responsive`** за големи изображения
4. **Оптимизирайте `sizes` атрибута** според вашия layout
5. **Lazy loading** е активиран по подразбиране за всички изображения без `priority`

## Browser Support

| Format | Chrome | Firefox | Safari | Edge |
| ------ | ------ | ------- | ------ | ---- |
| AVIF   | 85+    | 93+     | 16+    | 85+  |
| WebP   | 23+    | 65+     | 14+    | 18+  |
| PNG    | ✅     | ✅      | ✅     | ✅   |

Компонентът автоматично избира най-добрия формат за текущия браузър.

## Troubleshooting

### Изображението не се показва

1. Проверете дали файлът съществува в `/public/images/optimized/`
2. Уверете се, че сте стартирали `npm run optimize-images`
3. Проверете конзолата за грешки

### Лошо качество на изображението

Променете настройките в `scripts/optimizeImages.js`:

```javascript
formats: {
  avif: {
    quality: 85, // Увеличете от 80
  },
  webp: {
    quality: 90, // Увеличете от 85
  }
}
```

### Бавно зареждане

1. Използвайте `priority` за важни изображения
2. Оптимизирайте `sizes` атрибута
3. Намалете размера на оригиналните изображения
