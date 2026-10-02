import { useRef, useCallback, useEffect } from 'react';
import { 
  type SpringConfig, 
  FLUID_PRESETS, 
  VelocityTracker, 
  calculateRubberBand, 
  stepSpring1D, 
  isSpring1DSettled, 
  calculateAmbientLevitation 
} from './fluidPhysics';

export interface UseFluidDraggableOptions {
  config?: SpringConfig;
  axis?: 'x' | 'y' | 'both';
  dismissThreshold?: number;
  dismissVelocity?: number;
  onDismiss?: () => void;
  ambientLevitation?: boolean;
}

export function useFluidDraggable<T extends HTMLElement = HTMLDivElement>({
  config = FLUID_PRESETS.weightlessModal,
  axis = 'both',
  dismissThreshold = 140,
  dismissVelocity = 650,
  onDismiss,
  ambientLevitation = false
}: UseFluidDraggableOptions = {}) {
  const elementRef = useRef<T | null>(null);

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const springX = useRef({ current: 0, target: 0, velocity: 0 });
  const springY = useRef({ current: 0, target: 0, velocity: 0 });

  const tracker = useRef(new VelocityTracker());
  const rafId = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);

  // Direct render transform writer on GPU
  const writeTransform = useCallback((x: number, y: number, ambientOffset = { x: 0, y: 0, rotateDeg: 0 }) => {
    if (!elementRef.current) return;
    const finalX = x + ambientOffset.x;
    const finalY = y + ambientOffset.y;
    elementRef.current.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) rotate(${ambientOffset.rotateDeg.toFixed(2)}deg)`;
  }, []);

  // Animation Loop for Inertial Drift & Spring Return
  const startPhysicsLoop = useCallback(() => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);

    const loop = (now: number) => {
      if (lastTime.current === null) lastTime.current = now;
      const dt = (now - lastTime.current) / 1000;
      lastTime.current = now;

      if (!isDragging.current) {
        springX.current = stepSpring1D(springX.current, config, dt);
        springY.current = stepSpring1D(springY.current, config, dt);

        const settledX = isSpring1DSettled(springX.current);
        const settledY = isSpring1DSettled(springY.current);

        let ambient = { x: 0, y: 0, rotateDeg: 0 };
        if (ambientLevitation) {
          ambient = calculateAmbientLevitation(now, 1.0);
        }

        writeTransform(springX.current.current, springY.current.current, ambient);

        if (!settledX || !settledY || ambientLevitation) {
          rafId.current = requestAnimationFrame(loop);
          return;
        }
      }
    };

    rafId.current = requestAnimationFrame(loop);
  }, [config, ambientLevitation, writeTransform]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Catch mid-flight!
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offset.current = { x: springX.current.current, y: springY.current.current };

    tracker.current.reset();
    tracker.current.addPoint(e.clientX, e.clientY);

    // Stop currently running spring loop cleanly
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // Capture pointer
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;

    tracker.current.addPoint(e.clientX, e.clientY);

    const deltaX = axis === 'y' ? 0 : e.clientX - dragStart.current.x;
    const deltaY = axis === 'x' ? 0 : e.clientY - dragStart.current.y;

    // Apply magnetic rubber banding past boundary
    const rawX = offset.current.x + deltaX;
    const rawY = offset.current.y + deltaY;

    // Magnetic resistance
    const finalX = calculateRubberBand(rawX, window.innerWidth || 800, 0.6);
    const finalY = calculateRubberBand(rawY, window.innerHeight || 800, 0.6);

    springX.current.current = finalX;
    springY.current.current = finalY;

    writeTransform(finalX, finalY);
  }, [axis, writeTransform]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Release pointer capture cleanly
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Capture exit velocity vector (vx, vy)
    const { vx, vy } = tracker.current.getVelocity();

    // Check for swipe-to-dismiss threshold or velocity launch
    const shouldDismissX = Math.abs(springX.current.current) > dismissThreshold || Math.abs(vx) > dismissVelocity;
    const shouldDismissY = Math.abs(springY.current.current) > dismissThreshold || Math.abs(vy) > dismissVelocity;

    if (onDismiss && (shouldDismissX || shouldDismissY)) {
      // Launch off-screen with velocity handoff
      springX.current.target = Math.sign(vx || springX.current.current) * 600;
      springY.current.target = Math.sign(vy || springY.current.current) * 600;
      springX.current.velocity = vx;
      springY.current.velocity = vy;
      startPhysicsLoop();
      setTimeout(() => onDismiss(), 250);
      return;
    }

    // Velocity handoff: feed release speed into spring recoil
    springX.current.target = 0;
    springY.current.target = 0;
    springX.current.velocity = vx;
    springY.current.velocity = vy;

    startPhysicsLoop();
  }, [dismissThreshold, dismissVelocity, onDismiss, startPhysicsLoop]);

  // Clean-up
  useEffect(() => {
    startPhysicsLoop();
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [startPhysicsLoop]);

  return {
    ref: elementRef,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      style: { touchAction: 'none', willChange: 'transform' } as React.CSSProperties
    }
  };
}
