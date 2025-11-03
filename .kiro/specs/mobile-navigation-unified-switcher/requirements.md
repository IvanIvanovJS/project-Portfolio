# Requirements Document

## Introduction

Тази функционалност цели да подобри мобилната навигация чрез интегриране на UnifiedSwitcher компонента (с light/dark/toggle navigation) директно в отвореното мобилно меню. Когато менюто е затворено, ще се показва само заглавието и бургер бутона, без други контроли.

## Glossary

- **MobileHeader**: Компонент за мобилния header, който се показва когато менюто е затворено
- **MobileNavigation**: Компонент за мобилната навигация, който се показва когато менюто е отворено
- **UnifiedSwitcher**: Компонент, който комбинира theme toggle (light/dark) и navigation mode toggle в един контрол
- **NavigationToggle**: Стар отделен компонент за превключване на навигационния режим (ще бъде премахнат)
- **ThemeToggle**: Стар отделен компонент за превключване на темата (ще бъде премахнат)

## Requirements

### Requirement 1

**User Story:** Като потребител на мобилно устройство, искам да виждам само заглавието и бургер менюто когато навигацията е затворена, за да имам чист и минималистичен интерфейс.

#### Acceptance Criteria

1. WHEN мобилната навигация е затворена, THE MobileHeader SHALL показва само заглавието "Portfolio" и бургер бутона
2. WHEN мобилната навигация е затворена, THE MobileHeader SHALL NOT показва UnifiedSwitcher компонента
3. THE MobileHeader SHALL запазва glassmorphism стила и визуалната си идентичност

### Requirement 2

**User Story:** Като потребител на мобилно устройство, искам да виждам всички контроли (light/dark/navigation toggle) в отвореното меню, за да мога лесно да управлявам настройките.

#### Acceptance Criteria

1. WHEN мобилната навигация е отворена, THE MobileNavigation SHALL показва UnifiedSwitcher компонента в footer секцията
2. THE UnifiedSwitcher SHALL съдържа три бутона: Light theme, Dark theme, и Navigation mode toggle
3. THE MobileNavigation SHALL NOT показва отделните NavigationToggle и ThemeToggle компоненти
4. THE UnifiedSwitcher SHALL използва същия стил и поведение като desktop версията

### Requirement 3

**User Story:** Като потребител, искам всички контроли да работят коректно в мобилното меню, за да мога да сменям темата и навигационния режим.

#### Acceptance Criteria

1. WHEN потребителят кликне на Light бутона в UnifiedSwitcher, THE System SHALL превключва темата на light mode
2. WHEN потребителят кликне на Dark бутона в UnifiedSwitcher, THE System SHALL превключва темата на dark mode
3. WHEN потребителят кликне на Navigation toggle бутона, THE System SHALL превключва между horizontal и vertical navigation режими
4. THE UnifiedSwitcher SHALL показва визуално активното състояние за текущата тема
5. THE UnifiedSwitcher SHALL показва правилната икона за текущия navigation mode (LayoutGrid за horizontal, Menu за vertical)

### Requirement 4

**User Story:** Като разработчик, искам кодът да бъде чист и поддържаем, като премахва неизползваните компоненти.

#### Acceptance Criteria

1. THE MobileHeader SHALL NOT импортира или използва UnifiedSwitcher компонента
2. THE MobileNavigation SHALL премахва импортите за NavigationToggle и ThemeToggle
3. THE MobileNavigation SHALL добавя импорт за UnifiedSwitcher
4. THE MobileNavigation footer SHALL използва само UnifiedSwitcher компонента
