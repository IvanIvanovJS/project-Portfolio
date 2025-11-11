# Implementation Plan

- [x] 1. Set up data types and service infrastructure
  - Create TypeScript interfaces for weather data, API responses, and widget props
  - Implement WeatherService with Open-Meteo API integration
  - Add weather code to condition/icon mapping
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 7.1, 7.2, 7.3_

- [x] 1.1 Create weather and calendar type definitions
  - Write TypeScript interfaces in `types.ts` for WeatherWidgetProps, CalendarWidgetProps, CurrentWeather, DailyForecast, WeatherIcon
  - Add OpenMeteoCurrentResponse and OpenMeteoForecastResponse interfaces
  - Define City and Coordinates interfaces for geocoding
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2_

- [x] 1.2 Implement WeatherService for API communication
  - Create `services/weatherService.ts` with getCurrentWeather, getForecast, searchCities, and geocodeCity methods
  - Implement fetch calls to Open-Meteo API endpoints
  - Add weather code to condition/icon mapping object
  - Implement error handling and response parsing
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 1.3 Add caching layer to WeatherService
  - Implement localStorage caching for weather data
  - Add TTL logic (30 min for current, 2 hours for forecast)
  - Create cache key generation based on coordinates
  - Add cache invalidation on city change
  - _Requirements: 7.5_

- [x] 2. Create CalendarWidget component
  - Build CalendarWidget component with current date display
  - Implement automatic date updates at midnight
  - Style with light glassmorphism design matching iOS
  - Add responsive sizing for mobile
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2.1 Implement CalendarWidget component structure
  - Create `widgets/CalendarWidget.tsx` with functional component
  - Add useCalendar custom hook for date management
  - Implement date formatting (day of week, day of month)
  - Add automatic midnight update with setInterval
  - _Requirements: 3.1, 3.2, 3.3, 8.1, 8.2, 8.3_

- [x] 2.2 Style CalendarWidget with glassmorphism
  - Create `widgets/CalendarWidget.module.css` with light background
  - Apply backdrop-filter blur and saturation
  - Style day of week (uppercase, orange/red color)
  - Style day number (large, bold, dark gray)
  - Add "No events today" placeholder text
  - _Requirements: 3.4, 3.5, 9.2, 9.3, 9.4, 9.5_

- [x] 3. Create WeatherWidget component
  - Build WeatherWidget component with current weather display
  - Integrate with WeatherService to fetch Sofia weather
  - Display temperature, condition, high/low, and weather icon
  - Style with dark glassmorphism design matching iOS
  - Add loading and error states
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3.1 Implement WeatherWidget component structure
  - Create `widgets/WeatherWidget.tsx` with functional component
  - Add useWeather custom hook for data fetching
  - Implement click handler to open WeatherApp
  - Add loading skeleton and error message states
  - _Requirements: 1.1, 1.2, 2.3, 2.4, 2.5_

- [x] 3.2 Style WeatherWidget with dark glassmorphism
  - Create `widgets/WeatherWidget.module.css` with dark background
  - Apply backdrop-filter blur and saturation
  - Style temperature (large, bold, white)
  - Style city name, condition, and high/low temps
  - Add weather icon positioning and sizing
  - _Requirements: 1.3, 1.4, 1.5, 2.1, 2.2, 9.1, 9.3, 9.4, 9.5_

- [x] 3.3 Integrate weather icons from Lucide React
  - Import appropriate weather icons (Sun, Moon, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog)
  - Create icon mapping function based on weather code
  - Add day/night detection for sun/moon icons
  - Style icons with appropriate colors and sizes
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 4. Create WidgetGrid layout component
  - Build WidgetGrid component to contain both widgets
  - Implement CSS Grid layout with 2 columns
  - Add responsive behavior for mobile (stack vertically)
  - Position above existing app icons with proper spacing
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 4.1 Implement WidgetGrid component
  - Create `widgets/WidgetGrid.tsx` with container component
  - Add props for onWeatherClick handler
  - Render WeatherWidget and CalendarWidget as children
  - Pass click handler to WeatherWidget
  - _Requirements: 10.1, 10.2_

- [x] 4.2 Style WidgetGrid with responsive layout
  - Create `widgets/WidgetGrid.module.css` with CSS Grid
  - Set 2-column layout with 12px gap
  - Add margin-bottom for spacing from app icons
  - Implement mobile breakpoint to stack vertically
  - Adjust widget sizes for different screen sizes
  - _Requirements: 10.3, 10.4, 10.5_

