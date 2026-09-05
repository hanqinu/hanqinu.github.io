import { useState, useEffect, useRef, useCallback } from 'react';
import { useEventListener } from 'ahooks';
import { useMousePosition } from '@/hooks/useMousePosition';
import ChromaticTextSection from '@/components/landing/ChromaticTextSection';
import {
  SkaterSilhouette,
  CyberCatSilhouette,
  SprayCanDoodle,
  StarburstBadge,
  TapeSticker,
} from '@/components/ui/DoodleStickers';

export default function HeroZoomSection() {
  const containerRef = useRef<HTMLElement>(null);
  const mouse = useMousePosition();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Track scroll inside the unified pinned stage
  const handleScroll = useCallback(() => {
    if (!containerRef.current || typeof window === 'undefined') return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = rect.height - windowHeight;
    if (scrollDistance <= 0) return;

    // Progression from 0 to 1 across the pinned stage
    const prog = Math.max(0, Math.min(1, -rect.top / scrollDistance));
    setScrollProgress(prog);
  }, []);

  useEventListener('scroll', handleScroll, { target: () => window, passive: true });
  useEventListener('resize', handleScroll, { target: () => window, passive: true });

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  // Mouse Parallax for Screen 1
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setParallax({
        x: ((mouse.x - cx) / cx) * 20,
        y: ((mouse.y - cy) / cy) * 20,
      });
    }
  }, [mouse.x, mouse.y]);

  // =========================================================================
  // Phase calculations for seamless in-place transition:
  // Phase 1 (0 -> 0.45): Screen 1 Zoom & Explode outward
  // Phase 2 (0.28 -> 0.65): Screen 2 appears DIRECTLY in place (no upward scroll)
  // Phase 3 (0.65 -> 1.0): Screen 2 interactive window
  // =========================================================================
  const phase1Prog = Math.min(1, scrollProgress / 0.45);
  const textScale = 1 + phase1Prog * 3.6;
  const screen1Opacity = Math.max(0, 1 - phase1Prog * 1.6);
  const chromeOpacity = Math.max(0, 1 - phase1Prog * 3.5);

  const leftX = -phase1Prog * 500;
  const rightX = phase1Prog * 500;
  const stickerOpacity = Math.max(0, 1 - phase1Prog * 2.2);

  // Screen 2 appears in-situ right behind Screen 1
  const screen2Opacity = Math.max(0, Math.min(1, (scrollProgress - 0.28) / 0.32));
  const isScreen2Interactive = scrollProgress >= 0.55;

  return (
    <section
      ref={containerRef}
      id="screen-1-hero"
      className="relative w-full bg-black select-none"
      style={{
        height: '220vh',
      }}
    >
      <div
        className="sticky top-0 h-[100vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden z-10"
        style={{
          backgroundColor: '#000000',
        }}
      >
        {/* ========================================================================= */}
        {/* SCREEN 2: Chromatic Fluid Dynamics Sheen (Reveals in-situ, no upward scroll) */}
        {/* ========================================================================= */}
        <ChromaticTextSection
          opacity={screen2Opacity}
          isInteractive={isScreen2Interactive}
          className="absolute inset-0 z-10"
        />

        {/* ========================================================================= */}
        {/* SCREEN 1: Monumental Hero Zoom, Side Doodles Explode & Ambient Atmosphere  */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center z-20"
          style={{
            opacity: screen1Opacity,
            pointerEvents: screen1Opacity > 0.2 ? 'auto' : 'none',
            visibility: screen1Opacity <= 0 ? 'hidden' : 'visible',
            transition: 'opacity 0.1s ease-out',
          }}
        >
          {/* Dynamic Background Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] rounded-full pointer-events-none blur-[180px] -z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15), transparent 70%)',
              transform: `translate(-50%, -50%) scale(${1 + phase1Prog * 1.8})`,
              opacity: screen1Opacity * 0.35,
            }}
          />

          {/* 1. LEFT FLANK DOODLES & SILHOUETTES */}
          <div
            style={{
              transform: `translate3d(${leftX - parallax.x * 1.2}px, ${parallax.y * 1.2}px, 0)`,
              opacity: stickerOpacity,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
            }}
            className="absolute left-6 sm:left-14 lg:left-20 top-1/2 -translate-y-1/2 z-20 pointer-events-auto flex flex-col gap-8 items-start"
          >
            {/* DJ Cyber Cat */}
            <div
              className="relative cursor-pointer group hover:scale-110 transition-transform"
              title="Cyber Cat Silhouette"
            >
              <CyberCatSilhouette
                className="w-24 h-24 sm:w-32 sm:h-32 text-white/90 group-hover:text-pink-400 transition-colors drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                color="#ec4899"
              />
              <div className="absolute -bottom-2 -left-2">
                <StarburstBadge
                  text="CREATIVE // DJ"
                  bg="#ec4899"
                  textColor="#fff"
                  rotate="rotate-[-6deg]"
                />
              </div>
            </div>

            {/* Tape Sticker & Monogram */}
            <div className="hidden sm:block">
              <TapeSticker text="DESIGN ENGINEERING" color="#06b6d4" />
            </div>
          </div>

          {/* 2. RIGHT FLANK DOODLES & SILHOUETTES */}
          <div
            style={{
              transform: `translate3d(${rightX + parallax.x * 1.2}px, ${-parallax.y * 1.2}px, 0)`,
              opacity: stickerOpacity,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
            }}
            className="absolute right-6 sm:right-14 lg:right-20 top-1/2 -translate-y-1/2 z-20 pointer-events-auto flex flex-col gap-8 items-end"
          >
            {/* Leaping Skater Silhouette */}
            <div
              className="relative cursor-pointer group hover:scale-110 transition-transform"
              title="Skater Silhouette"
            >
              <SkaterSilhouette
                className="w-24 h-24 sm:w-32 sm:h-32 text-white/90 group-hover:text-amber-400 transition-colors drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                color="#ff5e00"
              />
              <div className="absolute -bottom-3 -right-2">
                <StarburstBadge text="CRAFT // 60FPS" bg="#ff5e00" rotate="rotate-6" />
              </div>
            </div>

            {/* Spray Can Tag */}
            <div className="relative cursor-pointer group hover:scale-110 transition-transform hidden sm:block">
              <SprayCanDoodle
                className="w-20 h-20 sm:w-24 sm:h-24 text-white/90 group-hover:text-lime-400 transition-colors drop-shadow-xl"
                color="#a3e635"
              />
              <div className="absolute -top-2 -right-3">
                <StarburstBadge text="TAGGED" bg="#a3e635" textColor="#000" rotate="rotate-12" />
              </div>
            </div>
          </div>

          {/* 3. CENTER MONUMENTAL HANQIN TYPOGRAPHY */}
          <div
            style={{
              transform: `translate3d(${parallax.x * 0.4}px, ${parallax.y * 0.4}px, 0) scale(${textScale})`,
              transition: 'transform 0.08s ease-out',
              transformOrigin: 'center center',
            }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full"
          >
            {/* Top Minimalist Luxury Pill */}
            <div
              style={{ opacity: chromeOpacity }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-2xl text-xs font-mono text-white/80 shadow-2xl mb-6 transition-opacity"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="font-bold tracking-widest text-white">HANQIN // STUDIO</span>
              <span className="text-white/30">|</span>
              <span className="text-white/60">CREATIVE DIRECTION & CODE</span>
            </div>

            {/* Massive HANQIN Letters */}
            <h1 className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-black tracking-tighter text-white select-none leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
                HANQIN
              </span>
            </h1>

            {/* Minimal Subtitle */}
            <div
              style={{ opacity: chromeOpacity }}
              className="mt-4 text-xs sm:text-sm font-mono tracking-[0.35em] text-white/60 uppercase font-medium flex items-center justify-center gap-3 transition-opacity"
            >
              <span>[ CREATIVE DIRECTION · REALTIME SHADERS · 3D MOTION ]</span>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div
            style={{ opacity: chromeOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60 animate-bounce pointer-events-none font-mono text-xs tracking-widest transition-opacity"
          >
            <span>SCROLL TO ENTER</span>
            <span>&darr;</span>
          </div>
        </div>
      </div>
    </section>
  );
}
