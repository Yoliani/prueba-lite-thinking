import * as React from "react";
const { useRef, useEffect } = React;
import { animate as motionAnimate, type AnimationOptionsWithValueOverrides } from "motion";

interface AnimationProps {
  children: React.ReactNode;
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: {
    duration?: number;
    delay?: number;
    easing?: string;
  };
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  as?: keyof JSX.IntrinsicElements;
}

export const AnimatedComponent: React.FC<AnimationProps> = ({
  children,
  initial,
  animate,
  transition,
  whileHover,
  whileTap,
  className,
  style,
  onClick,
  as = "div",
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && initial && animate) {
      const options: AnimationOptionsWithValueOverrides = {
        delay: transition?.delay || 0,
        duration: transition?.duration || 0.5,
      };
      
      if (transition?.easing) {
        // @ts-ignore - The motion library does support easing but TypeScript definitions might be incomplete
        options.easing = transition.easing;
      }
      
      motionAnimate(ref.current, animate, options);
    }
  }, [ref, initial, animate, transition]);

  const handleMouseEnter = () => {
    if (ref.current && whileHover) {
      const options: AnimationOptionsWithValueOverrides = { duration: 0.2 };
      motionAnimate(ref.current, whileHover, options);
    }
  };

  const handleMouseLeave = () => {
    if (ref.current && whileHover) {
      // Reset to the animated state
      const options: AnimationOptionsWithValueOverrides = { duration: 0.2 };
      motionAnimate(ref.current, animate || {}, options);
    }
  };

  const handleMouseDown = () => {
    if (ref.current && whileTap) {
      const options: AnimationOptionsWithValueOverrides = { duration: 0.1 };
      motionAnimate(ref.current, whileTap, options);
    }
  };

  const handleMouseUp = () => {
    if (ref.current && whileTap) {
      // Reset to hover state if hovering, otherwise to animated state
      const options: AnimationOptionsWithValueOverrides = { duration: 0.1 };
      motionAnimate(ref.current, whileHover || animate || {}, options);
    }
  };

  const Component = as as any;

  return (
    <Component
      ref={ref}
      className={className}
      style={{ ...style, ...(initial || {}) }}
      onClick={onClick}
      onMouseEnter={whileHover ? handleMouseEnter : undefined}
      onMouseLeave={whileHover ? handleMouseLeave : undefined}
      onMouseDown={whileTap ? handleMouseDown : undefined}
      onMouseUp={whileTap ? handleMouseUp : undefined}
    >
      {children}
    </Component>
  );
};

export default AnimatedComponent;
