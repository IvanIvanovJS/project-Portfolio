---
inclusion: always
---

# Glassmorphism Design Standards

## Liquid Glass Effect

This project uses an enhanced glassmorphism style called "liquid glass" that creates depth through layered shadows and reflections.

### Core Properties

All glass surfaces should include these properties:

```css
.glass-element {
  /* Semi-transparent background */
  background: rgba(255, 255, 255, 0.05-0.15);

  /* Backdrop filter with saturation boost */
  backdrop-filter: blur(10px) saturate(180%);

  /* Layered box-shadows for depth */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    /* Top highlight */ inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    /* Bottom shadow */ 0 8px 32px rgba(0, 0, 0, 0.1); /* Outer glow */

  /* Subtle border */
  border: 1px solid rgba(255, 255, 255, 0.1-0.3);

  /* Rounded corners */
  border-radius: 8px-16px;
}
```

### Depth Layers

Create visual depth using multiple shadow layers:

1. **Primary Reflection** - Top inset highlight
   - Light source from above
   - `inset 0 1px 1px rgba(255, 255, 255, 0.3-0.5)`

2. **Secondary Reflection** - Bottom inset shadow
   - Subtle depth indicator
   - `inset 0 -1px 1px rgba(0, 0, 0, 0.1)`

3. **Ambient Shadow** - Outer glow
   - Elevation from background
   - `0 8px 32px rgba(0, 0, 0, 0.1)`

4. **Hover Enhancement** - Increased glow
   - Interactive feedback
   - `0 12px 48px rgba(0, 0, 0, 0.15)`

### Background Opacity Levels

Use consistent opacity values:

- **Primary surfaces** (cards, containers): `rgba(255, 255, 255, 0.05)`
- **Interactive elements** (buttons, links): `rgba(255, 255, 255, 0.15)`
- **Elevated elements** (modals, dropdowns): `rgba(255, 255, 255, 0.1)`
- **Subtle elements** (badges, tags): `rgba(255, 255, 255, 0.05)`

### Backdrop Filter

Always combine blur with saturation:

```css
backdrop-filter: blur(10px) saturate(180%);
```

- **Blur range:** 5px-15px (10px standard)
- **Saturation:** 180% for vibrant glass effect
- **Performance:** Limit blur radius, use sparingly

### Animated Gradients

For decorative background elements, use animated gradients:

```css
@keyframes moveGradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animated-background {
  background: linear-gradient(
    315deg,
    var(--bg-primary),
    var(--color-accent),
    var(--color-primary-20),
    var(--color-accent)
  );
  background-size: 200% 200%;
  animation: moveGradient 8s ease infinite;
}
```

### Interactive States

**Hover:**

```css
.glass-element:hover {
  /* Enhanced glow */
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 12px 48px rgba(0, 0, 0, 0.15);

  /* Subtle scale */
  transform: scale(1.02-1.05);

  /* Increased opacity */
  background: rgba(255, 255, 255, 0.2);
}
```

**Focus:**

```css
.glass-element:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 12px 48px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(var(--color-primary-rgb), 0.2);
}
```

**Active:**

```css
.glass-element:active {
  transform: scale(0.98);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.2),
    inset 0 -1px 1px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1);
}
```

### Border Styling

Use subtle borders with varying opacity:

- **Primary borders:** `1px solid rgba(255, 255, 255, 0.1)`
- **Interactive borders:** `1px solid rgba(255, 255, 255, 0.3)`
- **Elevated borders:** `1px solid rgba(255, 255, 255, 0.2)`

### Performance Optimization

1. **Use will-change sparingly:**

   ```css
   .glass-element:hover {
     will-change: transform, box-shadow;
   }
   ```

2. **Combine shadows in single declaration:**

   ```css
   /* Good */
   box-shadow:
     inset 0 1px 1px white,
     0 8px 32px black;

   /* Avoid */
   box-shadow: inset 0 1px 1px white;
   box-shadow: 0 8px 32px black; /* Overwrites previous */
   ```

3. **Limit backdrop-filter usage:**
   - Use on visible elements only
   - Avoid on large areas
   - Consider fallback for unsupported browsers

4. **CSS containment:**
   ```css
   .glass-element {
     contain: layout style paint;
   }
   ```

### Accessibility

1. **Ensure sufficient contrast:**
   - Text on glass: minimum 4.5:1 ratio
   - Add dark overlays if needed
   - Test with various backgrounds

2. **Respect reduced motion:**

   ```css
   @media (prefers-reduced-motion: reduce) {
     .glass-element {
       animation: none;
       transition-duration: 0.1s;
     }
   }
   ```

3. **Provide fallbacks:**
   ```css
   @supports not (backdrop-filter: blur(10px)) {
     .glass-element {
       background: rgba(255, 255, 255, 0.9);
     }
   }
   ```

### Examples

**Button:**

```css
.glass-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-button:hover {
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 12px 48px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}
```

**Card:**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}
```

**Badge:**

```css
.glass-badge {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px) saturate(180%);
  box-shadow:
    inset 0 1px 0.5px rgba(255, 255, 255, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 4px 12px;
}
```

## Implementation Checklist

When implementing glassmorphism:

- [ ] Use backdrop-filter with blur and saturation
- [ ] Apply layered box-shadows (inset + outer)
- [ ] Set semi-transparent background
- [ ] Add subtle border
- [ ] Include hover state enhancements
- [ ] Ensure accessibility (contrast, reduced motion)
- [ ] Test performance on target devices
- [ ] Provide fallback for unsupported browsers
