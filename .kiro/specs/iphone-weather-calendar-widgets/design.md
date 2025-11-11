# Design Document

## Overview

This design document outlines the architecture and implementation approach for adding Weather and Calendar widgets to the iPhone home screen interface. The solution integrates with the existing iPhone widget component and uses the Open-Meteo API for real-time weather data.

## Architecture

### Component Hierarchy

```
IPhoneWidget (existing)
├── HomeScreen (existing)
│   ├── WidgetGrid (new)
│   │   ├── WeatherWidget (new)
│   │   └── CalendarWidget (new)
│   └── AppGrid (existing)
│       └── AppIcon[] (existing)
└── AppContainer (existing)
    └── WeatherApp (new)
```

### Data Flow

```
Open-Meteo API → WeatherService → WeatherWidget → WeatherApp
System Time → CalendarWidget
User Interaction → Widget Click → App Modal Open
```

## Components and Interfaces

### 1. WeatherWidget Component

**Purpose:** Display current weather conditions in a compact widget format

**Props Interface:**

```typescript
interface WeatherWidgetProps {
  city: string;
  onWidgetClick: () => void;
  className?: string;
}
```

**State:**

```typescript
interface WeatherWidgetState {
  temperature: number;
  condition: string;
  high: number;
  low: number;
  icon: WeatherIcon;
  isLoading: boolean;
  error: string | null;
}
```

**Visual Design:**

- Dark glassmorphism background: `rgba(30, 30, 35, 0.85)`
- Backdrop blur: `blur(20px) saturate(180%)`
- Border radius: `20px`
- Padding: `16px`
- Size: Approximately 170px × 170px (square widget)
- Font: SF Pro Display or system-ui
- Temperature: 48px bold white
- City name: 14px semibold white opacity 0.9
- Condition: 13px regular white opacity 0.7
- High/Low: 12px regular white opacity 0.7

**Layout:**

```
┌─────────────────┐
│ Sofia           │
│                 │
│     59°         │
│                 │
│  🌙 Clear       │
│  H:80° L:58°    │
└─────────────────┘
```

### 2. CalendarWidget Component

**Purpose:** Display current date and day of week

**Props Interface:**

```typescript
interface CalendarWidgetProps {
  className?: string;
}
```

**State:**

```typescript
interface CalendarWidgetState {
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
}
```

**Visual Design:**

- Light glassmorphism background: `rgba(255, 250, 240, 0.95)`
- Backdrop blur: `blur(20px) saturate(180%)`
- Border radius: `20px`
- Padding: `16px`
- Size: Approximately 170px × 170px (square widget)
- Day of week: 12px uppercase orange/red
- Day number: 56px bold dark gray
- Event text: 13px regular gray opacity 0.6

**Layout:**

```
┌─────────────────┐
│ MONDAY          │
│                 │
│      6          │
│                 │
│ No events today │
│                 │
│    Calendar     │
└─────────────────┘
```

### 3. WeatherApp Component

**Purpose:** Full-screen weather application with 7-day forecast

**Props Interface:**

```typescript
interface WeatherAppProps {
  onClose: () => void;
  initialCity?: string;
}
```

**State:**

```typescript
interface WeatherAppState {
  currentWeather: CurrentWeather;
  forecast: DailyForecast[];
  selectedCity: string;
  isLoading: boolean;
  error: string | null;
  showCitySelector: boolean;
}

interface CurrentWeather {
  temperature: number;
  condition: string;
  icon: WeatherIcon;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
}

interface DailyForecast {
  date: Date;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: WeatherIcon;
  precipitationChance: number;
}
```

**Visual Design:**

- Full-screen modal with glassmorphism
- Header: City name with edit button
- Current weather section: Large temperature, icon, conditions
- Forecast section: Scrollable list of daily cards
- Each forecast card: Day name, icon, high/low temps
- Color scheme: Dark background with white/light blue text
- Animations: Fade in forecast cards with stagger effect

**Layout:**

```
┌─────────────────────────┐
│ ← Sofia            ⚙️   │
│                         │
│        ☀️               │
│        22°              │
│      Sunny              │
│    H:25° L:18°          │
│                         │
│ ─────────────────────── │
│                         │
│ Mon  ☀️  25° / 18°     │
│ Tue  ⛅  23° / 17°     │
│ Wed  🌧️  20° / 15°     │
│ Thu  ⛅  21° / 16°     │
│ Fri  ☀️  24° / 17°     │
│ Sat  ☀️  26° / 19°     │
│ Sun  ⛅  24° / 18°     │
└─────────────────────────┘
```

### 4. WidgetGrid Component

**Purpose:** Layout container for widgets above app icons

**Props Interface:**

```typescript
interface WidgetGridProps {
  onWeatherClick: () => void;
  children?: ReactNode;
}
```

**Layout:**

