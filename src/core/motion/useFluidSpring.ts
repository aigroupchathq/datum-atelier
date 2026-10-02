import { useRef, useEffect, useCallback } from 'react';
import { 
  type SpringConfig, 
  FLUID_PRESETS, 
  stepSpring1D, 
  isSpring1DSettled, 
  calculateAmbientLevitation 
} from './fluidPhysics';

export interface UseFluidSpringOptions {
  config?: SpringConfig;
  initialX?: number;
  initialY?: number;
  initialScale?: number;
  targetX?: number;
  targetY?: number;
  targetScale?: number;
  ambientLevitation?: boolean;
  ambientIntensity?: number;
  onSettle?: () => void;
}

export function useFluidSpring<T extends HTMLElement = HTMLDivElement>({
  config = FLUID_PRESETS.weightlessModal,
  initialX = 0,
  initialY = 0,
  initialScale = 1,
  targetX = 0,
  targetY = 0,
  targetScale = 1,
  ambientLevitation = false,
  ambientIntensity = 1.0,
  onSettle
}: UseFluidSpringOptions = {}) {
  const elementRef = useRef<T | null>(null);

  // Mutable physics states stored in refs to bypass React render cycle during 60/120fps physics
  const springX = useRef({ current: initialX, target: targetX, velocity: 0 });
  const springY = useRef({ current: initialY, target: targetY, velocity: 0 });
  const springScale = useRef({ current: initialScale, target: targetScale, velocity: 0 });
  
  const lastTimeRef = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const isSettledRef = useRef<boolean>(false);
  const configRef = useRef<SpringConfig>(config);
  configRef.current = config;

  // Mid-flight interruptibility: updates target without resetting position or velocity
  const setTarget = useCallback((newTarget: { x?: number; y?: number; scale?: number; vx?: number; vy?: number }) => {
    if (newTarget.x !== undefined) springX.current.target = newTarget.x;
    if (newTarget.y !== undefined) springY.current.target = newTarget.y;
    if (newTarget.scale !== undefined) springScale.current.target = newTarget.scale;
    
    // Optional velocity impulse handoff
    if (newTarget.vx !== undefined) springX.current.velocity = newTarget.vx;
    if (newTarget.vy !== undefined) springY.current.velocity = newTarget.vy;

    isSettledRef.current = false;
  }, []);

  // Samples current live coordinates for instantaneous gesture handoff
  const sampleCurrent = useCallback(() => {
    return {
      x: springX.current.current,
      y: springY.current.current,
      scale: springScale.current.current,
      vx: springX.current.velocity,
      vy: springY.current.velocity
    };
  }, []);

  // Update targets if props change without snapping
  useEffect(() => {
    setTarget({ x: targetX, y: targetY, scale: targetScale });
  }, [targetX, targetY, targetScale, setTarget]);

  // Main 120 FPS GPU Physics Loop
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    el.style.willChange = 'transform';

    const loop = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Step X, Y, Scale springs
      springX.current = stepSpring1D(springX.current, configRef.current, dt);
      springY.current = stepSpring1D(springY.current, configRef.current, dt);
      springScale.current = stepSpring1D(springScale.current, configRef.current, dt);

      const settledX = isSpring1DSettled(springX.current);
      const settledY = isSpring1DSettled(springY.current);
      const settledScale = isSpring1DSettled(springScale.current, 0.002, 0.01);

      let finalX = springX.current.current;
      let finalY = springY.current.current;
      let rotateDeg = 0;

      // Apply subtle weightless anti-gravity ambient levitation
      if (ambientLevitation) {
        const drift = calculateAmbientLevitation(now, ambientIntensity);
        finalX += drift.x;
        finalY += drift.y;
        rotateDeg = drift.rotateDeg;
      }

      // Pure GPU transform write — ZERO layout reflow!
      if (elementRef.current) {
        const scaleVal = springScale.current.current;
        elementRef.current.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) scale(${scaleVal.toFixed(4)}) rotate(${rotateDeg.toFixed(2)}deg)`;
      }

      if (settledX && settledY && settledScale && !isSettledRef.current) {
        isSettledRef.current = true;
        onSettle?.();
      }

      // If ambient levitation is enabled, keep looping smoothly; otherwise pause when settled
      if (ambientLevitation || !isSettledRef.current) {
        rafId.current = requestAnimationFrame(loop);
      }
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [ambientLevitation, ambientIntensity, onSettle]);

  return {
    ref: elementRef,
    setTarget,
    sampleCurrent
  };
}
