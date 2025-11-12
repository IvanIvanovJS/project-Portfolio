# 🚀 Quick Start - Оптимизирани изображения

## За 30 секунди

### 1. Оптимизирайте изображенията (вече направено! ✅)

```bash
npm run optimize-images
```

**Резултат:** 71.2% по-малък размер (15.35 MB → 4.43 MB)

### 2. Използвайте OptimizedImage компонента

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

// Вместо:
<img src="/images/hero.png" alt="Hero" />

// Използвайте:
<OptimizedImage
  src="hero"
  alt="Hero"
  width={1920}
  height={1080}
  responsive
/>
```

### 3. Готово! 🎉

Изображенията автоматично се зареждат в:

1. **AVIF** (най-добра компресия) → ако браузърът поддържа
2. **WebP** (добра компресия) → ако браузърът поддържа
3. **PNG** (оптимизиран) → fallback за всички браузъри

## Примери

### Hero секция

```tsx
<OptimizedImage
  src="dubaiSunraise"
  alt="Dubai sunrise"
  fill
  priority
  style={{ objectFit: 'cover' }}
/>
```

### Галерия

```tsx
<OptimizedImage
  src="familyBrunch"
  alt="Family brunch"
  width={864}
  height={648}
  responsive
/>
```

### Avatar

```tsx
<OptimizedImage
  src="iconProfilePicture"
  alt="Profile"
  width={200}
  height={200}
  style={{ borderRadius: '50%' }}
/>
```

## Props

| Prop         | Описание                      | Пример           |
| ------------ | ----------------------------- | ---------------- |
| `src`        | Име на файла БЕЗ разширение   | `"hero-image"`   |
| `alt`        | Alt текст                     | `"Hero section"` |
| `width`      | Ширина                        | `1920`           |
| `height`     | Височина                      | `1080`           |
| `responsive` | Активира responsive sizes     | `true`           |
| `priority`   | За above-the-fold изображения | `true`           |
| `fill`       | Запълва контейнера            | `true`           |

## Топ оптимизации

- **dubaiSunraise.png**: 6.15 MB → 206 KB (96.7% по-малко!)
- **contactBackgroundV5.png**: 751 KB → 12.9 KB (98.3% по-малко!)
- **gardeningHobby.png**: 637 KB → 10.4 KB (98.4% по-малко!)

## Повече информация

- **[Пълна документация](IMAGE-OPTIMIZATION-SUMMARY.md)**
- **[Migration Guide](MIGRATION-GUIDE.md)**
- **[Компонент README](src/components/ui/optimized-image/README.md)**

---

**Готово за production!** Всички изображения са оптимизирани и готови за употреба. 🚀