- CSS Grid with 2 columns
- Gap: 12px
- Margin bottom: 24px
- Responsive: Stack vertically on mobile

### 5. WeatherService

**Purpose:** Handle all weather API interactions

**Interface:**

```typescript
interface WeatherService {
  getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather>;
  getForecast(lat: number, lon: number, days: number): Promise<DailyForecast[]>;
  searchCities(query: string): Promise<City[]>;
  geocodeCity(cityName: string): Promise<Coordinates>;
}

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface Coordinates {
  lat: number;
  lon: number;
}
```

**API Endpoints:**

- Current weather: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
- 7-day forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
- City search: `https://geocoding-api.open-meteo.com/v1/search?name={query}&count=10&language=en&format=json`

**Weather Code Mapping:**

```typescript
const WEATHER_CODES = {
  0: { condition: 'Clear', icon: 'sun', night: 'moon' },
  1: { condition: 'Mainly Clear', icon: 'sun', night: 'moon' },
  2: { condition: 'Partly Cloudy', icon: 'cloud-sun', night: 'cloud-moon' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Foggy', icon: 'fog' },
  48: { condition: 'Foggy', icon: 'fog' },
  51: { condition: 'Light Drizzle', icon: 'cloud-drizzle' },
  53: { condition: 'Drizzle', icon: 'cloud-drizzle' },
  55: { condition: 'Heavy Drizzle', icon: 'cloud-drizzle' },
  61: { condition: 'Light Rain', icon: 'cloud-rain' },
  63: { condition: 'Rain', icon: 'cloud-rain' },
  65: { condition: 'Heavy Rain', icon: 'cloud-rain' },
  71: { condition: 'Light Snow', icon: 'cloud-snow' },
  73: { condition: 'Snow', icon: 'cloud-snow' },
  75: { condition: 'Heavy Snow', icon: 'cloud-snow' },
  77: { condition: 'Snow Grains', icon: 'cloud-snow' },
  80: { condition: 'Light Showers', icon: 'cloud-rain' },
  81: { condition: 'Showers', icon: 'cloud-rain' },
  82: { condition: 'Heavy Showers', icon: 'cloud-rain' },
  85: { condition: 'Light Snow Showers', icon: 'cloud-snow' },
  86: { condition: 'Snow Showers', icon: 'cloud-snow' },
  95: { condition: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { condition: 'Thunderstorm with Hail', icon: 'cloud-lightning' },
  99: { condition: 'Thunderstorm with Hail', icon: 'cloud-lightning' },
};
```

## Data Models

### Weather Data Types

```typescript
// API Response Types
interface OpenMeteoCurrentResponse {
  current: {
    time: string;
    temperature_2m: number;
    weathercode: number;
    windspeed_10m: number;
    relativehumidity_2m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface OpenMeteoForecastResponse {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

// Internal Data Types
type WeatherIcon =
  | 'sun'
  | 'moon'
  | 'cloud'
  | 'cloud-sun'
  | 'cloud-moon'
  | 'cloud-rain'
  | 'cloud-drizzle'
  | 'cloud-snow'
  | 'cloud-lightning'
  | 'fog';
```

### Calendar Data Types

```typescript
interface CalendarData {
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  year: number;
  fullDate: Date;
}
```

## Error Handling

### Weather API Errors

1. **Network Errors:**
   - Display: "Unable to load weather"
   - Retry: Automatic retry after 30 seconds
   - Fallback: Show cached data if available

2. **Invalid Location:**
   - Display: "Location not found"
   - Action: Prompt user to select different city

3. **Rate Limiting:**
   - Cache responses for 30 minutes
   - Implement exponential backoff

4. **Parsing Errors:**
   - Log error to console
   - Display: "Weather data unavailable"
   - Fallback: Show last known good data

### User Experience

- Loading states: Skeleton screens with pulsing animation
- Error states: Friendly error messages with retry button
- Empty states: "No forecast available" with refresh option

## Testing Strategy

### Unit Tests

1. **WeatherService:**
   - Test API response parsing
   - Test weather code mapping
   - Test error handling
   - Mock API responses

2. **WeatherWidget:**
   - Test rendering with different weather conditions
   - Test loading and error states
   - Test click handler

3. **CalendarWidget:**
   - Test date formatting
   - Test day of week calculation
   - Test midnight date updates

4. **WeatherApp:**
   - Test forecast rendering
   - Test city selection
   - Test navigation

### Integration Tests

1. Test widget click opening WeatherApp
2. Test city change updating weather data
3. Test data refresh on app reopen
4. Test error recovery flow

### Visual Regression Tests

1. Weather widget in different states (sunny, rainy, snowy)
2. Calendar widget on different dates
3. WeatherApp with full forecast
4. Mobile responsive layouts

### Accessibility Tests

