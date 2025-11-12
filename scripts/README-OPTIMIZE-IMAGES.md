# Image Optimization Guide

## Какво прави скриптът?

Скриптът автоматично конвертира всички PNG изображения от `/public/images` в три оптимизирани формата:

1. **AVIF** - Най-модерен формат с най-добра компресия (80% quality)
2. **WebP** - Широко поддържан с отлична компресия (85% quality)
3. **PNG** - Оптимизиран оригинал като fallback (90% quality)

## Генерирани размери

За всяко изображение се създават 5 размера за responsive дизайн:

- **Full size** (1920px) - `image.format`
- **Retina** (3840px) - `image@2x.format`
- **Large** (1200px) - `image@lg.format`
- **Medium** (768px) - `image@md.format`
- **Small** (640px) - `image@sm.format`

## Как да използвам скрипта?

### 1. Стартиране на оптимизацията

```bash
npm run optimize-images
```

Скриптът ще:

- Обработи всички PNG файлове от `/public/images`
- Създаде оптимизирани версии в `/public/images/optimized`
- Генерира `USAGE.md` файл с детайли за всяко изображение

### 2. Използване на OptimizedImage компонента

#### Проста употреба

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage
  src="hero-image"
  alt="Hero section"
  width={1920}
  height={1080}
/>;
```

Автоматично ще зареди:

1. AVIF версия (ако браузърът поддържа)
2. WebP версия (ако браузърът поддържа)
3. PNG версия (fallback)

#### Responsive изображения

```tsx
<OptimizedImage
  src="hero-image"
  alt="Hero section"
  width={1920}
  height={1080}
  responsive
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

Автоматично генерира `srcSet` с всички размери за оптимална производителност.

#### Fill контейнер

```tsx
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <OptimizedImage
    src="background"
    alt="Background"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>
```

### 3. Ръчна употреба с Next.js Image

Ако предпочитате да не използвате компонента:

```tsx
import Image from 'next/image';

<picture>
  <source srcSet="/images/optimized/hero-image.avif" type="image/avif" />
  <source srcSet="/images/optimized/hero-image.webp" type="image/webp" />
  <Image
    src="/images/optimized/hero-image.png"
    alt="Hero section"
    width={1920}
    height={1080}
  />
</picture>;
```

## Конфигурация

Можете да промените настройките в `scripts/optimizeImages.js`:

```javascript
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/images/optimized'),
  formats: {
    avif: {
      quality: 80, // 0-100
      effort: 4, // 0-9 (по-високо = по-добра компресия)
    },
    webp: {
      quality: 85,
      effort: 4,
    },
    png: {
      quality: 90,
      compressionLevel: 9,
    },
  },
  sizes: [
    { suffix: '', width: 1920 },
    { suffix: '@2x', width: 3840 },
    { suffix: '@lg', width: 1200 },
    { suffix: '@md', width: 768 },
    { suffix: '@sm', width: 640 },
  ],
};
```

## Очаквани резултати

- **AVIF**: 60-80% по-малък размер от оригинала
- **WebP**: 50-70% по-малък размер от оригинала
- **PNG**: 10-30% по-малък размер от оригинала

## Поддръжка на браузъри

| Формат | Chrome | Firefox | Safari | Edge |
| ------ | ------ | ------- | ------ | ---- |
| AVIF   | 85+    | 93+     | 16+    | 85+  |
| WebP   | 23+    | 65+     | 14+    | 18+  |
| PNG    | ✅     | ✅      | ✅     | ✅   |

## Troubleshooting

### Скриптът не намира изображения

Уверете се, че PNG файловете са в `/public/images` директорията.

### Грешка при инсталация на sharp

```bash
npm install sharp --save-dev
```

### Изображенията не се показват

Проверете пътищата в браузъра:

- `/images/optimized/filename.avif`
- `/images/optimized/filename.webp`
- `/images/optimized/filename.png`

## Best Practices

1. **Винаги използвайте `alt` текст** за достъпност
2. **Задавайте `width` и `height`** за да избегнете layout shift
3. **Използвайте `priority={true}`** за изображения above-the-fold
4. **Оптимизирайте оригиналите** преди да ги добавите (max 2000px)
5. **Използвайте `responsive` prop** за големи изображения
6. **Тествайте в различни браузъри** за да проверите fallback-овете

## Пример за миграция

### Преди

```tsx
<img src="/images/hero.png" alt="Hero" />
```

### След

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage src="hero" alt="Hero" width={1920} height={1080} responsive />;
```

## Допълнителни ресурси

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [AVIF vs WebP Comparison](https://jakearchibald.com/2020/avif-has-landed/)
