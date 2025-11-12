# ✅ Image Migration Checklist

## Преди да започнете

- [x] Скриптът за оптимизация е създаден
- [x] Всички изображения са оптимизирани (71.2% спестяване)
- [x] OptimizedImage компонентът е готов
- [x] Документацията е налична

## Компоненти за миграция

### AboutSection.tsx

- [ ] Намерете всички `<img>` или `<Image>` тагове
- [ ] Заменете с `<OptimizedImage>`
- [ ] Добавете `responsive` prop за големи изображения
- [ ] Тествайте визуално

**Изображения в AboutSection:**

- `familyBrunch.png` → `familyBrunch`
- `gardeningHobby.png` → `gardeningHobby`
- `mainHobby-min.png` → `mainHobby-min`

### ContactSection.tsx

- [ ] Намерете background изображения
- [ ] Заменете с `<OptimizedImage fill>`
- [ ] Добавете `priority` ако е above-the-fold
- [ ] Тествайте визуално

**Изображения в ContactSection:**

- `contactBackgroundV5.png` → `contactBackgroundV5`

### ImageCarousel.tsx

- [ ] Намерете carousel изображения
- [ ] Заменете с `<OptimizedImage responsive>`
- [ ] Добавете подходящ `sizes` атрибут
- [ ] Тествайте carousel функционалността

**Изображения в Carousel:**

- `dubaiSunraise.png` → `dubaiSunraise`
- Други carousel изображения...

### ProjectCard компоненти

- [ ] Намерете project screenshots
- [ ] Заменете с `<OptimizedImage responsive>`
- [ ] Добавете `sizes="(max-width: 768px) 100vw, 50vw"`
- [ ] Тествайте grid layout

**Project изображения:**

- `Portfolio-Home.png` → `Portfolio-Home`
- `Portfolio-HomeV2.png` → `Portfolio-HomeV2`
- `Kirka-Landing.png` → `Kirka-Landing`
- `Myth-and-Legends-Banner.png` → `Myth-and-Legends-Banner`
- `xArtify-pricing.png` → `xArtify-pricing`

### Header/Navigation

- [ ] Намерете logo или profile изображения
- [ ] Заменете с `<OptimizedImage>`
- [ ] Добавете `priority` за logo
- [ ] Тествайте навигацията

**Изображения в Header:**

- `iconProfilePicture.png` → `iconProfilePicture`

### Hero Section

- [ ] Намерете hero background
- [ ] Заменете с `<OptimizedImage fill priority>`
- [ ] Добавете `style={{ objectFit: 'cover' }}`
- [ ] Тествайте на различни екрани

**Hero изображения:**

- `iphoneBackground.png` → `iphoneBackground`

## Тестване

### Desktop

- [ ] Chrome (AVIF support)
- [ ] Firefox (AVIF support)
- [ ] Safari (AVIF support)
- [ ] Edge (AVIF support)

### Mobile

- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Firefox Mobile

### Performance

- [ ] Lighthouse score преди миграция
- [ ] Lighthouse score след миграция
- [ ] Network tab - проверка на размерите
- [ ] LCP (Largest Contentful Paint)

## Validation

### Visual

- [ ] Всички изображения се показват правилно
- [ ] Няма layout shift
- [ ] Responsive размерите работят
- [ ] Hover/focus states работят

### Technical

- [ ] TypeScript грешки: `npm run type-check`
- [ ] Linting грешки: `npm run lint`
- [ ] Console грешки в браузъра
- [ ] Network requests показват правилните формати

### Accessibility

- [ ] Всички изображения имат `alt` текст
- [ ] Keyboard navigation работи
- [ ] Screen reader тестване

## Performance Metrics

### Преди миграция

- Total image size: 15.35 MB
- LCP: ~4 секунди
- Load time (3G): ~3-5 секунди

### След миграция (очаквано)

- Total image size: 4.43 MB (AVIF)
- LCP: ~1.5 секунди
- Load time (3G): ~1-2 секунди

### Измерване

```bash
# Lighthouse
npm run build
npm run start
# Отворете Chrome DevTools > Lighthouse

# Network analysis
# Chrome DevTools > Network > Disable cache > Reload
```

## Deployment

- [ ] Commit промените
- [ ] Push към repository
- [ ] Deploy на staging
- [ ] Тествайте на staging
- [ ] Deploy на production
- [ ] Мониторинг на performance

## Rollback Plan

Ако нещо не работи:

1. **Бърз rollback:**

   ```bash
   git revert HEAD
   ```

2. **Частичен rollback:**
   - Върнете само проблемните компоненти
   - Използвайте оригиналните PNG файлове

3. **Debugging:**
   - Проверете browser console
   - Проверете Network tab
   - Проверете file paths

## Полезни команди

```bash
# Оптимизация на нови изображения
npm run optimize-images

# Type checking
npm run type-check

# Linting
npm run lint

# Dev server
npm run dev

# Production build
npm run build
npm run start
```

## Документация

- [Quick Start](QUICK-START-IMAGES.md)
- [Пълна документация](IMAGE-OPTIMIZATION-SUMMARY.md)
- [Migration Guide](MIGRATION-GUIDE.md)
- [OptimizedImage README](src/components/ui/optimized-image/README.md)
- [Script README](scripts/README-OPTIMIZE-IMAGES.md)

## Notes

- Оригиналните PNG файлове остават в `/public/images`
- Оптимизираните версии са в `/public/images/optimized`
- Можете да изтриете оригиналите след успешна миграция (optional)
- Backup-вайте преди да изтривате каквото и да е

## Готово! 🎉

След като завършите всички точки от checklist-а, вашият сайт ще зарежда изображения 71.2% по-бързо!