1. Keyboard navigation through widgets
2. Screen reader announcements
3. Focus management in WeatherApp
4. Color contrast ratios
5. Touch target sizes on mobile

## Performance Considerations

### Optimization Strategies

1. **API Caching:**
   - Cache weather data in localStorage
   - TTL: 30 minutes for current weather
   - TTL: 2 hours for forecast data

2. **Lazy Loading:**
   - Load WeatherApp component only when clicked
   - Defer forecast data fetch until app opens

3. **Debouncing:**
   - Debounce city search input (300ms)
   - Throttle scroll events in forecast list

4. **Image Optimization:**
   - Use SVG icons for weather conditions
   - Inline small icons to reduce requests

5. **Bundle Size:**
   - Tree-shake unused weather codes
   - Use dynamic imports for WeatherApp

### Performance Metrics

- Widget render time: < 100ms
- API response time: < 500ms
- App open animation: 300ms
- Forecast scroll: 60fps

## Accessibility

### ARIA Labels

```typescript
// WeatherWidget
aria-label="Weather widget for Sofia, 59 degrees, clear conditions"
role="button"
aria-expanded="false"

// CalendarWidget
aria-label="Calendar widget, Monday, January 6th"
role="region"

// WeatherApp
aria-label="Weather forecast application"
role="dialog"
aria-modal="true"

// Forecast items
aria-label="Monday, sunny, high 25 degrees, low 18 degrees"
```

### Keyboard Navigation

- Tab: Navigate between widgets and forecast items
- Enter/Space: Activate widget or select city
- Escape: Close WeatherApp
- Arrow keys: Navigate forecast list

### Screen Reader Support

- Announce weather updates
- Announce city changes
- Announce loading states
- Provide context for icons

## Security Considerations

1. **API Security:**
   - Use HTTPS for all API calls
   - No API keys exposed (Open-Meteo is public)
   - Validate API responses before parsing

2. **Input Validation:**
   - Sanitize city search input
   - Validate coordinates range
   - Prevent XSS in city names

3. **Data Privacy:**
   - No user location tracking
   - No personal data collection
   - Clear localStorage on session end (optional)

## Browser Compatibility

### Supported Browsers

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile Safari: 14+
- Mobile Chrome: 90+

### Fallbacks

- Backdrop-filter: Solid background fallback
- CSS Grid: Flexbox fallback
- Fetch API: Already supported in target browsers

## Responsive Design

### Breakpoints

- Desktop (> 768px): Side-by-side widgets, 170px each
- Tablet (480-768px): Side-by-side widgets, scaled down
- Mobile (< 480px): Stacked widgets, full width

### Mobile Optimizations

- Larger touch targets (48px minimum)
- Simplified forecast cards
- Reduced animation complexity
- Optimized font sizes

## Implementation Notes

### Integration with Existing Code

1. **HomeScreen Component:**
   - Add WidgetGrid above existing AppGrid
   - Pass weather click handler to open WeatherApp
   - Maintain existing app icon functionality

2. **AppContainer Component:**
   - Add 'weather' to AppType enum
   - Handle WeatherApp rendering
   - Reuse existing modal logic

3. **Styling:**
   - Follow existing glassmorphism patterns
   - Use CSS modules for scoped styles
   - Maintain consistent spacing with app icons

### File Structure

```
src/components/sections/about/iphone-widget/
├── widgets/
│   ├── WeatherWidget.tsx
│   ├── WeatherWidget.module.css
│   ├── CalendarWidget.tsx
│   ├── CalendarWidget.module.css
│   ├── WidgetGrid.tsx
│   ├── WidgetGrid.module.css
│   └── index.ts
├── apps/
│   ├── WeatherApp.tsx
│   ├── WeatherApp.module.css
│   └── index.ts (update)
├── services/
│   ├── weatherService.ts
│   └── index.ts
├── hooks/
│   ├── useWeather.ts
│   ├── useCalendar.ts
│   └── index.ts
└── types.ts (update)
```

### Dependencies

No new external dependencies required. Use existing:

- React (hooks, state management)
- Lucide React (weather icons)
- Native Fetch API (HTTP requests)

## Deployment Considerations

1. **Environment Variables:**
   - No API keys needed for Open-Meteo
   - Optional: Configure default city via env var

2. **Build Process:**
   - No changes to existing build pipeline
   - Ensure tree-shaking works for weather codes

3. **Monitoring:**
   - Log API errors to console
   - Track widget interaction metrics (optional)
   - Monitor API response times

## Future Enhancements

1. **Weather Alerts:** Show severe weather warnings
2. **Hourly Forecast:** Add hourly temperature graph
3. **Multiple Locations:** Save favorite cities
4. **Weather Animations:** Animated weather backgrounds
5. **Calendar Events:** Integrate with calendar API
6. **Precipitation Map:** Show radar/precipitation visualization