- [x] 5. Create WeatherApp full-screen component
  - Build WeatherApp component with current weather and 7-day forecast
  - Fetch forecast data from WeatherService
  - Display current conditions at top with large temperature
  - Render scrollable list of daily forecast cards
  - Add back button to close and return to home screen
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.1 Implement WeatherApp component structure
  - Create `apps/WeatherApp.tsx` with functional component
  - Add state for current weather, forecast, loading, and errors
  - Fetch forecast data on component mount
  - Implement back button handler to close app
  - Add scroll container for forecast list
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5.2 Create current weather section
  - Display city name in header with edit button
  - Show large temperature with weather icon
  - Display condition text below temperature
  - Show high/low temperatures
  - Add additional details (humidity, wind speed)
  - _Requirements: 4.2, 4.3_

- [x] 5.3 Create forecast list with daily cards
  - Map forecast data to daily card components
  - Display day name, weather icon, high/low temps
  - Add precipitation chance if available
  - Style cards with glassmorphism
  - Implement stagger animation for card appearance
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.4 Style WeatherApp with glassmorphism
  - Create `apps/WeatherApp.module.css` with full-screen modal styles
  - Apply dark background with backdrop blur
  - Style header with back button and city name
  - Style current weather section with large typography
  - Style forecast cards with consistent spacing
  - _Requirements: 4.5, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 6. Implement city selection feature
  - Add city selector button in WeatherApp header
  - Create city search interface with input field
  - Integrate with WeatherService geocoding API
  - Display city suggestions as user types
  - Update weather data when new city is selected
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6.1 Create city selector UI component
  - Add settings/edit button in WeatherApp header
  - Create modal or dropdown for city search
  - Add text input field with search icon
  - Style with glassmorphism matching app design
  - _Requirements: 6.1, 6.2_

- [x] 6.2 Implement city search functionality
  - Add debounced search handler (300ms delay)
  - Call WeatherService.searchCities with query
  - Display list of matching cities with country
  - Handle empty results and errors
  - _Requirements: 6.2, 6.3_

- [x] 6.3 Handle city selection and weather update
  - Add click handler for city selection
  - Update selected city in state
  - Fetch new weather data for selected coordinates
  - Close city selector and show updated weather
  - Store selected city in session storage
  - _Requirements: 6.4, 6.5_

- [x] 7. Integrate widgets into HomeScreen
  - Update HomeScreen component to include WidgetGrid
  - Position WidgetGrid above existing AppGrid
  - Pass weather click handler to open WeatherApp
  - Maintain existing app icon functionality
  - _Requirements: 1.1, 3.1, 4.1_

- [x] 7.1 Update HomeScreen component structure
  - Import WidgetGrid, WeatherWidget, and CalendarWidget
  - Add WidgetGrid before AppGrid in render
  - Create handleWeatherClick function
  - Pass onWeatherClick to WidgetGrid
  - _Requirements: 1.1, 3.1_

- [x] 7.2 Update HomeScreen styles for widget spacing
  - Adjust HomeScreen.module.css to accommodate widgets
  - Add proper spacing between WidgetGrid and AppGrid
  - Ensure widgets don't overlap with system bar
  - Test responsive layout on mobile
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 8. Integrate WeatherApp into AppContainer
  - Update AppType enum to include 'weather'
  - Add WeatherApp case in AppContainer switch
  - Pass onClose handler to WeatherApp
  - Reuse existing modal and backdrop logic
  - _Requirements: 4.1, 4.4_

- [ ] 8.1 Update types and AppContainer logic
  - Add 'weather' to AppType enum in types.ts
  - Import WeatherApp in AppContainer.tsx
  - Add case for 'weather' in app rendering switch
  - Pass app prop and onClose handler to WeatherApp
  - _Requirements: 4.1, 4.4_

- [ ] 8.2 Update IPhoneWidget state management
  - Add weather app handling to useIPhoneState hook
  - Implement openWeatherApp function
  - Connect weather widget click to state update
  - Test app opening and closing flow
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 9. Add accessibility features
  - Add ARIA labels to all widgets and interactive elements
  - Implement keyboard navigation for widgets
  - Add focus management for WeatherApp modal
  - Ensure screen reader compatibility
  - Test with keyboard-only navigation
  - _Requirements: 12.5_

- [ ] 9.1 Add ARIA labels and roles
  - Add aria-label to WeatherWidget with current conditions
  - Add aria-label to CalendarWidget with date
  - Add role="button" and aria-expanded to WeatherWidget
  - Add role="dialog" and aria-modal to WeatherApp
  - Add aria-labels to forecast items
  - _Requirements: 12.5_

- [ ] 9.2 Implement keyboard navigation
  - Add tabIndex to widgets for keyboard focus
  - Handle Enter/Space key to activate widgets
  - Add Escape key handler to close WeatherApp
  - Implement arrow key navigation in forecast list
  - Test tab order and focus indicators
  - _Requirements: 12.5_

- [ ] 9.3 Add focus trap in WeatherApp
  - Implement focus trap when WeatherApp opens
  - Return focus to widget when app closes
  - Ensure all interactive elements are reachable
  - Test with screen reader (VoiceOver/NVDA)
  - _Requirements: 12.5_

