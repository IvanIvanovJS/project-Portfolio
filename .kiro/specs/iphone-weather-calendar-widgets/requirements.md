# Requirements Document

## Introduction

This document defines the requirements for adding Weather and Calendar widgets to the iPhone home screen interface. These widgets will display real-time weather data for Sofia, Bulgaria and current date information, with expandable views for detailed forecasts and city selection.

## Glossary

- **Weather Widget**: A home screen widget displaying current weather conditions for Sofia
- **Calendar Widget**: A home screen widget displaying the current date and day of week
- **Weather App**: The expanded fullscreen weather application showing 7-day forecast
- **Open-Meteo API**: Free weather API service requiring no authentication keys
- **Widget Grid**: The iOS-style layout area above app icons for displaying widgets
- **Current Weather**: Real-time temperature, conditions, and weather icon
- **7-Day Forecast**: Extended weather prediction showing daily high/low temperatures and conditions
- **City Selector**: Interface for changing the weather location from Sofia to other cities

## Requirements

### Requirement 1

**User Story:** As a portfolio visitor, I want to see a weather widget on the iPhone home screen, so that I can view current weather conditions for Sofia at a glance

#### Acceptance Criteria

1. THE Weather Widget SHALL display in the top-left position of the widget grid above app icons
2. THE Weather Widget SHALL show the city name "Sofia" prominently at the top
3. THE Weather Widget SHALL display the current temperature in Celsius with the degree symbol
4. THE Weather Widget SHALL show the current weather condition as text (e.g., "Clear", "Cloudy", "Rain")
5. THE Weather Widget SHALL display an appropriate weather icon representing current conditions

### Requirement 2

**User Story:** As a portfolio visitor, I want to see additional weather details in the widget, so that I can understand the full current weather situation

#### Acceptance Criteria

1. THE Weather Widget SHALL display the daily high temperature with "H:" prefix
2. THE Weather Widget SHALL display the daily low temperature with "L:" prefix
3. THE Weather Widget SHALL use a dark glassmorphism background with rounded corners
4. THE Weather Widget SHALL update weather data automatically every 30 minutes
5. THE Weather Widget SHALL display a loading state while fetching weather data

### Requirement 3

**User Story:** As a portfolio visitor, I want to see a calendar widget on the iPhone home screen, so that I can view the current date and day of week

#### Acceptance Criteria

1. THE Calendar Widget SHALL display in the top-right position of the widget grid
2. THE Calendar Widget SHALL show the day of week in uppercase text (e.g., "MONDAY")
3. THE Calendar Widget SHALL display the day of month as a large number
4. THE Calendar Widget SHALL show "No events today" or similar placeholder text
5. THE Calendar Widget SHALL use a light glassmorphism background with rounded corners

### Requirement 4

**User Story:** As a portfolio visitor, I want to click the weather widget, so that I can see a detailed 7-day weather forecast

#### Acceptance Criteria

1. WHEN the user clicks the Weather Widget, THE iPhone Widget SHALL open the Weather App in fullscreen modal
2. THE Weather App SHALL display current weather conditions at the top with large temperature
3. THE Weather App SHALL show a 7-day forecast with daily cards below current conditions
4. WHEN the Weather App is open, THE Weather App SHALL include a back button to return to home screen
5. THE Weather App SHALL use glassmorphism styling consistent with other iPhone apps

### Requirement 5

**User Story:** As a portfolio visitor, I want to see detailed information in the 7-day forecast, so that I can plan ahead based on weather predictions

#### Acceptance Criteria

1. THE Weather App SHALL display each day with the day name (e.g., "Monday", "Tuesday")
2. THE Weather App SHALL show the high temperature for each day
3. THE Weather App SHALL show the low temperature for each day
4. THE Weather App SHALL display a weather icon representing conditions for each day
5. THE Weather App SHALL make the forecast scrollable if it exceeds viewport height

### Requirement 6

