---
inclusion: always
---

# CSS Vendor Prefixes Order

## Critical Rule: backdrop-filter Property Order

**ALWAYS place `-webkit-backdrop-filter` BEFORE `backdrop-filter`**

### ✅ Correct Order

```css
.element {
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  backdrop-filter: blur(10px) saturate(180%);
}
```

### ❌ Wrong Order

```css
.element {
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
}
```

## Why This Matters

When using CSS Modules with webpack/PostCSS, the order of vendor-prefixed properties is critical:

1. **Webpack CSS processing** may remove or ignore properties that appear in the "wrong" order
2. **The standard property must come last** to override the vendor-prefixed version in browsers that support both
3. **Autoprefixer expects this order** and may not work correctly if properties are reversed

## General Vendor Prefix Rules

Always follow this order for ALL vendor-prefixed properties:

1. `-webkit-` prefix first
2. `-moz-` prefix (if needed)
3. `-ms-` prefix (if needed)
4. `-o-` prefix (if needed)
5. **Standard property last**

### Example with Multiple Prefixes

```css
.element {
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  transform: scale(1.1);
}
```

## Common Properties That Need Prefixes

- `backdrop-filter` / `-webkit-backdrop-filter`
- `transform` / `-webkit-transform`
- `transition` / `-webkit-transition`
- `animation` / `-webkit-animation`
- `appearance` / `-webkit-appearance`
- `user-select` / `-webkit-user-select`

## Autoprefixer Configuration

This project uses `autoprefixer` in PostCSS to automatically add vendor prefixes. However, when writing CSS manually, always follow the correct order to ensure compatibility.

## Troubleshooting

If a CSS property is not working in the browser:

1. Check the browser DevTools to see which properties are actually loaded
2. Verify the order: `-webkit-` prefix should come BEFORE the standard property
3. Ensure both properties have identical values
4. Check that autoprefixer is running correctly in the build process

## Related Files

- `postcss.config.mjs` - PostCSS configuration with autoprefixer
- All `*.module.css` files - Use this order consistently