- [ ] 10. Add loading and error states
  - Implement skeleton loading for WeatherWidget
  - Add error message display for API failures
  - Create retry mechanism for failed requests
  - Add empty state for missing forecast data
  - Test various error scenarios
  - _Requirements: 2.5, 7.4_

- [ ] 10.1 Create loading skeleton for WeatherWidget
  - Design pulsing skeleton matching widget layout
  - Show skeleton while fetching initial weather data
  - Add loading spinner for refresh actions
  - Style skeleton with subtle animation
  - _Requirements: 2.5_

- [ ] 10.2 Implement error handling UI
  - Create error message component for widgets
  - Add retry button for failed API calls
  - Display user-friendly error messages
  - Handle network errors, invalid locations, and parsing errors
  - Add fallback to cached data when available
  - _Requirements: 7.4_

- [ ] 11. Implement animations and transitions
  - Add smooth open/close animation for WeatherApp
  - Implement stagger animation for forecast cards
  - Add hover effects to widgets
  - Ensure animations respect prefers-reduced-motion
  - Test animation performance (60fps target)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 11.1 Add WeatherApp open/close animations
  - Implement scale and fade animation for app opening
  - Add slide-up animation for forecast cards
  - Create smooth backdrop fade transition
  - Use CSS transforms for hardware acceleration
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 11.2 Add widget hover and interaction effects
  - Add scale transform on widget hover
  - Implement subtle glow effect on hover
  - Add active state with scale down
  - Ensure touch feedback on mobile
  - _Requirements: 11.1, 11.5_

- [ ] 11.3 Implement reduced motion support
  - Add prefers-reduced-motion media query
  - Disable animations when user prefers reduced motion
  - Maintain functionality without animations
  - Test with reduced motion enabled
  - _Requirements: 11.4_

- [ ] 12. Add responsive design for mobile
  - Adjust widget sizes for mobile screens
  - Stack widgets vertically on small screens
  - Optimize WeatherApp layout for mobile
  - Ensure touch targets are 48px minimum
  - Test on various mobile devices
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 12.1 Implement mobile breakpoints for widgets
  - Add media queries for tablet (480-768px) and mobile (< 480px)
  - Scale widget sizes appropriately
  - Stack widgets vertically on mobile
  - Adjust font sizes for readability
  - _Requirements: 10.1, 10.2, 10.4_

- [ ] 12.2 Optimize WeatherApp for mobile
  - Adjust forecast card layout for narrow screens
  - Increase touch target sizes to 48px minimum
  - Simplify city selector for mobile
  - Test scrolling and interactions on touch devices
  - _Requirements: 10.3, 10.4, 10.5_

- [ ]\* 13. Write unit tests for components and services
  - Write tests for WeatherService API methods
  - Test WeatherWidget rendering and interactions
  - Test CalendarWidget date calculations
  - Test WeatherApp forecast display
  - Test error handling and loading states
  - _Requirements: All_

- [ ]\* 13.1 Write WeatherService unit tests
  - Test getCurrentWeather with mocked API response
  - Test getForecast with mocked API response
  - Test searchCities with mocked geocoding response
  - Test weather code mapping function
  - Test error handling for network failures
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]\* 13.2 Write WeatherWidget component tests
  - Test rendering with different weather conditions
  - Test loading state display
  - Test error state display
  - Test click handler invocation
  - Test icon selection based on weather code
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]\* 13.3 Write CalendarWidget component tests
  - Test date formatting and display
  - Test day of week calculation
  - Test midnight date update
  - Test responsive styling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3_

- [ ]\* 13.4 Write WeatherApp component tests
  - Test forecast data rendering
  - Test city selection flow
  - Test back button functionality
  - Test scroll behavior
  - Test loading and error states
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]\* 14. Perform integration and accessibility testing
  - Test widget click opening WeatherApp
  - Test city change updating weather data
  - Test keyboard navigation through all elements
  - Test screen reader compatibility
  - Test on multiple browsers and devices
  - _Requirements: All_

- [ ]\* 14.1 Integration testing
  - Test complete flow from widget click to app open
  - Test city selection updating both widget and app
  - Test data refresh on app reopen
  - Test error recovery and retry flow
  - _Requirements: 4.1, 6.4, 6.5_

- [ ]\* 14.2 Accessibility testing
  - Test keyboard navigation (Tab, Enter, Escape, Arrows)
  - Test with screen reader (VoiceOver on Mac, NVDA on Windows)
  - Verify ARIA labels are announced correctly
  - Test focus management and focus trap
  - Verify color contrast ratios meet WCAG AA
  - _Requirements: 12.5_

- [ ]\* 14.3 Cross-browser and device testing
  - Test on Chrome, Firefox, Safari, Edge
  - Test on iOS Safari and Android Chrome
  - Test responsive layouts at various breakpoints
  - Test touch interactions on mobile devices
  - Verify animations perform at 60fps
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.5_
