import { useRef, useEffect } from 'react';
import { useBoolean, useEventListener } from 'ahooks';
import { useMousePosition } from '@/hooks/useMousePosition';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface ClickShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export default function CursorSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useMousePosition();
  const [enabled, { setTrue: setEnabledTrue }] = useBoolean(false);

  const pos = useRef({ x: -200, y: -200 });
  const lastPos = useRef({ x: -200, y: -200 });
  const particles = useRef<Particle[]>([]);
  const shockwaves = useRef<ClickShockwave[]>([]);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isTouch && !reducedMotion) {
      setEnabledTrue();
    }
  }, []);

  // Global click event to spawn shockwaves
  const handleClick = (e: MouseEvent) => {
    if (!enabled) return;
    // Don't trigger if clicked on interactive buttons that have their own sounds
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a'))
    ) {
      return;
    }

    const colors = ['#ff5e00', '#06b6d4', '#ec4899', '#facc15', '#a3e635'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    shockwaves.current.push({
      x: e.clientX,
      y: e.clientY,
      radius: 10,
      maxRadius: 120,
      alpha: 0.8,
      color: chosenColor,
    });

    // Spawn burst of particles on click
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const speed = Math.random() * 4 + 2;
      particles.current.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color: chosenColor,
        alpha: 1,
        life: 0,
        maxLife: 35 + Math.random() * 20,
      });
    }
  };

  useEventListener('click', handleClick, { target: () => window });

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  };

  useEventListener('resize', resizeCanvas, { target: () => window });

  // Main 60 FPS Canvas Render Loop
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    resizeCanvas();

    const colors = ['#ff5e00', '#06b6d4', '#ec4899', '#facc15', '#a3e635'];

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Smooth lerp mouse follow
      pos.current.x += (mouse.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.y - pos.current.y) * 0.18;

      const dx = pos.current.x - lastPos.current.x;
      const dy = pos.current.y - lastPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Draw Ambient Glow Spotlight
      const gradient = ctx.createRadialGradient(
        pos.current.x,
        pos.current.y,
        0,
        pos.current.x,
        pos.current.y,
        320,
      );
      gradient.addColorStop(0, 'rgba(255, 94, 0, 0.09)');
      gradient.addColorStop(0.4, 'rgba(99, 102, 241, 0.03)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.current.x, pos.current.y, 320, 0, Math.PI * 2);
      ctx.fill();

      // Emit trail particles if moving
      if (speed > 1.5 && particles.current.length < 80) {
        const count = Math.min(Math.floor(speed / 4) + 1, 3);
        for (let i = 0; i < count; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          particles.current.push({
            x: pos.current.x + (Math.random() - 0.5) * 8,
            y: pos.current.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.5 - dx * 0.1,
            vy: (Math.random() - 0.5) * 1.5 - dy * 0.1,
            size: Math.random() * 4 + 2,
            color,
            alpha: 0.9,
            life: 0,
            maxLife: 28 + Math.random() * 15,
          });
        }
      }

      lastPos.current = { x: pos.current.x, y: pos.current.y };

      // Update and draw Shockwaves
      for (let i = shockwaves.current.length - 1; i >= 0; i--) {
        const sw = shockwaves.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.12;
        sw.alpha *= 0.92;

        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (sw.alpha < 0.02 || sw.radius >= sw.maxRadius - 2) {
          shockwaves.current.splice(i, 1);
        }
      }

      // Update and draw Particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - (p.life / p.maxLife) * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [enabled, mouse.x, mouse.y]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
}
