import React, { useState, useRef, useEffect } from 'react';
import { soundEngine } from '@/utils/audio';

interface CardData {
  id: string;
  title: string;
  num: string;
  items: string[];
  fanZ: number; // Fan rotation angle in hand (degrees)
  fanX: number; // Cluster horizontal offset in hand (px)
  fanY: number; // Cluster vertical offset in hand (px)
  iconSvg: React.ReactNode;
}

const CARDS_DATA: CardData[] = [
  {
    id: 'strategy',
    title: 'STRATEGY',
    num: '01',
    fanZ: -18,
    fanX: -90,
    fanY: 22,
    items: [
      'Digital Experience Strategy',
      'Technology Architecture',
      'Creative Direction',
      'Spatial UX Systems',
      'Discovery & Research',
    ],
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <path d="M17.5 14L21 21H14L17.5 14Z" />
      </svg>
    ),
  },
  {
    id: 'creative',
    title: 'CREATIVE',
    num: '02',
    fanZ: -6,
    fanX: -30,
    fanY: 5,
    items: [
      'Art Direction & Typography',
      'Design Systems & Tokens',
      'Motion Choreography',
      'Interactive Design',
      'Editorial Visual Craft',
    ],
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="2.5" />
      </svg>
    ),
  },
  {
    id: 'technology',
    title: 'TECHNOLOGY',
    num: '03',
    fanZ: 6,
    fanX: 30,
    fanY: 5,
    items: [
      'WebGL & Three.js Realtime',
      'Custom GLSL Shaders',
      'Kinetic Physics Engines',
      '60 FPS Micro-Interactions',
      'Web Audio Soundscapes',
    ],
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    id: 'production',
    title: 'PRODUCTION',
    num: '04',
    fanZ: 18,
    fanX: 90,
    fanY: 22,
    items: [
      'High-Fidelity Prototyping',
      'Precision Performance Audits',
      'Astro & Modern Stacks',
      'Cross-Platform Haptics',
      'End-to-End Craft Delivery',
    ],
    iconSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

// Luxury Monochrome Obsidian & Silver Art-Deco Playing Card Back Pattern
function CardBackGraphic() {
  return (
    <div className="w-full h-full bg-[#0a0c14] p-3.5 rounded-3xl flex flex-col justify-between relative overflow-hidden select-none border-2 border-white/80 shadow-2xl">
      <div className="absolute inset-2 rounded-2xl border border-white/50 pointer-events-none" />
      <div className="absolute inset-3.5 rounded-xl border border-white/20 pointer-events-none" />

      <div className="flex justify-between items-center text-white/90 z-10 px-2 pt-1 font-mono text-[10px] font-bold">
        <span>HQ // ♠</span>
        <span>STUDIO // ✦</span>
      </div>

      <div className="relative my-auto flex flex-col items-center justify-center p-2 z-10">
        <svg
          viewBox="0 0 200 280"
          className="w-full max-w-[190px] h-auto text-white"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="100"
            y1="15"
            x2="100"
            y2="265"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="15"
            y1="140"
            x2="185"
            y2="140"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Concentric Diamonds */}
          <polygon points="100,30 180,140 100,250 20,140" stroke="#ffffff" strokeWidth="1.8" />
          <polygon
            points="100,50 165,140 100,230 35,140"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
          />
          <polygon points="100,70 150,140 100,210 50,140" stroke="#ffffff" strokeWidth="1.8" />

          {/* Sunburst Rays */}
          <line x1="100" y1="70" x2="35" y2="35" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1="100" y1="70" x2="165" y2="35" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line x1="100" y1="210" x2="35" y2="245" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <line
            x1="100"
            y1="210"
            x2="165"
            y2="245"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />

          {/* Center Medallion */}
          <circle cx="100" cy="140" r="36" fill="#000000" stroke="#ffffff" strokeWidth="2.5" />
          <circle
            cx="100"
            cy="140"
            r="30"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text
            x="100"
            y="150"
            fill="#ffffff"
            fontSize="26"
            fontWeight="900"
            fontFamily="Inter, sans-serif"
            textAnchor="middle"
          >
            L
          </text>

          <path d="M 28 48 A 20 20 0 0 1 48 28" stroke="#ffffff" strokeWidth="1.8" fill="none" />
          <path d="M 172 48 A 20 20 0 0 0 152 28" stroke="#ffffff" strokeWidth="1.8" fill="none" />
          <path d="M 28 232 A 20 20 0 0 0 48 252" stroke="#ffffff" strokeWidth="1.8" fill="none" />
          <path
            d="M 172 232 A 20 20 0 0 1 152 252"
            stroke="#ffffff"
            strokeWidth="1.8"
            fill="none"
          />

          <circle cx="100" cy="90" r="3" fill="#ffffff" />
          <circle cx="100" cy="190" r="3" fill="#ffffff" />
          <circle cx="60" cy="140" r="3" fill="#ffffff" />
          <circle cx="140" cy="140" r="3" fill="#ffffff" />
        </svg>
      </div>

      <div className="flex justify-between items-center text-white/90 z-10 px-2 pb-1 font-mono text-[10px] font-bold rotate-180">
        <span>HQ // ♠</span>
        <span>STUDIO // ✦</span>
      </div>
    </div>
  );
}

