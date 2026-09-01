import React, { useState, useRef, useEffect } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export default function HeroInteractive() {
  const mouse = useMousePosition();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion physics presets
  const [motionPreset, setMotionPreset] = useState<'snappy' | 'bouncy' | 'fluid'>('bouncy');
  const [accentTheme, setAccentTheme] = useState<'amber' | 'cobalt' | 'emerald'>('amber');
  const [fps, setFps] = useState(60);
  const [velocity, setVelocity] = useState(0);
  const [rippleActive, setRippleActive] = useState(false);

  // Velocity tracking
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

  // Spring Physics Core Element state
  const [springOffset, setSpringOffset] = useState({ x: 0, y: 0, rot: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, startOffset: { x: 0, y: 0 } });
  const animFrame = useRef<number | null>(null);

  // Card perspective tilt calculation
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, spotlightX: 50, spotlightY: 50 });

  // Theme configurations
  const themeConfig = {
    amber: {
      name: 'Solar Amber',
      primary: '#f97316',
      light: '#fb923c',
      glow: 'rgba(249, 115, 22, 0.2)',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      badgeBorder: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
    },
    cobalt: {
      name: 'Cyber Cobalt',
      primary: '#6366f1',
      light: '#818cf8',
      glow: 'rgba(99, 102, 241, 0.2)',
      gradient: 'from-indigo-400 via-blue-500 to-cyan-400',
      badgeBorder: 'border-indigo-500/40',
      badgeBg: 'bg-indigo-500/10',
      badgeText: 'text-indigo-400',
    },
    emerald: {
      name: 'Matrix Emerald',
      primary: '#10b981',
      light: '#34d399',
      glow: 'rgba(16, 185, 129, 0.2)',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      badgeBorder: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
    },
  };

  const currentTheme = themeConfig[accentTheme];

  // Mouse velocity calculation
  useEffect(() => {
    const now = Date.now();
    const dt = (now - lastMousePos.current.time) / 1000;
    if (dt > 0.04) {
      const dx = mouse.x - lastMousePos.current.x;
      const dy = mouse.y - lastMousePos.current.y;
      const speed = Math.round(Math.sqrt(dx * dx + dy * dy) / dt);
      setVelocity(speed);
      lastMousePos.current = { x: mouse.x, y: mouse.y, time: now };
    }
  }, [mouse.x, mouse.y]);

  // Card 2D Tilt & Spotlight Follower
  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = mouse.x - rect.left;
    const y = mouse.y - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    if (x >= -50 && x <= rect.width + 50 && y >= -50 && y <= rect.height + 50) {
      const rx = -((y - rect.height / 2) / (rect.height / 2)) * 4;
      const ry = ((x - rect.width / 2) / (rect.width / 2)) * 4;
      setCardTilt({ rx, ry, spotlightX: Math.max(0, Math.min(100, px)), spotlightY: Math.max(0, Math.min(100, py)) });
    } else {
      setCardTilt((prev) => ({ ...prev, rx: 0, ry: 0 }));
    }
  }, [mouse.x, mouse.y]);

  // FPS Monitor
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Spring Return Simulation
  const triggerSpringReturn = (fromX: number, fromY: number) => {
    let x = fromX;
    let y = fromY;
    let vx = 0;
    let vy = 0;
    let rot = fromX * 0.15;
    let vRot = 0;
    let lastTime = performance.now();

    const params = {
      snappy: { k: 280, c: 24, m: 1.0 },
      bouncy: { k: 180, c: 10, m: 1.0 },
      fluid: { k: 90, c: 18, m: 1.2 },
    }[motionPreset];

    if (animFrame.current) cancelAnimationFrame(animFrame.current);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;

      const fx = -params.k * x - params.c * vx;
      const fy = -params.k * y - params.c * vy;
      const fRot = -params.k * rot - params.c * vRot;

      vx += (fx / params.m) * dt;
      vy += (fy / params.m) * dt;
      vRot += (fRot / params.m) * dt;

      x += vx * dt;
      y += vy * dt;
      rot += vRot * dt;

      setSpringOffset({ x, y, rot });

      if (Math.abs(x) > 0.2 || Math.abs(y) > 0.2 || Math.abs(vx) > 0.2) {
        animFrame.current = requestAnimationFrame(step);
      } else {
        setSpringOffset({ x: 0, y: 0, rot: 0 });
      }
    };

    animFrame.current = requestAnimationFrame(step);
  };

  // Drag Handlers for Spring Core
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startOffset: { ...springOffset },
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setSpringOffset({
      x: dragStart.current.startOffset.x + dx,
      y: dragStart.current.startOffset.y + dy,
      rot: dx * 0.12,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    triggerSpringReturn(springOffset.x, springOffset.y);
  };

  const triggerPulseRipple = () => {
    setRippleActive(true);
    triggerSpringReturn(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 60,
    );
    setTimeout(() => setRippleActive(false), 800);
  };

  const titleChars = "HANQIN".split('');

  return (
    <section
      ref={heroRef}
      className="relative min-h-[94vh] w-full flex flex-col justify-center pt-28 pb-20 overflow-hidden bg-grid-pattern"
    >
      {/* Dynamic Ambient Atmospheric Optics */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] rounded-full pointer-events-none transition-all duration-700 blur-[150px] opacity-25 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${currentTheme.glow}, transparent 70%)`,
        }}
      />

      <div className="section-container w-full relative z-10">
        {/* Main Grid: Left Typographic Narrative + Right Hologram Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Understated, Formidable Engineer Narrative */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Engineering Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 glass-panel text-xs font-mono text-white/90 mb-7 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-wider text-white">HANQIN</span>
              <span className="text-white/20">|</span>
              <span className="text-white/60">DESIGN TECHNOLOGIST</span>
            </div>

            {/* Main Typographic Display */}
            <div className="mb-6">
              <span className="font-mono text-xs text-amber-500/90 tracking-widest uppercase block mb-3 font-semibold">
                [01] // ALGORITHMIC RIGOR & CRAFT
              </span>
              <h1 className="heading-hero text-white tracking-tighter select-none flex flex-wrap items-baseline gap-x-3.5">
                <span className="flex text-gradient-silver">
                  {titleChars.map((char, i) => (
                    <span
                      key={i}
                      className="inline-block transition-transform duration-200 hover:-translate-y-2 hover:text-white cursor-default"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                  · CRAFT
                </span>
              </h1>
            </div>

            {/* Low-Key, High-Mastery Statement */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl mb-9 font-normal">
              代码即手艺，毫秒见真章。专注于界面渲染性能、流体物理动力学与微交互工程。将复杂的物理状态机与渲染管线，隐入自然无声的亚像素交互之中。
            </p>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="/demos"
                className="relative px-7 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center gap-2.5 border border-white/15 bg-white/10 backdrop-blur-lg"
              >
                <div
                  className="absolute inset-0 opacity-80 hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.glow}, rgba(255,255,255,0.06))`,
                  }}
                />
                <span className="relative z-10 font-mono font-medium">探索实验画廊 (Demos)</span>
                <span className="relative z-10 font-mono text-xs opacity-70">&rarr;</span>
              </a>

              <a
                href="#bento-labs"
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-medium text-white/70 hover:text-white glass-panel hover:border-white/25 transition-all duration-300 flex items-center gap-2 shadow-md"
              >
                <span>微交互工程实验室</span>
                <span className="font-mono text-xs text-white/40">↓</span>
              </a>
            </div>

            {/* Telemetry Metrics Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/40 pt-4 border-t border-white/10 w-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-white/80 font-bold">{fps} FPS</span>
                <span>RENDER LOOP</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white/80 font-bold">&lt; 0.01px</span>
                <span>SUB-PIXEL PRECISION</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white/80 font-bold">0ms</span>
                <span>LAYOUT JANK</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specular Glint Interactive Hologram Workbench */}
          <div className="lg:col-span-6">
            <div
              ref={cardRef}
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
                transition: isDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/15 relative overflow-hidden shadow-2xl"
            >
              {/* Dynamic Specular Edge Glint Follower */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(400px circle at ${cardTilt.spotlightX}% ${cardTilt.spotlightY}%, rgba(255,255,255,0.15), transparent 80%)`,
                }}
              />

              {/* Window Header Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-6 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-mono text-xs text-white/50">hanqin-kinetics-workbench.tsx</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                  <span>● ENGINE_ACTIVE</span>
                </div>
              </div>

              {/* Interactive Spring Physics Canvas Stage */}
              <div className="relative h-56 rounded-2xl bg-black/70 border border-white/10 flex flex-col items-center justify-center overflow-hidden mb-6 select-none shadow-inner z-10">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />

                {/* Ripple Effect Ring */}
                {rippleActive && (
                  <div
                    className="absolute w-36 h-36 rounded-full border-2 border-amber-400 pointer-events-none animate-ping"
                  />
                )}

                {/* Top Stage Label */}
                <div className="absolute top-3 left-4 text-[10px] font-mono text-white/40 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>SPRING TACTILE CORE (DRAG & TOSS TO BENCHMARK)</span>
                </div>

                {/* Center Draggable Spring Core Disk */}
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  style={{
                    transform: `translate3d(${springOffset.x}px, ${springOffset.y}px, 0) rotate(${springOffset.rot}deg)`,
                    boxShadow: `0 12px 35px -5px ${currentTheme.glow}`,
                  }}
                  className="cursor-grab active:cursor-grabbing px-6 py-4 rounded-2xl bg-surface-100/95 border border-white/25 hover:border-white/60 text-white font-mono flex items-center gap-3.5 transition-shadow relative z-10"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    ⚡
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white tracking-wider">HANQIN_CORE</span>
                    <span className="text-[10px] text-white/50 font-mono">
                      DELTA: [{Math.round(springOffset.x)}, {Math.round(springOffset.y)}]
                    </span>
                  </div>
                </div>

                {/* Bottom Stage Info */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>PRESET: {motionPreset.toUpperCase()}</span>
                  <span className="text-amber-400/90 font-medium">HOOKE-NEWTON DAMPED OSCILLATOR</span>
                </div>
              </div>

              {/* Workbench High-Contrast Precision Controls */}
              <div className="space-y-3.5 relative z-10">
                {/* Control Row 1: Motion Physics Preset */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>🕹️ 动效手感模式</span>
                      <span className="text-[10px] font-mono text-white/40 font-normal">(Motion Feel)</span>
                    </span>
                    <span className="text-[10px] text-text-secondary">调节物理弹簧的刚度系数与回弹阻尼</span>
                  </div>

                  {/* High Contrast Segmented Buttons */}
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-200 border border-white/10">
                    {(
                      [
                        { id: 'snappy', label: '⚡ 清脆 Snappy' },
                        { id: 'bouncy', label: '🌊 弹性 Bouncy' },
                        { id: 'fluid', label: '🍃 流体 Fluid' },
                      ] as const
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setMotionPreset(preset.id);
                          triggerSpringReturn(0, -30);
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                          motionPreset === preset.id
                            ? 'bg-amber-500 text-white font-bold shadow-md'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Control Row 2: Color Theme & Pulse Trigger */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Color Swatch Picker */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">🎨 色彩氛围</span>
                      <span className="text-[10px] font-mono text-white/40">{currentTheme.name}</span>
                    </div>

                    <div className="flex items-center gap-2 p-1 rounded-lg bg-surface-200 border border-white/10">
                      {(['amber', 'cobalt', 'emerald'] as const).map((thm) => (
                        <button
                          key={thm}
                          onClick={() => setAccentTheme(thm)}
                          className={`w-6 h-6 rounded-full transition-all ${
                            thm === 'amber'
                              ? 'bg-amber-500'
                              : thm === 'cobalt'
                                ? 'bg-indigo-500'
                                : 'bg-emerald-500'
                          } ${
                            accentTheme === thm
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                              : 'opacity-50 hover:opacity-100'
                          }`}
                          title={themeConfig[thm].name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Interactive Pulse Trigger */}
                  <button
                    onClick={triggerPulseRipple}
                    className="p-3 rounded-xl bg-black/40 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 text-amber-400 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                  >
                    <span>✨ 激发触觉冲击波 (Pulse)</span>
                  </button>
                </div>
              </div>

              {/* Console Telemetry Footer */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 relative z-10">
                <div>
                  POINTER: <span className="text-white/80">X:{Math.round(mouse.x)} Y:{Math.round(mouse.y)}</span>
                </div>
                <div>
                  SPEED: <span className="text-white/80">{velocity} px/s</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
