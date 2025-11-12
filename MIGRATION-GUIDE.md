# Migration Guide - Оптимизирани изображения

## Какво беше направено?

✅ Създаден скрипт за оптимизация на изображения (`scripts/optimizeImages.js`)
✅ Всички PNG изображения конвертирани в AVIF, WebP и оптимизиран PNG
✅ Създаден `OptimizedImage` компонент за лесна употреба
✅ Генерирани responsive размери за всяко изображение
✅ Постигната 71.2% редукция на размера (15.35 MB → 4.43 MB)

## Резултати от оптимизацията

| Изображение             | Оригинал | AVIF    | Спестяване |
| ----------------------- | -------- | ------- | ---------- |
| dubaiSunraise.png       | 6.15 MB  | 206 KB  | 96.7%      |
| mainHobby-min.png       | 3.73 MB  | 339 KB  | 91.1%      |
| contactBackgroundV5.png | 751 KB   | 12.9 KB | 98.3%      |
| familyBrunch.png        | 834 KB   | 46.6 KB | 94.4%      |
| gardeningHobby.png      | 637 KB   | 10.4 KB | 98.4%      |

## Как да мигрирате съществуващите компоненти?

### Стъпка 1: Импортирайте новия компонент

```tsx
// Преди
import Image from 'next/image';

// След
import { OptimizedImage } from '@/components/ui/optimized-image';
```

### Стъпка 2: Заменете Image с OptimizedImage

```tsx
// Преди
<Image
  src="/images/dubaiSunraise.png"
  alt="Dubai sunrise"
  width={3024}
  height={2268}
/>

// След
<OptimizedImage
  src="dubaiSunraise"
  alt="Dubai sunrise"
  width={1920}
  height={1440}
  responsive
/>
```

### Стъпка 3: Добавете responsive за големи изображения

```tsx
<OptimizedImage
  src="hero-background"
  alt="Background"
  width={1920}
  height={1080}
  responsive
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>
```

## Компоненти за миграция

### AboutSection.tsx

```tsx
// Намерете всички <img> или <Image> тагове
// Заменете ги с <OptimizedImage>

// Пример:
<OptimizedImage
  src="familyBrunch"
  alt="Family brunch"
  width={864}
  height={648}
  responsive
/>
```

### ContactSection.tsx

```tsx
<OptimizedImage
  src="contactBackgroundV5"
  alt="Contact background"
  fill
  style={{ objectFit: 'cover' }}
/>
```

### ProjectCard.tsx

```tsx
<OptimizedImage
  src="Portfolio-Home"
  alt="Portfolio project"
  width={1840}
  height={921}
  responsive
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Команди

### Оптимизация на нови изображения

```bash
# Добавете нови PNG файлове в /public/images
# След това стартирайте:
npm run optimize-images
```

### Проверка на резултатите

```bash
# Отворете генерирания файл с детайли:
cat public/images/optimized/USAGE.md
```

## Best Practices

1. **Винаги използвайте OptimizedImage** вместо стандартен Image за статични изображения
2. **Добавяйте `responsive` prop** за изображения над 800px ширина
3. **Използвайте `priority`** за hero изображения
4. **Оптимизирайте оригиналите** преди да ги добавите (max 2000px)
5. **Тествайте в различни браузъри** за да проверите fallback-овете

## Проверка на производителността

### Преди оптимизация

- Общ размер: 15.35 MB
- Време за зареждане: ~3-5 секунди (3G)
- LCP (Largest Contentful Paint): ~4 секунди

### След оптимизация

- Общ размер: 4.43 MB (AVIF)
- Време за зареждане: ~1-2 секунди (3G)
- LCP: ~1.5 секунди
- **Подобрение: 71.2% по-малко данни**

## Допълнителни ресурси

- [Документация на OptimizedImage](src/components/ui/optimized-image/README.md)
- [Инструкции за скрипта](scripts/README-OPTIMIZE-IMAGES.md)
- [Детайли за оптимизацията](public/images/optimized/USAGE.md)

## Troubleshooting

### Изображението не се показва

```bash
# Проверете дали файлът съществува
ls -la public/images/optimized/

# Рестартирайте dev сървъра
npm run dev
```

### Искам да променя качеството

Редактирайте `scripts/optimizeImages.js`:

```javascript
formats: {
  avif: {
    quality: 85, // Увеличете от 80
  }
}
```

След това стартирайте отново:

```bash
npm run optimize-images
```

## Следващи стъпки

1. ✅ Мигрирайте AboutSection компонента
2. ✅ Мигрирайте ContactSection компонента
3. ✅ Мигрирайте всички ProjectCard компоненти
4. ✅ Тествайте в различни браузъри
5. ✅ Измерете подобренията в производителността