export default function ScrollCardFlipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [flipProgress, setFlipProgress] = useState(0); // 0 (Hand cluster at bottom, all back) -> 1 (Even horizontal spread, all front)
  const [manualFlipped, setManualFlipped] = useState<Record<string, boolean>>({});
  const [stageTilt, setStageTilt] = useState({ rx: 0, ry: 0 });
  const isIntersecting = useRef(false);

  // Intersection Observer to detect when Screen 3 is in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.current = entry.isIntersecting && entry.intersectionRatio > 0.45;
      },
      { threshold: [0, 0.45, 0.7, 1.0] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smooth wheel handling inside Screen 3:
  // Downward wheeling spreads and flips cards from hand-held cluster to horizontal front.
  // Once 100% spread & front (progress >= 1), normal page scrolling proceeds to Screen 4!
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isIntersecting.current) return;

      if (e.deltaY > 0 && flipProgress < 1) {
        e.preventDefault();
        const next = Math.min(1, flipProgress + Math.abs(e.deltaY) * 0.0018);
        setFlipProgress(next);
        if (next >= 0.98) {
          soundEngine.playLaser(740);
        }
      } else if (e.deltaY < 0 && flipProgress > 0) {
        const rect = el.getBoundingClientRect();
        if (rect.top >= -10) {
          e.preventDefault();
          const next = Math.max(0, flipProgress - Math.abs(e.deltaY) * 0.0018);
          setFlipProgress(next);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [flipProgress]);

  // Window scroll fallback/supplement
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      if (rect.top <= windowH && rect.bottom >= 0) {
        const visibleRatio = 1 - rect.top / (windowH * 0.85);
        const prog = Math.max(0, Math.min(1, visibleRatio));
        setFlipProgress((prev) => Math.max(prev, Math.min(prog, 1)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setStageTilt({
      rx: -ny * 10,
      ry: nx * 14,
    });
  };

  const handleMouseLeave = () => {
    setStageTilt({ rx: 0, ry: 0 });
  };

  const handleCardClick = (id: string) => {
    soundEngine.playLaser(740);
    setManualFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const flipAllToFront = () => {
    soundEngine.playBurst();
    setFlipProgress(1);
    setManualFlipped({
      strategy: true,
      creative: true,
      technology: true,
      production: true,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="screen-3-cards"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[100vh] min-h-[700px] select-none overflow-hidden text-white flex flex-col justify-between py-10 px-6 z-30"
      style={{
        backgroundColor: '#000000', // Pure Void Black! ZERO BLUE!
      }}
    >
      {/* Sleek Glowing White Curved Trajectory Ribbon on Black */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 700"
          className="w-full h-full object-cover"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Subtle Ambient Glow */}
          <path
            d="M -100 520 C 350 560, 650 140, 1150 260 C 1350 310, 1550 200, 1680 140"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Crisp White Ribbon */}
          <path
            d="M -100 520 C 350 560, 650 140, 1150 260 C 1350 310, 1550 200, 1680 140"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top Header */}
      <div className="text-center relative z-10 pt-2 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-[0.3em] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>03 // 3D HAND-DECK SPREAD & FLIP</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Spatial Capabilities & Motion
        </h2>
      </div>

      {/* 3D Cards Perspective Arena */}
      <div
        style={{ perspective: '1800px' }}
        className="relative w-full flex items-center justify-center my-auto z-10"
      >
        <div
          style={{
            transform: `rotateX(${stageTilt.rx}deg) rotateY(${stageTilt.ry}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {CARDS_DATA.map((card, idx) => {
            // =========================================================================
            // Dynamic Hand-Deck Spread & Flip Choreography
            // =========================================================================
            // 1. Initial State (flipProgress = 0):
            //    - All cards are BACK (rotateY = 180°).
            //    - Bottoms are converged together like held in hand (fanX, fanY, fanZ).
            // 2. Final State (flipProgress = 1):
            //    - All cards are FRONT (rotateY = 0°).
            //    - Straight upright (fanZ -> 0°).
            //    - Evenly distributed horizontally in a straight row (fanX -> 0, fanY -> 0).

            const p = flipProgress;

            // Rotation Y: 180° (Back) -> 0° (Front)
            let rotateY = (1 - p) * 180;
            if (manualFlipped[card.id]) {
              rotateY = 0; // Forced front
            }

            // Rotation Z: fan angle -> 0°
            const rotateZ = (1 - p) * card.fanZ;

            // Hand convergence offsets: grouped at bottom center -> 0 (spread out in grid)
            // Initial hand cluster pulls outer cards towards center
            const clusterPull = 1 - p;
            const handClusterX = (idx - 1.5) * -120 * clusterPull + card.fanX * clusterPull;
            const handClusterY = card.fanY * clusterPull + clusterPull * 40;

            // Z-elevation depth during flip
            const translateZ = Math.sin(p * Math.PI) * 40;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  transform: `translate3d(${handClusterX}px, ${handClusterY}px, ${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                  transformOrigin: 'bottom center',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="relative w-full h-[410px] sm:h-[440px] rounded-3xl group shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)] cursor-pointer"
                title="Click to toggle flip"
              >
                {/* FRONT FACE (Pure Crisp White Playing Card with Swiss Typography) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  className="absolute inset-0 w-full h-full bg-white text-black p-6 rounded-3xl flex flex-col justify-between shadow-2xl border-2 border-white select-none"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-black/10">
                      <h3 className="font-black font-sans text-xl tracking-tight text-black">
                        {card.title}
                      </h3>
                      <div className="text-black">{card.iconSvg}</div>
                    </div>

                    <div className="mt-5 space-y-3.5">
                      {card.items.map((item, i) => (
                        <div key={i} className="flex flex-col">
                          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                            <span>{item}</span>
                          </div>
                          <div className="w-full border-b border-dotted border-neutral-300 mt-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-black/10 rotate-180 text-black">
                    <span className="font-black font-sans text-xs tracking-wider">
                      {card.title}
                    </span>
                    <div className="text-black/80">{card.iconSvg}</div>
                  </div>
                </div>

                {/* BACK FACE (Obsidian & Silver Art-Deco Monogram Pattern) */}
                <div
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  className="absolute inset-0 w-full h-full rounded-3xl p-1 shadow-2xl"
                >
                  <CardBackGraphic />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Bar & Flip All Trigger */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white pb-2">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <span className="text-white/60">FLIP STATE:</span>
          <span className="font-bold text-white">
            {flipProgress >= 0.95
              ? '✓ 100% HORIZONTAL ROW (FRONT)'
              : `${Math.round(flipProgress * 100)}% SPREADING & TURNING`}
          </span>
        </div>

        <button
          onClick={flipAllToFront}
          className="px-5 py-1.5 rounded-full bg-white text-black font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          ✦ FLIP ALL TO FRONT
        </button>
      </div>
    </section>
  );
}
