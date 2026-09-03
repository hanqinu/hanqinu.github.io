import React, { useRef, useEffect } from 'react';
import Matter from 'matter-js';
import { soundEngine } from '@/utils/audio';

type ParticleShape = '+' | 'x' | 'o' | 'tri' | 'sq' | 'diamond' | 'dot';

interface CustomPluginData {
  shape: ParticleShape;
  size: number;
  alpha: number;
}

export default function ParticleWaveSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);

  const mouse = useRef({
    x: -2000,
    y: -2000,
    prevX: -2000,
    prevY: -2000,
    vx: 0,
    vy: 0,
    speed: 0,
    active: false,
  });

  const lastSoundTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const { Engine, World, Bodies, Body } = Matter;

    // Create Matter.js physics engine with sleep enabled for rock-solid stability
    const engine = Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: 0.9, scale: 0.001 },
    });
    engineRef.current = engine;

    let ground: Matter.Body;
    let ceiling: Matter.Body;
    let leftWall: Matter.Body;
    let rightWall: Matter.Body;

    const initSimulation = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = Math.max(rect.height, 700);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Clear world
      World.clear(engine.world, false);
      bodiesRef.current = [];

      // 4-Sided Solid Boundaries strictly enclosing Screen 4 (Cannot escape Screen 4!)
      const wallThickness = 120;
      ground = Bodies.rectangle(
        width / 2,
        height + wallThickness / 2 - 14,
        width * 2,
        wallThickness,
        {
          isStatic: true,
          friction: 0.95,
        },
      );
      // Solid top ceiling
      ceiling = Bodies.rectangle(width / 2, -wallThickness / 2 + 10, width * 2, wallThickness, {
        isStatic: true,
        friction: 0.4,
        restitution: 0.4, // Bounces downward on ceiling contact
      });
      leftWall = Bodies.rectangle(-wallThickness / 2 + 10, height / 2, wallThickness, height * 2, {
        isStatic: true,
        friction: 0.5,
      });
      rightWall = Bodies.rectangle(
        width + wallThickness / 2 - 10,
        height / 2,
        wallThickness,
        height * 2,
        {
          isStatic: true,
          friction: 0.5,
        },
      );

      World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

      // Initialize rigid particle sand bed across lower half (denser, richer distribution)
      const shapes: ParticleShape[] = ['+', 'x', 'o', 'tri', 'sq', 'diamond', 'dot'];
      const step = 23; // Denser spacing for significantly more particles
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);
      const newBodies: Matter.Body[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const normX = c / cols;
          const normY = r / rows;

          // Initial beach dune slope with slightly higher coverage for a lush particle sea
          const duneTop = 0.54 - normX * 0.16 + Math.sin(normX * Math.PI * 1.8) * 0.04;

          if (normY >= duneTop) {
            const jitterX = (Math.random() - 0.5) * 5;
            const jitterY = (Math.random() - 0.5) * 5;
            const px = c * step + jitterX;
            const py = Math.min(height - 24, r * step + jitterY);

            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            // Sized to maintain visual clarity while fitting densely: dot 5.2px, shapes 8.8px
            const radius = shape === 'dot' ? 5.2 : 8.8;

            const b = Bodies.circle(px, py, radius, {
              friction: 0.62, // Responsive rolling and sliding
              frictionAir: 0.03, // Light air resistance so particles travel nicely
              restitution: 0.12, // Slight bounce
              density: 0.0008, // Agile mass for responsive movement
              sleepThreshold: 25, // Quick sleeping for optimal rendering performance
            });

            // Attach rendering metadata
            (b as unknown as { customData: CustomPluginData }).customData = {
              shape,
              size: radius,
              alpha: Math.random() * 0.35 + 0.65,
            };

            newBodies.push(b);
          }
        }
      }

      World.add(engine.world, newBodies);
      bodiesRef.current = newBodies;
    };

    initSimulation();
    window.addEventListener('resize', initSimulation);

    // Mouse velocity & dragging tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const pX = mouse.current.prevX === -2000 ? mx : mouse.current.prevX;
      const pY = mouse.current.prevY === -2000 ? my : mouse.current.prevY;

      const rawVx = mx - pX;
      const rawVy = my - pY;
      const spd = Math.sqrt(rawVx * rawVx + rawVy * rawVy);

      const maxSpd = 40;
      const scale = spd > maxSpd ? maxSpd / spd : 1.0;

      mouse.current = {
        x: mx,
        y: my,
        prevX: mx,
        prevY: my,
        vx: rawVx * scale,
        vy: rawVy * scale,
        speed: spd * scale,
        active: true,
      };

      const now = performance.now();
      if (spd > 260 && now - lastSoundTime.current > 180) {
        soundEngine.playBoing();
        lastSoundTime.current = now;
      }
    };

    const onMouseEnter = () => {
      mouse.current.active = true;
    };

    const onMouseLeave = () => {
      mouse.current.active = false;
      mouse.current.prevX = -2000;
      mouse.current.prevY = -2000;
      mouse.current.vx = 0;
      mouse.current.vy = 0;
      mouse.current.speed = 0;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      soundEngine.playLaser(780);

      // Shockwave surge on click (gentler, controlled blast)
      const bodies = bodiesRef.current;
      const blastRadius = 190;
      const blastRadiusSq = blastRadius * blastRadius;

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const dx = b.position.x - mx;
        const dy = b.position.y - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < blastRadiusSq && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const falloff = 1.0 - dist / blastRadius;
          const force = falloff * 0.007;

          Matter.Sleeping.set(b, false);
          Body.applyForce(b, b.position, {
            x: (dx / dist) * force,
            y: (dy / dist) * force - force * 0.4,
          });
        }
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('click', onClick);

    // =========================================================================
    // Matter.js Real Rigid Body Physical Loop with Top Ceiling Force & Screen Clamping
    // =========================================================================
    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const mvx = mouse.current.vx;
      const mvy = mouse.current.vy;
      const mSpeed = mouse.current.speed;

      // Active when moving (threshold lowered to 0.8 so normal mouse movements trigger responsive ripples)
      const isDraggingMotion = mouse.current.active && mSpeed >= 0.8;

      const normVx = isDraggingMotion ? mvx / mSpeed : 0;
      const normVy = isDraggingMotion ? mvy / mSpeed : 0;

      // Dynamic wave radius with slightly broader reactive wake
      const dynamicWaveRadius = Math.min(260, Math.max(80, 80 + mSpeed * 4.2));
      const dynamicWaveRadiusSq = dynamicWaveRadius * dynamicWaveRadius;
      // Increased thrust: noticeably punchier and reactive, capped comfortably to prevent screen-escape
      const wavePower = Math.min(0.0105, 0.0016 + mSpeed * 0.00025);

      const bodies = bodiesRef.current;
      const bLen = bodies.length;

      // 1. Apply wave forces while dragging
      if (isDraggingMotion) {
        for (let i = 0; i < bLen; i++) {
          const b = bodies[i];
          const dx = b.position.x - mx;
          const dy = b.position.y - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < dynamicWaveRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const falloff = Math.cos((dist / dynamicWaveRadius) * (Math.PI * 0.5));
            const force = falloff * wavePower;

            // Wake body up from sleep
            Matter.Sleeping.set(b, false);

            Body.applyForce(b, b.position, {
              x: (normVx * 0.72 + (dx / dist) * 0.28) * force,
              y: (normVy * 0.45 - 0.42) * force, // Lively upward scoop for visible wave splashes
            });

            Body.setAngularVelocity(b, b.angularVelocity + (Math.random() - 0.5) * 0.04 * falloff);
          }
        }
      }

      // 2. Step Matter.js Physics Engine
      Engine.update(engine, 1000 / 60);

      // -----------------------------------------------------------------------
      // 3. Boundary Restriction & Top Ceiling Downward Force
      // "粒子只在当前屏移动，不要一下推出第四屏的范围了，触碰到上顶部时应该会有个向下的力"
      // -----------------------------------------------------------------------
      for (let i = 0; i < bLen; i++) {
        const b = bodies[i];

        // TOP CEILING: When particles reach near top (y <= 38px), apply downward force and rebound downward
        if (b.position.y <= 38) {
          Matter.Sleeping.set(b, false);

          // Apply strong downward force
          Body.applyForce(b, b.position, { x: 0, y: 0.006 });

          // If still moving upward, rebound with downward velocity
          if (b.velocity.y < 0) {
            Body.setVelocity(b, {
              x: b.velocity.x * 0.85,
              y: Math.max(2.8, Math.abs(b.velocity.y) * 0.65),
            });
          }

          // Hard lock at top so it never escapes Screen 4
          if (b.position.y < 14) {
            Body.setPosition(b, { x: b.position.x, y: 14 });
          }
        }

        // LEFT WALL CLAMP
        if (b.position.x < 14) {
          Body.setPosition(b, { x: 14, y: b.position.y });
          if (b.velocity.x < 0) {
            Body.setVelocity(b, { x: Math.abs(b.velocity.x) * 0.5, y: b.velocity.y });
          }
        }
        // RIGHT WALL CLAMP
        else if (b.position.x > width - 14) {
          Body.setPosition(b, { x: width - 14, y: b.position.y });
          if (b.velocity.x > 0) {
            Body.setVelocity(b, { x: -Math.abs(b.velocity.x) * 0.5, y: b.velocity.y });
          }
        }

        // BOTTOM GROUND CLAMP
        if (b.position.y > height - 16) {
          Body.setPosition(b, { x: b.position.x, y: height - 16 });
          if (b.velocity.y > 0) {
            Body.setVelocity(b, { x: b.velocity.x * 0.75, y: 0 });
          }
        }
      }

      // 4. Render Non-Overlapping Rigid Bodies
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';

      for (let i = 0; i < bLen; i++) {
        const b = bodies[i];
        const custom = (b as unknown as { customData: CustomPluginData }).customData;
        if (!custom) continue;

        const { shape, size, alpha } = custom;
        const speed = b.speed;
        const waveGlint = Math.min(0.35, speed * 0.05);

        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);

        ctx.globalAlpha = Math.min(1.0, alpha + waveGlint);
        ctx.lineWidth = 1.8;

        const s = size + waveGlint * 1.0;

        switch (shape) {
          case '+':
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
            break;

          case 'x':
            ctx.beginPath();
            ctx.moveTo(-s * 0.7, -s * 0.7);
            ctx.lineTo(s * 0.7, s * 0.7);
            ctx.moveTo(s * 0.7, -s * 0.7);
            ctx.lineTo(-s * 0.7, s * 0.7);
            ctx.stroke();
            break;

          case 'o':
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
            ctx.stroke();
            break;

          case 'tri':
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.86, s * 0.6);
            ctx.lineTo(-s * 0.86, s * 0.6);
            ctx.closePath();
            ctx.fill();
            break;

          case 'sq':
            ctx.fillRect(-s * 0.6, -s * 0.6, s * 1.2, s * 1.2);
            break;

          case 'diamond':
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.8, 0);
            ctx.lineTo(0, s);
            ctx.lineTo(-s * 0.8, 0);
            ctx.closePath();
            ctx.stroke();
            break;

          case 'dot':
          default:
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();
      }

      // Mouse speed decay
      mouse.current.vx *= 0.8;
      mouse.current.vy *= 0.8;
      mouse.current.speed *= 0.8;
      if (mouse.current.speed < 0.3) {
        mouse.current.speed = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', initSimulation);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('click', onClick);
      Engine.clear(engine);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="screen-4-particles"
      className="relative w-full h-[100vh] min-h-[700px] select-none overflow-hidden text-white flex flex-col justify-center items-center cursor-crosshair z-40"
      style={{
        backgroundColor: '#000000', // Pure pitch black
      }}
    >
      {/* Strictly Enclosed Matter.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating Center Minimal Info - Exactly in center, leaving bottom 100% open for complete wave */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center gap-2.5 text-center select-none">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>HANQIN // STUDIO · INTERACTIVE CRAFT</span>
        </div>
        <div className="px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-mono tracking-widest text-white/70 shadow-2xl">
          [ SWEEP MOUSE ACROSS GEOMETRIC FLUID WAVE ]
        </div>
      </div>
    </section>
  );
}
