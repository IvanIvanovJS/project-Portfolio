# Requirements Document

## Introduction

Този документ описва изискванията за създаване на portfolio сайт за software engineer с glassmorphism дизайн, използвайки Next.js, React, TypeScript, Chakra UI, Framer Motion, Lucide React и Three.js. Сайтът ще бъде responsive и ще се деплойва на Vercel.

## Glossary

- **Portfolio_Site**: Уеб приложението за представяне на професионални проекти и умения
- **Glassmorphism_Component**: UI компонент с прозрачен glass ефект, blur и highlight
- **Theme_System**: Система за превключване между светла и тъмна тема
- **Navigation_Bar**: Хоризонтална навигационна лента в горната част на сайта
- **Hero_Section**: Главната секция с 3D елементи и call-to-action бутон
- **Projects_Gallery**: Секция с карти показващи завършени проекти
- **About_Carousel**: Секция с carousel от изображения и лична информация
- **Three_Scene**: 3D сцена рендерирана с Three.js
- **CTA_Button**: Call-to-action бутон с glassmorphism стил
- **Mobile_Viewport**: Екрани с ширина под 768px
- **Desktop_Viewport**: Екрани с ширина над 768px

## Requirements

### Requirement 1

**User Story:** Като посетител на сайта, искам да видя професионално portfolio с модерен glassmorphism дизайн, за да получа добро впечатление за уменията на разработчика.

#### Acceptance Criteria

1. WHEN посетителят зареди сайта, THE Portfolio_Site SHALL показва glassmorphism дизайн с прозрачни елементи и blur ефекти
2. THE Portfolio_Site SHALL използва цветовата схема за тъмна тема с background #171717, foreground white-80% и primary color #baffe9
3. THE Portfolio_Site SHALL използва цветовата схема за светла тема с background light-white, foreground #171717-80% и primary color #ff8800
4. THE Portfolio_Site SHALL рендерира всички glassmorphism компоненти с backdrop-filter blur ефект
5. THE Portfolio_Site SHALL показва професионален и модерен външен вид съответстващ на референтните CSS файлове

### Requirement 2

**User Story:** Като посетител използващ мобилно устройство, искам сайтът да се показва правилно на моя екран, за да мога да разглеждам съдържанието удобно.

#### Acceptance Criteria

1. WHEN посетителят отвори сайта на Mobile_Viewport, THE Portfolio_Site SHALL адаптира layout-а за мобилни екрани
2. THE Portfolio_Site SHALL показва responsive navigation подходяща за докосване
3. THE Portfolio_Site SHALL запазва glassmorphism ефектите на мобилни устройства
4. THE Portfolio_Site SHALL осигурява добра производителност на мобилни устройства
5. WHILE посетителят използва мобилно устройство, THE Portfolio_Site SHALL показва оптимизирани размери на текст и елементи

### Requirement 3

**User Story:** Като посетител, искам да навигирам лесно из различните секции на сайта, за да мога да намеря информацията която търся.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL показва Navigation_Bar в горната част на всички страници
2. WHEN посетителят кликне върху навигационен линк, THE Portfolio_Site SHALL скролира плавно до съответната секция
3. THE Portfolio_Site SHALL подчертава активната секция в навигацията
4. THE Navigation_Bar SHALL използва glassmorphism стил съответстващ на общия дизайн
5. THE Navigation_Bar SHALL остава достъпна при скролиране

### Requirement 4

**User Story:** Като посетител, искам да видя впечатляваща hero секция с 3D елементи, за да получа силно първо впечатление.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL показва Hero_Section като първа секция на страницата
2. THE Hero_Section SHALL съдържа Three_Scene с 3D glassmorphism елементи
3. THE Hero_Section SHALL включва CTA_Button със стил от glassButton.css
4. WHEN посетителят кликне CTA_Button, THE Portfolio_Site SHALL изпълнява определено действие
5. THE Three_Scene SHALL рендерира плавни 3D анимации

### Requirement 5

**User Story:** Като потенциален клиент, искам да видя проектите на разработчика в атрактивен формат, за да оценя неговите умения.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL показва Projects_Gallery секция с проектни карти
2. THE Projects_Gallery SHALL използва glassmorphism карти със стил от glassCard.css
3. WHEN посетителят hover върху проектна карта, THE Portfolio_Site SHALL показва hover ефект
4. THE Projects_Gallery SHALL показва изображение и описание за всеки проект
5. THE Projects_Gallery SHALL бъде responsive за различни размери екрани

### Requirement 6

**User Story:** Като посетител, искам да науча повече за разработчика чрез лична информация и снимки, за да получа по-добра представа за него.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL показва About_Carousel секция с лични изображения
2. THE About_Carousel SHALL позволява навигация между различни изображения
3. THE Portfolio_Site SHALL показва лична информация до carousel-а
4. THE About_Carousel SHALL използва glassmorphism стил за контролите
5. THE About_Carousel SHALL бъде responsive за мобилни устройства

### Requirement 7

**User Story:** Като посетител, искам да мога да превключвам между светла и тъмна тема, за да използвам сайта според предпочитанията си.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL предоставя Theme_System за превключване между теми
2. WHEN посетителят избере тъмна тема, THE Portfolio_Site SHALL използва цветовете #171717, white-80%, #baffe9
3. WHEN посетителят избере светла тема, THE Portfolio_Site SHALL използва цветовете light-white, #171717-80%, #ff8800
4. THE Theme_System SHALL запазва избраната тема в browser storage
5. THE Portfolio_Site SHALL анимира плавно преходите между теми

### Requirement 8

**User Story:** Като посетител, искам да видя footer с допълнителна информация и контакти, за да мога да се свържа с разработчика.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL показва Footer секция в долната част на страницата
2. THE Footer SHALL съдържа контактна информация
3. THE Footer SHALL използва glassmorphism стил съответстващ на общия дизайн
4. THE Footer SHALL бъде responsive за различни размери екрани
5. THE Footer SHALL включва социални мрежи или други релевантни линкове