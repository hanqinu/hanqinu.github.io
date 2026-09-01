import React, { useRef, useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 1.5 + 0.5;
    this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.6)' : 'rgba(6, 182, 212, 0.6)';
  }

  update(width: number, height: number, mouseX: number, mouseY: number) {
    // Repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      this.vx += (dx / dist) * 0.2;
      this.vy += (dy / dist) * 0.2;
    }

    // Velocity dampening
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Minimum velocity
    if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.1;
    if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.1;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ w: 0, h: 500 });
  const mouse = useMousePosition();

  useEffect(() => {
    const updateSize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.parentElement?.clientWidth || window.innerWidth;
      const h = 500;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      setDimensions({ w, h });

      const count = Math.min(120, Math.floor(w / 10));
      particles.current = Array.from({ length: count }, () => new Particle(w, h));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useAnimationFrame(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const { w, h } = dimensions;

    ctx.clearRect(0, 0, w, h);

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = mouse.x - rect.left;
    const mouseY = mouse.y - rect.top;

    for (let i = 0; i < particles.current.length; i++) {
      const p = particles.current[i];
      p.update(w, h, mouseX, mouseY);
      p.draw(ctx);

      for (let j = i + 1; j < particles.current.length; j++) {
        const p2 = particles.current[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }
    }
  });

  return (
    <section className="relative w-full h-[500px] overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-auto" />
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h2 className="heading-2 text-text/90 tracking-widest uppercase">技术 · 创造 · 探索</h2>
      </div>
    </section>
  );
}
