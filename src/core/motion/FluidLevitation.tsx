import { useRef, useEffect } from 'react';
import type { FC, ReactNode, HTMLAttributes } from 'react';
import { 
  FLUID_PRESETS, 
  stepSpring1D, 
  isSpring1DSettled, 
  calculateAmbientLevitation,
  type SpringConfig 
} from './fluidPhysics';

export interface FluidLevitationProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Spring physics config (defaults to weightless underdamped modal) */
  config?: SpringConfig;
  /** Initial launch Y offset in pixels (defaults to 32px for subtle upward float entry) */
  initialY?: number;
  /** Initial launch scale (defaults to 0.96 for tactile zoom-in) */
  initialScale?: number;
  /** Enable continuous ambient micro-levitation drift */
  ambientLevitation?: boolean;
  /** Amplitude scalar for ambient levitation (defaults to 1.0) */
  ambientIntensity?: number;
}

export const FluidLevitation: FC<FluidLevitationProps> = ({
  children,
  config = FLUID_PRESETS.weightlessModal,
  initialY = 32,
  initialScale = 0.96,
  ambientLevitation = true,
  ambientIntensity = 1.0,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const springY = useRef({ current: initialY, target: 0, velocity: 0 });
  const springScale = useRef({ current: initialScale, target: 1.0, velocity: 0 });
  const springOpacity = useRef({ current: 0, target: 1.0, velocity: 0 });

  const lastTimeRef = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const isSettledRef = useRef<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.style.willChange = 'transform, opacity';

    const loop = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Step physics springs
      springY.current = stepSpring1D(springY.current, config, dt);
      springScale.current = stepSpring1D(springScale.current, config, dt);
      springOpacity.current = stepSpring1D(springOpacity.current, { dampingRatio: 1.0, response: 0.25 }, dt);

      const settledY = isSpring1DSettled(springY.current, 0.05, 0.1);
      const settledScale = isSpring1DSettled(springScale.current, 0.002, 0.01);
      const settledOpacity = isSpring1DSettled(springOpacity.current, 0.01, 0.05);

      let finalX = 0;
      let finalY = springY.current.current;
      let rotateDeg = 0;

      // Ambient anti-gravity levitation
      if (ambientLevitation) {
        const drift = calculateAmbientLevitation(now, ambientIntensity);
        finalX = drift.x;
        finalY += drift.y;
        rotateDeg = drift.rotateDeg;
      }

      if (containerRef.current) {
        const scaleVal = springScale.current.current;
        const opacityVal = Math.min(1.0, Math.max(0, springOpacity.current.current));
        
        containerRef.current.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) scale(${scaleVal.toFixed(4)}) rotate(${rotateDeg.toFixed(2)}deg)`;
        containerRef.current.style.opacity = opacityVal.toFixed(3);
      }

      if (settledY && settledScale && settledOpacity) {
        isSettledRef.current = true;
        if (containerRef.current) {
          containerRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
          containerRef.current.style.opacity = '1';
          containerRef.current.style.willChange = 'auto';
        }
        return;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [config, ambientLevitation, ambientIntensity]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        transform: `translate3d(0, ${initialY}px, 0) scale(${initialScale})`,
        opacity: 0
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
