import React, { useState, useRef, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useMousePosition } from '@/hooks/useMousePosition';
import { soundEngine } from '@/utils/audio';

export default function HeroInteractive() {
  const mouse = useMousePosition();
  const heroRef = useRef<HTMLDivElement>(null);

  // Sound Engine state
  const [soundOn, { toggle: toggleSoundState }] = useBoolean(true);

  // Colorway Palette Theme
  const [accentTheme, setAccentTheme] = useState<'cobalt' | 'amber' | 'emerald'>('cobalt');

  // Parallax offset for 3D geometric floating elements
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

  const themeConfig = {
    cobalt: {
      name: 'Cobalt Electric',
      primary: '#0d41e1',
      glow: 'rgba(13, 65, 225, 0.35)',
      gradient: 'from-blue-400 via-indigo-500 to-cyan-400',
    },
    amber: {
      name: 'Solar Amber',
      primary: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.35)',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
    },
    emerald: {
      name: 'Spectral Mint',
      primary: '#10b981',
      glow: 'rgba(16, 185, 129, 0.35)',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-400',
    },
  };
  const currentTheme = themeConfig[accentTheme];

  // Letters state for HANQIN
  const titleChars = 'HANQIN'.split('');
  const [charWobbles, setCharWobbles] = useState<number[]>(titleChars.map(() => 0));

  const handleLetterHover = (index: number) => {
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    soundEngine.playNote(notes[index % notes.length], 'sine', 0.18, 0.14);

    setCharWobbles((prev) =>
      prev.map((val, i) => (i === index ? (Math.random() > 0.5 ? -14 : 14) : val)),
    );
    setTimeout(() => {
      setCharWobbles((prev) => prev.map((val, i) => (i === index ? 0 : val)));
    }, 450);
  };

  const toggleSound = () => {
    const next = !soundOn;
    toggleSoundState();
    soundEngine.setEnabled(next);
    if (next) soundEngine.playPop(640);
  };

  // Mouse Velocity & 3D Parallax Calculation
  useEffect(() => {
    const now = Date.now();
    const dt = (now - lastMousePos.current.time) / 1000;
    if (dt > 0.03) {
      const dx = mouse.x - lastMousePos.current.x;
      const dy = mouse.y - lastMousePos.current.y;
      const speed = Math.round(Math.sqrt(dx * dx + dy * dy) / dt);
      setVelocity(speed);
      lastMousePos.current = { x: mouse.x, y: mouse.y, time: now };

      if (typeof window !== 'undefined') {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        setParallax({
          x: ((mouse.x - cx) / cx) * 28,
          y: ((mouse.y - cy) / cy) * 28,
        });
      }
    }
  }, [mouse.x, mouse.y]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[94vh] w-full flex flex-col justify-center items-center pt-28 pb-20 overflow-hidden select-none"
    >
      {/* Dynamic Deep Ambient Atmospheric Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[650px] rounded-full pointer-events-none transition-all duration-1000 blur-[200px] opacity-35 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${currentTheme.glow}, transparent 70%)`,
        }}
      />

      {/* Floating 3D Prismatic Glass Geometric Objects in Parallax Space */}
      <div
        style={{
          transform: `translate3d(${parallax.x * 1.6}px, ${parallax.y * 1.6}px, 0) rotate(12deg)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={() => soundEngine.playLaser(980)}
        className="absolute top-28 right-12 sm:right-24 lg:right-36 z-10 cursor-pointer group hidden sm:block"
        title="Interactive 3D Prismatic Glass Orb"
      >
        <div className="w-28 h-28 rounded-3xl glass-panel p-4 flex flex-col justify-between border border-white/25 shadow-2xl group-hover:scale-110 transition-transform group-hover:border-blue-400/60 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-3xl">
          <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
            <span>MOD_01</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="w-full flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
            <svg
              className="w-10 h-10 animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polygon points="2 17 12 22 22 17" />
              <polygon points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="text-[9px] font-mono text-white/40 tracking-widest text-center">
            SHADERS // 3D
          </div>
        </div>
      </div>

      <div
        style={{
          transform: `translate3d(${-parallax.x * 1.4}px, ${-parallax.y * 1.4}px, 0) rotate(-8deg)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={() => soundEngine.playBurst()}
        className="absolute bottom-32 left-10 sm:left-24 lg:left-32 z-10 cursor-pointer group hidden sm:block"
        title="Interactive Gyroscope Telemetry"
      >
        <div className="w-24 h-24 rounded-3xl glass-panel p-3.5 flex flex-col justify-between border border-white/20 shadow-2xl group-hover:scale-110 transition-transform group-hover:border-cyan-400/60 bg-gradient-to-tl from-white/10 to-white/0 backdrop-blur-3xl">
          <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
            <span>SPEC_X</span>
            <span className="text-cyan-400 font-bold">60FPS</span>
          </div>
          <div className="w-full flex items-center justify-center text-white/70">
            <div className="w-8 h-8 rounded-full border border-white/40 border-dashed animate-spin flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/40 tracking-widest text-center">
            PHYSICS
          </div>
        </div>
      </div>

      {/* Main Expansive Centerpiece Content */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-20 flex flex-col items-center">
        {/* Top Minimalist Luxury Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/15 bg-black/50 backdrop-blur-2xl text-xs font-mono text-white/80 shadow-2xl mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-bold tracking-widest text-white">HANQIN // STUDIO</span>
          <span className="text-white/30">|</span>
          <span className="text-white/60 tracking-wider">CREATIVE DIRECTION & INTERACTION</span>
        </div>

        {/* Massive Sculptural Typographic Headline */}
        <div className="relative mb-6">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-tighter text-white select-none flex items-center justify-center leading-none">
            <span className="flex text-gradient-silver drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              {titleChars.map((char, i) => (
                <span
                  key={i}
                  onMouseEnter={() => handleLetterHover(i)}
                  style={{
                    transform: `translateY(${charWobbles[i]}px)`,
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  className="inline-block hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          <div className="mt-4 text-xs sm:text-sm font-mono tracking-[0.3em] text-white/60 uppercase font-medium flex items-center justify-center gap-3">
            <span>[ CREATIVE DIRECTION · REALTIME SHADERS · HIGH-CRAFT ENGINEERING ]</span>
          </div>
        </div>

        {/* Short, Punchy Luxury Statement */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
          Crafting high-precision digital experiences with fluid physics, 3D typography, and custom
          WebGL shaders.
        </p>

        {/* Action Controls & Navigation Anchor */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="#chromatic-text"
            onClick={() => soundEngine.playBurst()}
            className="px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3 border border-white/20 bg-gradient-to-r from-blue-600 to-indigo-600 group"
          >
            <span className="font-mono tracking-wider">EXPLORE SHOWCASE</span>
            <span className="font-mono text-base group-hover:translate-y-1 transition-transform">
              &darr;
            </span>
          </a>

          <a
            href="/demos"
            onClick={() => soundEngine.playPop(580)}
            className="px-6 py-4 rounded-2xl text-xs sm:text-sm font-mono font-bold text-white/80 hover:text-white glass-panel hover:border-white/40 transition-all duration-300 flex items-center gap-2 shadow-xl"
          >
            <span>LAB / EXPERIMENTS</span>
            <span className="text-white/40">&rarr;</span>
          </a>
        </div>

        {/* Telemetry Architecture Metric Bar */}
        <div className="flex flex-wrap items-center justify-between w-full max-w-2xl p-4 rounded-2xl glass-panel border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">{velocity} PX/S</span>
            <span className="text-white/30">•</span>
            <span className="text-white font-bold">60 FPS</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/10">
              {(['cobalt', 'amber', 'emerald'] as const).map((thm) => (
                <button
                  key={thm}
                  onClick={() => {
                    setAccentTheme(thm);
                    soundEngine.playPop(thm === 'cobalt' ? 440 : thm === 'amber' ? 520 : 660);
                  }}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    thm === 'cobalt'
                      ? 'bg-[#0d41e1]'
                      : thm === 'amber'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#10b981]'
                  } ${accentTheme === thm ? 'ring-2 ring-white scale-125' : 'opacity-40 hover:opacity-100'}`}
                  title={themeConfig[thm].name}
                />
              ))}
            </div>

            {/* Audio switch */}
            <button
              onClick={toggleSound}
              className={`px-3 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all ${
                soundOn
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
              }`}
            >
              {soundOn ? 'AUDIO ON' : 'AUDIO MUTED'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
