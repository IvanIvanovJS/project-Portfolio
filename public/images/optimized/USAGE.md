# Optimized Images Usage Guide
Generated: 2025-11-12T13:11:36.983Z

## How to Use
Use Next.js `<Image>` component with `<picture>` for format fallbacks:

```tsximport Image from 'next/image';<picture>  <source    srcSet="/images/optimized/example.avif"    type="image/avif"  />  <source    srcSet="/images/optimized/example.webp"    type="image/webp"  />  <Image    src="/images/optimized/example.png"    alt="Description"    width={1920}    height={1080}  /></picture>```

## Responsive Images with Sizes

```tsx<picture>  <source    srcSet="      /images/optimized/example@sm.avif 640w,      /images/optimized/example@md.avif 768w,      /images/optimized/example@lg.avif 1200w,      /images/optimized/example.avif 1920w    "    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"    type="image/avif"  />  <source    srcSet="      /images/optimized/example@sm.webp 640w,      /images/optimized/example@md.webp 768w,      /images/optimized/example@lg.webp 1200w,      /images/optimized/example.webp 1920w    "    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"    type="image/webp"  />  <Image    src="/images/optimized/example.png"    alt="Description"    width={1920}    height={1080}    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"  /></picture>```

## Processed Images

### Kirka-Landing.png
Original size: 458.02 KB

**AVIF:**
- Kirka-Landing@2x.avif: 23.4 KB (94.9% reduction)
- Kirka-Landing@sm.avif: 21.06 KB (95.4% reduction)

**WEBP:**
- Kirka-Landing@2x.webp: 23.66 KB (94.8% reduction)
- Kirka-Landing@sm.webp: 21.93 KB (95.2% reduction)

**PNG:**
- Kirka-Landing@2x.png: 141.37 KB (69.1% reduction)
- Kirka-Landing@sm.png: 123.76 KB (73.0% reduction)

### Myth-and-Legends-Banner.png
Original size: 769.01 KB

**AVIF:**
- Myth-and-Legends-Banner@2x.avif: 76.03 KB (90.1% reduction)
- Myth-and-Legends-Banner@sm.avif: 64.86 KB (91.6% reduction)

**WEBP:**
- Myth-and-Legends-Banner@2x.webp: 67.2 KB (91.3% reduction)
- Myth-and-Legends-Banner@sm.webp: 57.11 KB (92.6% reduction)

**PNG:**
- Myth-and-Legends-Banner@2x.png: 247.21 KB (67.9% reduction)
- Myth-and-Legends-Banner@sm.png: 198.74 KB (74.2% reduction)

### Portfolio-Home.png
Original size: 368.87 KB

**AVIF:**
- Portfolio-Home@2x.avif: 75.64 KB (79.5% reduction)
- Portfolio-Home@lg.avif: 46.49 KB (87.4% reduction)
- Portfolio-Home@md.avif: 27.02 KB (92.7% reduction)
- Portfolio-Home@sm.avif: 21.87 KB (94.1% reduction)

**WEBP:**
- Portfolio-Home@2x.webp: 71.14 KB (80.7% reduction)
- Portfolio-Home@lg.webp: 41.53 KB (88.7% reduction)
- Portfolio-Home@md.webp: 23.14 KB (93.7% reduction)
- Portfolio-Home@sm.webp: 18.13 KB (95.1% reduction)

**PNG:**
- Portfolio-Home@2x.png: 117.75 KB (68.1% reduction)
- Portfolio-Home@lg.png: 83.09 KB (77.5% reduction)
- Portfolio-Home@md.png: 43.67 KB (88.2% reduction)
- Portfolio-Home@sm.png: 34.46 KB (90.7% reduction)

### Portfolio-HomeV2.png
Original size: 326.67 KB

**AVIF:**
- Portfolio-HomeV2@2x.avif: 69.78 KB (78.6% reduction)
- Portfolio-HomeV2@lg.avif: 57.83 KB (82.3% reduction)
- Portfolio-HomeV2@md.avif: 34.62 KB (89.4% reduction)
- Portfolio-HomeV2@sm.avif: 28.43 KB (91.3% reduction)

