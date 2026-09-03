import React, { useState, useRef } from 'react';
import { useInterval, useBoolean } from 'ahooks';
import { soundEngine } from '@/utils/audio';
import { StarburstBadge } from '@/components/ui/DoodleStickers';

export default function InteractiveBento() {
  // ==========================================
  // --- CARD 1: Kinetic Typography Matrix ---
  // ==========================================
  const wordPresets = {
    HANQIN: ['H', 'A', 'N', 'Q', 'I', 'N'],
    STREET: ['S', 'T', 'R', 'E', 'E', 'T'],
    CHAOS: ['C', 'H', 'A', 'O', 'S', '!'],
    MAGIC: ['M', 'A', 'G', 'I', 'C', '✨'],
  };
  const [currentWordKey, setCurrentWordKey] = useState<keyof typeof wordPresets>('HANQIN');
  const currentLetters = wordPresets[currentWordKey];
  const [letterOffsets, setLetterOffsets] = useState<{ x: number; y: number; rot: number }[]>(
    Array(6).fill({ x: 0, y: 0, rot: 0 }),
  );

  const handleLetterHover = (index: number) => {
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    soundEngine.playNote(notes[index % notes.length], 'sine', 0.18, 0.15);

    setLetterOffsets((prev) =>
      prev.map((off, i) =>
        i === index
          ? {
              x: (Math.random() - 0.5) * 20,
              y: -16,
              rot: (Math.random() - 0.5) * 30,
            }
          : off,
      ),
    );
    setTimeout(() => {
      setLetterOffsets((prev) =>
        prev.map((off, i) => (i === index ? { x: 0, y: 0, rot: 0 } : off)),
      );
    }, 400);
  };

  const triggerLetterExplosion = () => {
    soundEngine.playBurst();
    setLetterOffsets(
      currentLetters.map(() => ({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 45 - 20,
        rot: (Math.random() - 0.5) * 60,
      })),
    );
    setTimeout(() => {
      setLetterOffsets(currentLetters.map(() => ({ x: 0, y: 0, rot: 0 })));
    }, 650);
  };

  // ==========================================
  // --- CARD 2: Multi-Stage Plasma Reactor ---
  // ==========================================
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCriticalBurst, { setTrue: setCriticalBurstTrue, setFalse: setCriticalBurstFalse }] =
    useBoolean(false);
  const [particleType, setParticleType] = useState<
    'sparks' | 'stars' | 'skulls' | 'hearts' | 'drips'
  >('sparks');
  const [particleList, setParticleList] = useState<
    { id: number; x: number; y: number; icon: string; color: string }[]
  >([]);
  const holdTimerRef = useRef<number | null>(null);

  const startHold = () => {
    setCriticalBurstFalse();
    let p = 0;
    holdTimerRef.current = window.setInterval(() => {
      p += 4;
      if (p >= 100) {
        setHoldProgress(100);
        setCriticalBurstTrue();
        soundEngine.playBurst();
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      } else {
        setHoldProgress(p);
        // Rising frequency tone
        soundEngine.playNote(220 + p * 8, 'sawtooth', 0.05, 0.08);
      }
    }, 30);
  };

  const endHold = () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const triggerParticleBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    soundEngine.playLaser(980);

    const icons = {
      sparks: '⚡',
      stars: '★',
      skulls: '💀',
      hearts: '💖',
      drips: '💦',
    };
    const colors = ['#f97316', '#facc15', '#06b6d4', '#ec4899', '#a3e635'];

    const newParts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 80,
      y: y + (Math.random() - 0.5) * 60,
      icon: icons[particleType],
      color: colors[i % colors.length],
    }));

    setParticleList((prev) => [...prev, ...newParts]);
    setTimeout(() => {
      setParticleList((prev) => prev.filter((pt) => !newParts.find((np) => np.id === pt.id)));
    }, 700);
  };

  // ==========================================
  // --- CARD 3: Graffiti & Sticker Wall ---
  // ==========================================
  const [graffitiStickers, setGraffitiStickers] = useState([
    { id: 'g1', label: '🛹 SKATE', x: 30, y: 35, rot: -10, color: '#f97316' },
    { id: 'g2', label: '🐱 CYBER_CAT', x: 170, y: 25, rot: 12, color: '#ec4899' },
    { id: 'g3', label: '💥 BOOM!', x: 45, y: 110, rot: -6, color: '#facc15' },
    { id: 'g4', label: '⚡ STAY WEIRD', x: 160, y: 105, rot: 8, color: '#a3e635' },
  ]);
  const [paintSplats, setPaintSplats] = useState<
    { id: number; x: number; y: number; size: number; color: string }[]
  >([]);
  const draggingWallSticker = useRef<string | null>(null);
  const wallDragOffset = useRef({ x: 0, y: 0 });

  const handleWallCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    soundEngine.playPop(880);

    const colors = ['#ff5e00', '#06b6d4', '#a3e635', '#ec4899', '#facc15'];
    const newSplat = {
      id: Date.now(),
      x,
      y,
      size: Math.random() * 24 + 14,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setPaintSplats((prev) => [...prev.slice(-15), newSplat]);
  };

  const handleWallStickerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    draggingWallSticker.current = id;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    wallDragOffset.current = { x: e.clientX, y: e.clientY };
    soundEngine.playPop(620);
  };

  const handleWallStickerMove = (e: React.PointerEvent) => {
    if (!draggingWallSticker.current) return;
    const dx = e.clientX - wallDragOffset.current.x;
    const dy = e.clientY - wallDragOffset.current.y;

    setGraffitiStickers((prev) =>
      prev.map((stk) => {
        if (stk.id !== draggingWallSticker.current) return stk;
        return {
          ...stk,
          x: Math.max(10, Math.min(230, stk.x + dx)),
          y: Math.max(10, Math.min(130, stk.y + dy)),
          rot: stk.rot + dx * 0.1,
        };
      }),
    );

    wallDragOffset.current = { x: e.clientX, y: e.clientY };
  };

  const handleWallStickerUp = (e: React.PointerEvent) => {
    if (!draggingWallSticker.current) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    draggingWallSticker.current = null;
    soundEngine.playBoing();
  };

  const shakeWallStickers = () => {
    soundEngine.playLaser(680);
    setGraffitiStickers((prev) =>
      prev.map((stk) => ({
        ...stk,
        x: Math.max(20, Math.min(200, stk.x + (Math.random() - 0.5) * 80)),
        y: Math.max(20, Math.min(110, stk.y + (Math.random() - 0.5) * 60)),
        rot: (Math.random() - 0.5) * 45,
      })),
    );
  };

  // ==========================================
  // --- CARD 4: 8-Bit Cyber Synth Matrix ---
  // ==========================================
  const pentatonicFrequencies = [
    261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66,
    1318.51, 1567.98, 1760.0, 2093.0,
  ];
  const [activePadIndex, setActivePadIndex] = useState<number | null>(null);
  const [isSequencerPlaying, { toggle: toggleSequencerState }] = useBoolean(false);
  const sequencerIndex = useRef(0);

  const playPad = (index: number) => {
    setActivePadIndex(index);
    soundEngine.playNote(pentatonicFrequencies[index], 'sawtooth', 0.22, 0.16);
    setTimeout(() => setActivePadIndex(null), 250);
  };

  useInterval(
    () => {
      const idx = sequencerIndex.current % 16;
      playPad(idx);
      sequencerIndex.current++;
    },
    isSequencerPlaying ? 180 : undefined,
  );

  const toggleSequencer = () => {
    if (isSequencerPlaying) {
      soundEngine.playPop(400);
    } else {
      soundEngine.playLaser(800);
    }
    toggleSequencerState();
  };

  // ==========================================
  // --- CARD 5: Magnetic Pinball Arena ---
  // ==========================================
  const [pinballScore, setPinballScore] = useState(0);
  const [ballPos, setBallPos] = useState({ x: 120, y: 80 });
  const [activeBumper, setActiveBumper] = useState<number | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<
    { id: number; x: number; y: number; text: string }[]
  >([]);
  const pinballStageRef = useRef<HTMLDivElement>(null);

  const bumpers = [
    { id: 1, x: 50, y: 50, pts: 100, label: '★ 100', color: '#f97316' },
    { id: 2, x: 190, y: 50, pts: 200, label: '⚡ 200', color: '#06b6d4' },
    { id: 3, x: 120, y: 110, pts: 500, label: '💥 500', color: '#ec4899' },
  ];

  const handlePinballMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pinballStageRef.current) return;
    const rect = pinballStageRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setBallPos({ x: mx, y: my });

    // Check collision with bumpers
    bumpers.forEach((bmp) => {
      const dist = Math.hypot(mx - bmp.x, my - bmp.y);
      if (dist < 32 && activeBumper !== bmp.id) {
        setActiveBumper(bmp.id);
        setPinballScore((s) => s + bmp.pts);
        soundEngine.playBumper(bmp.pts > 200 ? 900 : 600);

        setFloatingPoints((prev) => [
          ...prev,
          { id: Date.now(), x: bmp.x, y: bmp.y, text: `+${bmp.pts}` },
        ]);
        setTimeout(() => {
          setFloatingPoints((prev) => prev.slice(1));
        }, 600);

        setTimeout(() => setActiveBumper(null), 300);
      }
    });
  };

  const launchPinball = () => {
    soundEngine.playLaser(1100);
    setPinballScore((s) => s + 1000);
    setFloatingPoints((prev) => [
      ...prev,
      { id: Date.now(), x: 120, y: 70, text: '★ JACKPOT +1000 ★' },
    ]);
    setTimeout(() => {
      setFloatingPoints((prev) => prev.slice(1));
    }, 700);
  };

  return (
    <section id="bento-labs" className="section-container relative z-10 py-20">
      {/* Section Header with Street Doodles */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider font-bold">
            <span>[02] // 创意微交互与潮流玩具场</span>
            <span className="text-white/30">•</span>
            <span className="text-emerald-400">100% INTERACTIVE TOYBOX</span>
          </div>
          <h2 className="heading-section text-white flex items-center gap-3">
            <span>街头微交互玩具实验室</span>
            <StarburstBadge text="NO BORING CODE" bg="#ec4899" textColor="#fff" rotate="rotate-3" />
          </h2>
        </div>
        <p className="text-sm md:text-base text-text-secondary max-w-md">
          每一个卡片都是可以直接上手把玩的数字小玩具。挥动鼠标、按住蓄力、拖拽碰撞，尽情解压！
        </p>
      </div>

      {/* Bento 5-Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ================= CARD 1: Kinetic Typography Matrix ================= */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group border border-white/15">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-mono font-bold text-sm">
                01
              </div>
              <div>
                <h3 className="heading-card text-white flex items-center gap-2">
                  <span>磁力排版动力学 (Letter Matrix)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    8-BIT 音阶
                  </span>
                </h3>
                <p className="text-xs text-text-secondary font-mono">鼠标悬停激发音阶与磁场位移</p>
              </div>
            </div>

            {/* Word Preset Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              {(['HANQIN', 'STREET', 'CHAOS', 'MAGIC'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentWordKey(key);
                    soundEngine.playPop(550);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    currentWordKey === key
                      ? 'bg-amber-500 text-white font-bold shadow-md'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Letters Display Stage */}
          <div className="py-8 flex items-center justify-center gap-2.5 sm:gap-4 select-none relative my-2">
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

            {currentLetters.map((letter, idx) => (
              <span
                key={idx}
                onMouseEnter={() => handleLetterHover(idx)}
                style={{
                  transform: `translate3d(${letterOffsets[idx].x}px, ${letterOffsets[idx].y}px, 0) rotate(${letterOffsets[idx].rot}deg)`,
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="inline-flex items-center justify-center w-12 h-16 sm:w-16 sm:h-20 rounded-2xl bg-surface-100/95 border-2 border-white/20 hover:border-amber-400 hover:text-amber-400 hover:bg-amber-500/10 text-3xl sm:text-4xl font-black text-white shadow-xl cursor-pointer select-none transition-colors"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs font-mono text-white/50">HOVER TO PLAY PENTATONIC NOTES</span>
            <button
              onClick={triggerLetterExplosion}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-105 active:scale-95 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2"
            >
              <span>💥 激发磁场冲击波</span>
            </button>
          </div>
        </div>

        {/* ================= CARD 2: Multi-Stage Plasma Reactor ================= */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-white/15">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                02
              </div>
              <div>
                <h3 className="heading-card text-white">触觉多段蓄力机</h3>
                <p className="text-xs text-text-secondary font-mono">
                  长按充能 $\to$ 极限等离子微爆破
                </p>
              </div>
            </div>

            {/* Particle Type Selector */}
            <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-black/40 border border-white/10 mb-4 text-xs">
              {(
                [
                  { id: 'sparks', icon: '⚡ 闪电' },
                  { id: 'stars', icon: '★ 星芒' },
                  { id: 'skulls', icon: '💀 涂鸦' },
                  { id: 'hearts', icon: '💖 爱心' },
                ] as const
              ).map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => {
                    setParticleType(pt.id);
                    soundEngine.playPop(600);
                  }}
                  className={`px-2 py-1 rounded-lg font-mono transition-all ${
                    particleType === pt.id
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {pt.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Charge Button & Particle Stage */}
          <div className="my-4 space-y-3">
            {/* Long Press Button */}
            <div className="relative">
              <button
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className="relative w-full py-4 rounded-2xl bg-surface-100 border-2 border-white/20 overflow-hidden font-mono text-xs text-white font-bold select-none shadow-xl transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                {/* Charge Progress bar with energy color */}
                <div
                  className="absolute left-0 top-0 bottom-0 transition-all"
                  style={{
                    width: `${holdProgress}%`,
                    background:
                      holdProgress > 75
                        ? 'linear-gradient(90deg, #ec4899, #f43f5e)'
                        : holdProgress > 40
                          ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                          : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isCriticalBurst ? (
                    <span className="text-pink-300 font-extrabold animate-bounce">
                      ⚡ 100% CRITICAL OVERDRIVE! ⚡
                    </span>
                  ) : holdProgress > 0 ? (
                    `保持按住蓄力... ${holdProgress}%`
                  ) : (
                    '👉 长按进行等离子蓄力 (HOLD)'
                  )}
                </span>
              </button>
            </div>

            {/* Click Burst Button */}
            <div className="relative">
              <button
                onClick={triggerParticleBurst}
                className="w-full py-3 rounded-xl border border-amber-500/40 bg-black/50 hover:bg-amber-500/20 text-xs font-mono text-amber-400 font-bold transition-all active:scale-95 relative overflow-hidden flex items-center justify-center shadow-md"
              >
                <span>✨ 点击触发散落粒子微爆破</span>
                {particleList.map((p) => (
                  <span
                    key={p.id}
                    style={{
                      left: p.x,
                      top: p.y,
                      color: p.color,
                      textShadow: `0 0 10px ${p.color}`,
                    }}
                    className="absolute text-sm pointer-events-none animate-ping"
                  >
                    {p.icon}
                  </span>
                ))}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
            <span>PLASMA CHARGE</span>
            <span className={holdProgress > 75 ? 'text-pink-400 font-bold' : 'text-cyan-400'}>
              {holdProgress === 100 ? 'OVERDRIVE ACTIVE' : 'READY'}
            </span>
          </div>
        </div>

        {/* ================= CARD 3: Graffiti & Sticker Wall ================= */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-white/15">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-mono font-bold text-sm">
                  03
                </div>
                <div>
                  <h3 className="heading-card text-white">街头涂鸦贴纸墙</h3>
                  <p className="text-xs text-text-secondary font-mono">自由拖拽与喷漆印章</p>
                </div>
              </div>

              <button
                onClick={shakeWallStickers}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-pink-500 text-white font-mono text-xs font-bold transition-all"
              >
                🌪️ 洗牌
              </button>
            </div>
          </div>

          {/* Interactive Wall Canvas Stage */}
          <div
            onClick={handleWallCanvasClick}
            onPointerMove={handleWallStickerMove}
            onPointerUp={handleWallStickerUp}
            className="h-44 rounded-2xl bg-black/70 border border-white/15 relative overflow-hidden my-2 cursor-crosshair select-none shadow-inner"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

            <div className="absolute top-2 left-3 text-[10px] font-mono text-white/40 pointer-events-none">
              CLICK TO SPRAY PAINT // DRAG STICKERS
            </div>

            {/* Paint Splats */}
            {paintSplats.map((sp) => (
              <div
                key={sp.id}
                style={{
                  left: sp.x - sp.size / 2,
                  top: sp.y - sp.size / 2,
                  width: sp.size,
                  height: sp.size,
                  backgroundColor: sp.color,
                  boxShadow: `0 0 12px ${sp.color}`,
                }}
                className="absolute rounded-full pointer-events-none opacity-80 animate-pulse-subtle"
              />
            ))}

            {/* Draggable Graffiti Stickers */}
            {graffitiStickers.map((stk) => (
              <div
                key={stk.id}
                onPointerDown={(e) => handleWallStickerDown(e, stk.id)}
                style={{
                  transform: `translate3d(${stk.x}px, ${stk.y}px, 0) rotate(${stk.rot}deg)`,
                  borderColor: stk.color,
                  boxShadow: `0 6px 16px rgba(0,0,0,0.8), 0 0 10px ${stk.color}44`,
                }}
                className="absolute px-3 py-1.5 rounded-xl bg-surface-100 border-2 text-white font-mono text-xs font-black select-none cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-xl"
              >
                {stk.label}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
            <span>GRAFFITI CANVAS</span>
            <span className="text-pink-400 font-bold">STREET CRAFT</span>
          </div>
        </div>

        {/* ================= CARD 4: 8-Bit Cyber Synth Matrix ================= */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-white/15">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-mono font-bold text-sm">
                  04
                </div>
                <div>
                  <h3 className="heading-card text-white">8-Bit 像素合成器</h3>
                  <p className="text-xs text-text-secondary font-mono">16音阶节拍器与波形声场</p>
                </div>
              </div>

              <button
                onClick={toggleSequencer}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shadow-md ${
                  isSequencerPlaying
                    ? 'bg-purple-500 text-white animate-pulse'
                    : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                {isSequencerPlaying ? '⏸ 暂停自动循环' : '▶ 自动循环'}
              </button>
            </div>
          </div>

          {/* 4x4 Synth Pad Grid */}
          <div className="grid grid-cols-4 gap-2 my-3 select-none">
            {pentatonicFrequencies.map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => playPad(i)}
                onClick={() => playPad(i)}
                className={`h-10 rounded-xl font-mono text-xs font-black transition-all duration-150 flex items-center justify-center border ${
                  activePadIndex === i
                    ? 'bg-purple-500 border-white text-white scale-110 shadow-lg shadow-purple-500/50'
                    : 'bg-black/50 border-white/10 text-white/40 hover:text-white hover:border-purple-400/50 hover:bg-purple-500/20'
                }`}
              >
                #{i + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
            <span>SLIDE MOUSE OVER PADS</span>
            <span className="text-purple-400 font-bold">ARCADE AUDIO</span>
          </div>
        </div>

        {/* ================= CARD 5: Magnetic Pinball Arena ================= */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-white/15">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                  05
                </div>
                <div>
                  <h3 className="heading-card text-white">磁力弹球与碰撞力场</h3>
                  <p className="text-xs text-text-secondary font-mono">弹射击打得分柱</p>
                </div>
              </div>

              <div className="text-xs font-mono font-extrabold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                SCORE: {pinballScore}
              </div>
            </div>
          </div>

          {/* Pinball Arena Stage */}
          <div
            ref={pinballStageRef}
            onMouseMove={handlePinballMove}
            className="h-44 rounded-2xl bg-black/70 border border-white/15 relative overflow-hidden my-2 select-none shadow-inner cursor-none flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

            {/* Bumpers */}
            {bumpers.map((bmp) => (
              <div
                key={bmp.id}
                style={{
                  left: bmp.x - 22,
                  top: bmp.y - 22,
                  borderColor: bmp.color,
                  boxShadow: activeBumper === bmp.id ? `0 0 25px ${bmp.color}` : 'none',
                }}
                className={`absolute w-11 h-11 rounded-full border-2 bg-surface-100 flex items-center justify-center font-mono text-[10px] font-black text-white transition-transform ${
                  activeBumper === bmp.id ? 'scale-125 bg-white text-black' : ''
                }`}
              >
                {bmp.label}
              </div>
            ))}

            {/* Floating Point Scores */}
            {floatingPoints.map((fp) => (
              <div
                key={fp.id}
                style={{ left: fp.x - 20, top: fp.y - 30 }}
                className="absolute text-xs font-mono font-extrabold text-amber-400 animate-bounce pointer-events-none"
              >
                {fp.text}
              </div>
            ))}

            {/* Tether Elastic Bungee Line from center to ball */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/50 stroke-dasharray-2">
              <line x1="140" y1="90" x2={ballPos.x} y2={ballPos.y} strokeWidth="1.5" />
            </svg>

            {/* Magnetic Neon Pinball */}
            <div
              style={{
                left: ballPos.x - 10,
                top: ballPos.y - 10,
              }}
              className="absolute w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_15px_#10b981] pointer-events-none border border-white"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
            <span>SWING TO HIT BUMPERS</span>
            <button
              onClick={launchPinball}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              ⚡ 极速弹射 (Slingshot)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
