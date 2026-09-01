import React, { useRef, useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isTouch && !reducedMotion) {
      setIsVisible(true);
    }
  }, []);

  useAnimationFrame(() => {
    if (!isVisible || !glowRef.current) return;

    // Lerp
    pos.current.x += (mouse.x - pos.current.x) * 0.1;
    pos.current.y += (mouse.y - pos.current.y) * 0.1;

    glowRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
  });

  if (!isVisible) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] -ml-[200px] -mt-[200px] pointer-events-none z-[100]"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
}