**WEBP:**
- Portfolio-HomeV2@2x.webp: 64.49 KB (80.3% reduction)
- Portfolio-HomeV2@lg.webp: 52.12 KB (84.0% reduction)
- Portfolio-HomeV2@md.webp: 29.88 KB (90.9% reduction)
- Portfolio-HomeV2@sm.webp: 24 KB (92.7% reduction)

**PNG:**
- Portfolio-HomeV2@2x.png: 105.67 KB (67.7% reduction)
- Portfolio-HomeV2@lg.png: 107.7 KB (67.0% reduction)
- Portfolio-HomeV2@md.png: 57.43 KB (82.4% reduction)
- Portfolio-HomeV2@sm.png: 45.08 KB (86.2% reduction)

### contactBackgroundV5.png
Original size: 751.84 KB

**AVIF:**
- contactBackgroundV5@2x.avif: 12.91 KB (98.3% reduction)
- contactBackgroundV5@md.avif: 9.03 KB (98.8% reduction)
- contactBackgroundV5@sm.avif: 7.22 KB (99.0% reduction)

**WEBP:**
- contactBackgroundV5@2x.webp: 16.37 KB (97.8% reduction)
- contactBackgroundV5@md.webp: 11.09 KB (98.5% reduction)
- contactBackgroundV5@sm.webp: 8.58 KB (98.9% reduction)

**PNG:**
- contactBackgroundV5@2x.png: 178.53 KB (76.3% reduction)
- contactBackgroundV5@md.png: 102.41 KB (86.4% reduction)
- contactBackgroundV5@sm.png: 70.66 KB (90.6% reduction)

### dubaiSunraise.png
Original size: 6.15 MB

**AVIF:**
- dubaiSunraise.avif: 206.02 KB (96.7% reduction)
- dubaiSunraise@2x.avif: 375.67 KB (94.0% reduction)
- dubaiSunraise@lg.avif: 105.91 KB (98.3% reduction)
- dubaiSunraise@md.avif: 51.94 KB (99.2% reduction)
- dubaiSunraise@sm.avif: 37.38 KB (99.4% reduction)

**WEBP:**
- dubaiSunraise.webp: 185.59 KB (97.1% reduction)
- dubaiSunraise@2x.webp: 355 KB (94.4% reduction)
- dubaiSunraise@lg.webp: 96.92 KB (98.5% reduction)
- dubaiSunraise@md.webp: 49.59 KB (99.2% reduction)
- dubaiSunraise@sm.webp: 36.37 KB (99.4% reduction)

**PNG:**
- dubaiSunraise.png: 1.47 MB (76.1% reduction)
- dubaiSunraise@2x.png: 3.43 MB (44.2% reduction)
- dubaiSunraise@lg.png: 634.83 KB (89.9% reduction)
- dubaiSunraise@md.png: 268.52 KB (95.7% reduction)
- dubaiSunraise@sm.png: 187.45 KB (97.0% reduction)

### familyBrunch.png
Original size: 834.39 KB

**AVIF:**
- familyBrunch@2x.avif: 46.6 KB (94.4% reduction)
- familyBrunch@md.avif: 41.55 KB (95.0% reduction)
- familyBrunch@sm.avif: 34.55 KB (95.9% reduction)

**WEBP:**
- familyBrunch@2x.webp: 46.16 KB (94.5% reduction)
- familyBrunch@md.webp: 40.62 KB (95.1% reduction)
- familyBrunch@sm.webp: 32.25 KB (96.1% reduction)

**PNG:**
- familyBrunch@2x.png: 259.47 KB (68.9% reduction)
- familyBrunch@md.png: 206.49 KB (75.3% reduction)
- familyBrunch@sm.png: 150.98 KB (81.9% reduction)

### gardeningHobby.png
Original size: 637.17 KB

