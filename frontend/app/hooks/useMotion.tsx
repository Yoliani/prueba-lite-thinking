import { useRef, useEffect } from 'react';
import { animate, spring, stagger } from 'motion';

type AnimationOptions = {
  delay?: number;
  duration?: number;
  easing?: any;
};

export const useMotion = () => {
  const ref = useRef<HTMLElement | null>(null);

  const animateIn = (options: AnimationOptions = {}) => {
    if (!ref.current) return;
    
    animate(
      ref.current,
      { opacity: [0, 1], y: [20, 0] },
      { 
        delay: options.delay || 0, 
        duration: options.duration || 0.5, 
        easing: options.easing || spring() 
      }
    );
  };

  const animateHover = () => {
    if (!ref.current) return;
    
    animate(
      ref.current,
      { scale: 1.05 },
      { duration: 0.2 }
    );
  };

  const animateTap = () => {
    if (!ref.current) return;
    
    animate(
      ref.current,
      { scale: 0.95 },
      { duration: 0.1 }
    );
  };

  const animateExit = (callback?: () => void) => {
    if (!ref.current) {
      if (callback) callback();
      return;
    }
    
    animate(
      ref.current,
      { opacity: 0, y: -20 },
      { 
        duration: 0.3,
        onComplete: () => {
          if (callback) callback();
        }
      }
    );
  };

  return {
    ref,
    animateIn,
    animateHover,
    animateTap,
    animateExit
  };
};

export default useMotion;