**User Story:** As a portfolio visitor, I want to change the weather location, so that I can see weather for cities other than Sofia

#### Acceptance Criteria

1. THE Weather App SHALL include a city selector button or input field
2. WHEN the user clicks the city selector, THE Weather App SHALL display a search interface
3. WHEN the user types a city name, THE Weather App SHALL show matching city suggestions
4. WHEN the user selects a different city, THE Weather App SHALL fetch and display weather for that location
5. THE Weather App SHALL remember the selected city for the current session

### Requirement 7

**User Story:** As a portfolio visitor, I want the weather data to come from Open-Meteo API, so that the feature works without requiring API keys or authentication

#### Acceptance Criteria

1. THE Weather Widget SHALL fetch current weather data from Open-Meteo API
2. THE Weather Widget SHALL use Sofia coordinates (42.6977, 23.3219) as default location
3. THE Weather App SHALL fetch 7-day forecast data from Open-Meteo API
4. THE Weather Widget SHALL handle API errors gracefully with fallback messaging
5. THE Weather Widget SHALL cache weather data to minimize API requests

### Requirement 8

**User Story:** As a portfolio visitor, I want the calendar widget to show accurate date information, so that I can trust the displayed information

#### Acceptance Criteria

1. THE Calendar Widget SHALL display the current date based on the user's system time
2. THE Calendar Widget SHALL update automatically at midnight to show the new date
3. THE Calendar Widget SHALL format the day of week in the user's locale
4. THE Calendar Widget SHALL use appropriate color coding (red text for day number on light background)
5. THE Calendar Widget SHALL maintain accurate time even if the page stays open for extended periods

### Requirement 9

**User Story:** As a portfolio visitor, I want the widgets to look authentic and match iOS design, so that the iPhone interface feels realistic

#### Acceptance Criteria

1. THE Weather Widget SHALL use dark background (rgba(0, 0, 0, 0.6)) with backdrop blur
2. THE Calendar Widget SHALL use light background (rgba(255, 255, 255, 0.9)) with subtle transparency
3. THE widgets SHALL have rounded corners matching iOS widget style (16-20px border radius)
4. THE widgets SHALL display appropriate spacing and padding matching iOS design
5. THE widgets SHALL use SF Pro or system fonts consistent with iOS typography

### Requirement 10

**User Story:** As a portfolio visitor on mobile, I want the widgets to be responsive, so that they display properly on smaller screens

#### Acceptance Criteria

1. THE widgets SHALL scale appropriately on mobile devices
2. THE widgets SHALL maintain readability at smaller sizes
3. THE Weather App SHALL be fully functional on touch devices
4. THE widgets SHALL use appropriate font sizes for mobile viewing
5. THE widgets SHALL maintain proper spacing in the widget grid on all screen sizes

### Requirement 11

**User Story:** As a portfolio visitor, I want smooth animations when opening the weather app, so that the interaction feels polished

#### Acceptance Criteria

1. WHEN the user clicks the Weather Widget, THE Weather App SHALL animate open with iOS-style transition
2. THE Weather App SHALL fade in the forecast data smoothly
3. WHEN the user closes the Weather App, THE Weather App SHALL animate back to widget size
4. THE Weather App SHALL respect prefers-reduced-motion for accessibility
5. THE Weather App SHALL maintain 60fps animation performance

### Requirement 12

**User Story:** As a portfolio visitor, I want weather icons to be clear and recognizable, so that I can quickly understand conditions

#### Acceptance Criteria

1. THE Weather Widget SHALL use appropriate icons for different weather conditions (sun, cloud, rain, snow, etc.)
2. THE Weather Widget SHALL display moon icon for nighttime clear conditions
3. THE weather icons SHALL be vector-based (SVG) for crisp rendering at any size
4. THE weather icons SHALL use colors appropriate to the condition (yellow sun, blue rain, etc.)
5. THE weather icons SHALL be accessible with appropriate aria-labels