**AVIF:**
- gardeningHobby@2x.avif: 10.44 KB (98.4% reduction)
- gardeningHobby@md.avif: 9.04 KB (98.6% reduction)
- gardeningHobby@sm.avif: 7.35 KB (98.8% reduction)

**WEBP:**
- gardeningHobby@2x.webp: 11.18 KB (98.2% reduction)
- gardeningHobby@md.webp: 9.51 KB (98.5% reduction)
- gardeningHobby@sm.webp: 7.43 KB (98.8% reduction)

**PNG:**
- gardeningHobby@2x.png: 230.56 KB (63.8% reduction)
- gardeningHobby@md.png: 205.15 KB (67.8% reduction)
- gardeningHobby@sm.png: 125.5 KB (80.3% reduction)

### iconProfilePicture.png
Original size: 329.61 KB

**AVIF:**
- iconProfilePicture@2x.avif: 11.55 KB (96.5% reduction)
- iconProfilePicture@sm.avif: 11.16 KB (96.6% reduction)

**WEBP:**
- iconProfilePicture@2x.webp: 10.31 KB (96.9% reduction)
- iconProfilePicture@sm.webp: 9.94 KB (97.0% reduction)

**PNG:**
- iconProfilePicture@2x.png: 138.2 KB (58.1% reduction)
- iconProfilePicture@sm.png: 135.92 KB (58.8% reduction)

### iphoneBackground.png
Original size: 519.67 KB

**AVIF:**
- iphoneBackground@2x.avif: 27.56 KB (94.7% reduction)

**WEBP:**
- iphoneBackground@2x.webp: 30.93 KB (94.0% reduction)

**PNG:**
- iphoneBackground@2x.png: 203.51 KB (60.8% reduction)

### mainHobby-min.png
Original size: 3.73 MB

**AVIF:**
- mainHobby-min.avif: 338.57 KB (91.1% reduction)
- mainHobby-min@2x.avif: 2.12 MB (43.1% reduction)
- mainHobby-min@lg.avif: 163.91 KB (95.7% reduction)
- mainHobby-min@md.avif: 86.02 KB (97.7% reduction)
- mainHobby-min@sm.avif: 65.61 KB (98.3% reduction)

**WEBP:**
- mainHobby-min.webp: 298.05 KB (92.2% reduction)
- mainHobby-min@2x.webp: 1.1 MB (70.6% reduction)
- mainHobby-min@lg.webp: 151.93 KB (96.0% reduction)
- mainHobby-min@md.webp: 76.92 KB (98.0% reduction)
- mainHobby-min@sm.webp: 58.78 KB (98.5% reduction)

**PNG:**
- mainHobby-min.png: 1.63 MB (56.2% reduction)
- mainHobby-min@2x.png: 5.3 MB (-42.2% reduction)
- mainHobby-min@lg.png: 673.96 KB (82.4% reduction)
- mainHobby-min@md.png: 297.61 KB (92.2% reduction)
- mainHobby-min@sm.png: 215.02 KB (94.4% reduction)

### xArtify-pricing.png
Original size: 604.38 KB

**AVIF:**
- xArtify-pricing@2x.avif: 56.99 KB (90.6% reduction)
- xArtify-pricing@lg.avif: 50.71 KB (91.6% reduction)
- xArtify-pricing@md.avif: 25.75 KB (95.7% reduction)
- xArtify-pricing@sm.avif: 19.61 KB (96.8% reduction)

**WEBP:**
- xArtify-pricing@2x.webp: 76.54 KB (87.3% reduction)
- xArtify-pricing@lg.webp: 54.21 KB (91.0% reduction)
- xArtify-pricing@md.webp: 27.55 KB (95.4% reduction)
- xArtify-pricing@sm.webp: 20.33 KB (96.6% reduction)

**PNG:**
- xArtify-pricing@2x.png: 177.76 KB (70.6% reduction)
- xArtify-pricing@lg.png: 160.33 KB (73.5% reduction)
- xArtify-pricing@md.png: 71.73 KB (88.1% reduction)
- xArtify-pricing@sm.png: 50.74 KB (91.6% reduction)

