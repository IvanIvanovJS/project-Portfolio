// Scroll utility functions

export const smoothScrollTo = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const scrollToSection = (sectionId: string): void => {
  // Remove # if present
  const cleanId = sectionId.replace('#', '');

  // Account for fixed header height
  const headerOffset = 80;

  smoothScrollTo(cleanId, headerOffset);
};

export const getScrollProgress = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
};

export const isElementInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const getElementVisibilityPercentage = (element: Element): number => {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  if (rect.bottom < 0 || rect.top > windowHeight) {
    return 0;
  }

  const visibleHeight =
    Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.height;

  return elementHeight > 0 ? (visibleHeight / elementHeight) * 100 : 0;
};

// Debounced scroll handler
export const createScrollHandler = (
  callback: (event: Event) => void,
  delay: number = 16
): ((event: Event) => void) => {
  let timeoutId: NodeJS.Timeout;
  let isScrolling = false;

  const scrollHandler = (event: Event) => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        callback(event);
        isScrolling = false;
      });
      isScrolling = true;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(event);
    }, delay);
  };

  return scrollHandler;
};
