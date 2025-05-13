import { animate, spring, stagger } from 'motion';

// Helper functions for animations
export const animateIn = (element: HTMLElement, delay: number = 0) => {
  return animate(
    element,
    { opacity: [0, 1], y: [20, 0] },
    { delay, duration: 0.5, easing: spring() }
  );
};

export const animateStagger = (elements: HTMLElement[], delay: number = 0) => {
  return animate(
    elements,
    { opacity: [0, 1], y: [20, 0] },
    { delay, duration: 0.5, easing: spring(), delay: stagger(0.1) }
  );
};

export const animateHover = (element: HTMLElement) => {
  return animate(element, { scale: 1.05 }, { duration: 0.2 });
};

export const animateTap = (element: HTMLElement) => {
  return animate(element, { scale: 0.95 }, { duration: 0.1 });
};

export const animateExit = (element: HTMLElement) => {
  return animate(element, { opacity: 0, y: -20 }, { duration: 0.3 });
};

// Custom hooks for animations will be added here
