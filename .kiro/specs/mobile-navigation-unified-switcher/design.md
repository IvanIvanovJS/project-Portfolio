# Design Document

## Overview

Този дизайн описва промените в мобилната навигация за интегриране на UnifiedSwitcher компонента. Целта е да се опрости интерфейсът когато менюто е затворено (само заглавие + бургер бутон) и да се консолидират всички контроли в един UnifiedSwitcher компонент в отвореното меню.

## Architecture

### Component Hierarchy

```
MobileHeader (затворено меню)
├── Logo ("Portfolio")
└── Burger Button

MobileNavigation (отворено меню)
├── Navigation Header
│   ├── Logo ("Portfolio")
│   └── Close Button (X)
├── Navigation Content
│   └── Navigation Items
└── Navigation Footer
    └── UnifiedSwitcher (Light/Dark/Navigation Toggle)
```

### State Management

- **Theme State**: Управлява се от ThemeProvider context
- **Navigation Mode State**: Управлява се от NavigationProvider context
- **Menu Open/Close State**: Управлява се от parent component (page.tsx)

## Components and Interfaces

### MobileHeader Component

**Промени:**

- Премахване на `<UnifiedSwitcher />` от controls секцията
- Запазване само на logo и burger button
- Опростяване на layout структурата

**Преди:**

```tsx
<div className={styles.controls}>
  <UnifiedSwitcher />
  <button className={styles.mobileMenuButton}>
    <Menu size={20} />
  </button>
</div>
```

**След:**

```tsx
<button
  className={styles.mobileMenuButton}
  onClick={onMobileMenuToggle}
  aria-label="Toggle mobile menu"
>
  <Menu size={20} />
</button>
```

### MobileNavigation Component

**Промени:**

- Премахване на импортите за `NavigationToggle` и `ThemeToggle`
- Добавяне на импорт за `UnifiedSwitcher`
- Замяна на двата отделни компонента с един `UnifiedSwitcher` в footer

**Преди:**

```tsx
<div className={styles.navFooter}>
  <NavigationToggle />
  <ThemeToggle />
</div>
```

**След:**

```tsx
<div className={styles.navFooter}>
  <UnifiedSwitcher />
</div>
```

### UnifiedSwitcher Component

**Без промени** - компонентът вече работи коректно и ще бъде използван както е в мобилната навигация.

## Data Models

Няма промени в data models. Използваме съществуващите:

- `ThemeContextType` от ThemeProvider
- `NavigationContextType` от NavigationProvider
- `NavigationItem` interface за navigation items

## Styling Considerations

### MobileHeader Styles

CSS промени в `MobileHeader.module.css`:

- Опростяване на `.controls` класа (ако е необходимо)
- Осигуряване на правилно позициониране на burger button без UnifiedSwitcher

### MobileNavigation Styles

CSS промени в `MobileNavigation.module.css`:

- `.navFooter` трябва да центрира UnifiedSwitcher компонента
- Осигуряване на достатъчно padding и spacing
- Запазване на glassmorphism ефектите

**Препоръчителен стил за navFooter:**

```css
.navFooter {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

## User Experience Flow

### Затворено меню

1. Потребителят вижда само заглавието и бургер бутона
2. Чист, минималистичен интерфейс
3. Фокусът е върху съдържанието

### Отваряне на меню

1. Потребителят кликва на burger button
2. Появява се overlay и slide-in навигация
3. Показват се navigation items и UnifiedSwitcher в footer

### Използване на контролите

1. Потребителят може да превключва между Light/Dark теми
2. Потребителят може да превключва navigation mode (horizontal/vertical)
3. Визуалният feedback е моментален
4. Sliding indicator показва активната тема

### Затваряне на меню

1. Потребителят кликва на X бутона, overlay, или navigation item
2. Менюто се затваря с плавна анимация
3. Връщаме се към минималистичния изглед

## Error Handling

Няма специфични error cases за тази промяна, тъй като:

- UnifiedSwitcher вече е тестван и работи коректно
- Context providers са налични и стабилни
- Премахваме код, не добавяме нова логика

## Testing Strategy

### Manual Testing Checklist

1. **MobileHeader (затворено меню)**
   - [ ] Показва се само logo и burger button
   - [ ] Няма UnifiedSwitcher компонент
   - [ ] Burger button работи коректно

2. **MobileNavigation (отворено меню)**
   - [ ] UnifiedSwitcher се показва в footer
   - [ ] Light theme бутонът работи
   - [ ] Dark theme бутонът работи
   - [ ] Navigation toggle бутонът работи
   - [ ] Визуалният indicator се движи правилно
   - [ ] Иконите се сменят правилно

3. **Responsive Behavior**
   - [ ] Работи на различни мобилни размери
   - [ ] Touch interactions работят плавно
   - [ ] Анимациите са плавни

4. **Accessibility**
   - [ ] Keyboard navigation работи
   - [ ] Screen reader labels са правилни
   - [ ] Focus states са видими

### Browser Testing

- Chrome Mobile
- Safari iOS
- Firefox Mobile
- Samsung Internet

## Implementation Notes

### Import Changes

**MobileHeader.tsx:**

```tsx
// ПРЕМАХНИ:
import { UnifiedSwitcher } from '../../ui/unified-switcher/UnifiedSwitcher';
```

**MobileNavigation.tsx:**

```tsx
// ПРЕМАХНИ:
import { ThemeToggle } from '../../ui/theme-toggle/ThemeToggle';
import { NavigationToggle } from '../../ui/navigation-toggle/NavigationToggle';

// ДОБАВИ:
import { UnifiedSwitcher } from '../../ui/unified-switcher/UnifiedSwitcher';
```

### CSS Updates

Може да е необходимо да се актуализира spacing и alignment в:

- `MobileHeader.module.css` - за burger button без UnifiedSwitcher
- `MobileNavigation.module.css` - за центриране на UnifiedSwitcher в footer

## Migration Path

1. Актуализиране на MobileHeader - премахване на UnifiedSwitcher
2. Актуализиране на MobileNavigation - добавяне на UnifiedSwitcher, премахване на старите компоненти
3. CSS adjustments ако е необходимо
4. Тестване на всички функционалности
5. Проверка на различни устройства и браузъри

## Future Considerations

- Възможност за персонализиране на позицията на UnifiedSwitcher
- Добавяне на повече опции в switcher (напр. language toggle)
- Анимации при превключване между режими
