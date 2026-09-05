import React, { useState, useRef, useEffect } from 'react';

interface CardData {
  id: string;
  title: string;
  num: string;
  items: string[];
  fanZ: number;
  fanX: number;
  fanY: number;
  iconSvg: React.ReactNode;
}

const CARDS_DATA: CardData[] = [
  {
    id: 'strategy',
    title: 'STRATEGY',
    num: '01',
    fanZ: -9,
    fanX: -18,
    fanY: 12,
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
    fanZ: -3,
    fanX: -6,
    fanY: 3,
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
    fanZ: 3,
    fanX: 6,
    fanY: 3,
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
    fanZ: 9,
    fanX: 18,
    fanY: 12,
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

function CardBackGraphic() {
  return (
    <div className="w-full h-full bg-[#0a0c14] p-3.5 rounded-3xl flex flex-col justify-between relative overflow-hidden select-none border border-white/40 shadow-2xl">
      <div className="absolute inset-2 rounded-2xl border border-white/20 pointer-events-none" />
      <div className="absolute inset-3.5 rounded-xl border border-white/10 pointer-events-none" />

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
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="15"
            y1="140"
            x2="185"
            y2="140"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          <polygon
            points="100,30 180,140 100,250 20,140"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />
          <polygon
            points="100,50 165,140 100,230 35,140"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
          />
          <polygon
            points="100,70 150,140 100,210 50,140"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />

          <line x1="100" y1="70" x2="35" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="100" y1="70" x2="165" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="100" y1="210" x2="35" y2="245" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line
            x1="100"
            y1="210"
            x2="165"
            y2="245"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />

          <circle
            cx="100"
            cy="140"
            r="36"
            fill="#06070a"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="140"
            r="30"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x="100"
            y="148"
            fill="#ffffff"
            fontSize="18"
            fontWeight="900"
            fontFamily="Inter, sans-serif"
            letterSpacing="2"
            textAnchor="middle"
          >
            HQ
          </text>

          <path
            d="M 28 48 A 20 20 0 0 1 48 28"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 172 48 A 20 20 0 0 0 152 28"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 28 232 A 20 20 0 0 0 48 252"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 172 232 A 20 20 0 0 1 152 252"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />

          <circle cx="100" cy="90" r="2.5" fill="rgba(255,255,255,0.8)" />
          <circle cx="100" cy="190" r="2.5" fill="rgba(255,255,255,0.8)" />
          <circle cx="60" cy="140" r="2.5" fill="rgba(255,255,255,0.8)" />
          <circle cx="140" cy="140" r="2.5" fill="rgba(255,255,255,0.8)" />
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
  const [flipProgress, setFlipProgress] = useState(0);
  const [manualFlipped, setManualFlipped] = useState<Record<string, boolean>>({});
  const [stageTilt, setStageTilt] = useState({ rx: 0, ry: 0 });

  // Deterministic Scroll Progression using Pinned Sticky Stage
  // When entering Screen 3 (rect.top >= 0): progress is strictly 0.0 (Back face)
  // When pinned inside Screen 3 (0 -> -scrollDistance): progress smoothly 0.0 -> 1.0
  // When leaving Screen 3 (rect.top <= -scrollDistance): progress is strictly 1.0 (Front face)
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalH = rect.height;
      const scrollDistance = totalH - windowH;

      if (scrollDistance <= 0) return;

      let prog = 0;
      if (rect.top >= 0) {
        prog = 0;
      } else if (rect.top <= -scrollDistance) {
        prog = 1;
      } else {
        prog = -rect.top / scrollDistance;
      }

      setFlipProgress(Math.max(0, Math.min(1, prog)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
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
    setManualFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllCards = () => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollDistance = rect.height - windowH;
    const currentScrollY = window.scrollY;
    const sectionAbsoluteTop = currentScrollY + rect.top;

    const isAllFlipped = flipProgress >= 0.85;
    if (isAllFlipped) {
      // Re-fan to compact deck: smooth scroll to start of screen 3
      window.scrollTo({
        top: sectionAbsoluteTop,
        behavior: 'smooth',
      });
      setManualFlipped({});
    } else {
      // Flip all to front: smooth scroll to end of pinned zone
      window.scrollTo({
        top: sectionAbsoluteTop + scrollDistance,
        behavior: 'smooth',
      });
      setManualFlipped({
        strategy: true,
        creative: true,
        technology: true,
        production: true,
      });
    }
  };

  const isUnveiled = flipProgress >= 0.85;

  return (
    <section
      ref={sectionRef}
      id="screen-3-cards"
      className="relative w-full bg-black select-none"
      style={{ height: '220vh' }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 w-full select-none overflow-hidden text-white flex flex-col justify-between py-6 md:py-8 px-6 z-30"
        style={{
          height: '100vh',
          minHeight: '700px',
          backgroundColor: '#000000',
        }}
      >
        <div className="text-center relative z-10 pt-2 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-[0.3em] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>03 // 3D HAND-DECK SPREAD & FLIP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Spatial Capabilities & Motion
          </h2>
        </div>

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
              const p = flipProgress;

              let rotateY = (1 - p) * 180;
              if (manualFlipped[card.id]) {
                rotateY = 0;
              }

              const rotateZ = (1 - p) * card.fanZ;

              const clusterPull = 1 - p;
              // Tighter compact deck: pull cards strongly to center when p is low
              const handClusterX = (idx - 1.5) * -210 * clusterPull + card.fanX * clusterPull;
              const handClusterY = card.fanY * clusterPull + clusterPull * 28;
              // Consistent 3D layer depth: Card 01 (Strategy) stays cleanly on top from p=0 to p=1
              const stackZ = (3 - idx) * 8 * clusterPull;
              const totalZ =
                Math.sin(p * Math.PI) * 40 + stackZ + (manualFlipped[card.id] ? 50 : 0);
              const cardZIndex = manualFlipped[card.id] ? 50 : 10 - idx;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  style={{
                    transform: `translate3d(${handClusterX}px, ${handClusterY}px, ${totalZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                    transformOrigin: 'bottom center',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: cardZIndex,
                  }}
                  className="relative w-full h-[340px] sm:h-[370px] lg:h-[390px] rounded-3xl group shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)] cursor-pointer hover:-translate-y-1.5 transition-all"
                  title="Click to toggle flip"
                >
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                    className="absolute inset-0 w-full h-full bg-white text-black p-6 rounded-3xl flex flex-col justify-between shadow-2xl border border-neutral-200 select-none"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-black/10">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-black/40">
                            {card.num}
                          </span>
                          <h3 className="font-black font-sans text-xl tracking-tight text-black">
                            {card.title}
                          </h3>
                        </div>
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
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-black/40">
                          {card.num}
                        </span>
                        <span className="font-black font-sans text-xs tracking-wider">
                          {card.title}
                        </span>
                      </div>
                      <div className="text-black/80">{card.iconSvg}</div>
                    </div>
                  </div>

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

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white pb-2">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="text-white/50">FLIP PROGRESS:</span>
            <span className="font-bold text-white">
              {isUnveiled
                ? '✓ 100% UNVEILED (FRONT)'
                : `${Math.round(flipProgress * 100)}% COMPACT SPREAD`}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleAllCards}
            className="px-5 py-1.5 rounded-full bg-white text-black font-bold shadow-lg hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
          >
            {isUnveiled ? '↺ RE-FAN COMPACT DECK' : '✦ FLIP ALL TO FRONT'}
          </button>
        </div>
      </div>
    </section>
  );
}
