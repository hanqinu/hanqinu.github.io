import React, { useRef, useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

export default function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const [enabled, setEnabled] = useState(false);
  const pos = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isTouch && !reducedMotion) {
      setEnabled(true);
    }
  }, []);

  useAnimationFrame(() => {
    if (!enabled || !spotlightRef.current) return;
    // Smooth lerp follow
    pos.current.x += (mouse.x - pos.current.x) * 0.12;
    pos.current.y += (mouse.y - pos.current.y) * 0.12;

    spotlightRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
  });

  if (!enabled) return null;

  return (
    <div
      ref={spotlightRef}
      className="fixed top-0 left-0 w-[600px] h-[600px] -ml-[300px] -mt-[300px] pointer-events-none z-[1] transition-opacity duration-300"
      style={{
        background: 'radial-gradient(circle 300px at center, rgba(249, 115, 22, 0.08), rgba(99, 102, 241, 0.03) 50%, transparent 75%)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}
