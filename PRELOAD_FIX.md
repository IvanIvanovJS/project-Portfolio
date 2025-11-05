# Preload Warning Fix

## Проблем

Получавахте warning съобщение: "The resource was preloaded using link preload but not used within a few seconds from the window's load event."

## Причини

1. **Google Fonts** - Зареждани чрез `@import` в CSS вместо през Next.js font optimization
2. **Изображения** - Unsplash изображения се preload-ваха без правилна конфигурация
3. **Липса на lazy loading** - Всички секции се зареждаха едновременно
4. **Webpack chunks** - Неоптимизирана конфигурация за code splitting

## Решения

### 1. Next.js Font Optimization

Преместихме Google Fonts от CSS `@import` към `next/font/google`:

```typescript
// src/app/layout.tsx
import { IBM_Plex_Sans } from 'next/font/google';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});
```

### 2. Image Optimization

- Добавихме `loading="lazy"` на Image компонентите
- Премахнахме `priority` prop от carousel изображенията
- Оптимизирахме `next.config.ts` с правилни image settings

### 3. Dynamic Imports

Lazy load на секции под fold:

```typescript
// src/app/page.tsx
const AboutSection = dynamic(
  () => import('../components/sections/about/AboutSection').then(
    (mod) => mod.AboutSection
  ),
  { loading: () => <div style={{ minHeight: '100vh' }} />, ssr: true }
);
```

### 4. Webpack Optimization

Подобрена конфигурация за code splitting в `next.config.ts`:

```typescript
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    };
  }
  return config;
};
```

### 5. Middleware за Cache Control

Добавихме `middleware.ts` за правилно кеширане на статични ресурси.

## Резултат

- ✅ Премахнати preload warnings
- ✅ По-бързо първоначално зареждане
- ✅ Оптимизирано зареждане на шрифтове
- ✅ Lazy loading на изображения и секции
- ✅ По-добро code splitting

## Препоръки за бъдеще

1. Винаги използвайте `next/font` за шрифтове
2. Използвайте `loading="lazy"` за изображения под fold
3. Dynamic import за тежки компоненти
4. Проверявайте Network tab в DevTools за preload warnings
