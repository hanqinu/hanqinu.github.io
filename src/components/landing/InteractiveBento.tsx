import React, { useState, useRef, useMemo } from 'react';

export default function InteractiveBento() {
  // --- Card 1: Spring Physics State ---
  const [stiffness, setStiffness] = useState(180);
  const [damping, setDamping] = useState(14);
  const [mass, setMass] = useState(1.2);
  const [springPos, setSpringPos] = useState(0);
  const springAnimRef = useRef<number | null>(null);

  const triggerSpringBounce = () => {
    let x = -100; // start offset
    let v = 0;
    let currentX = x;
    const targetX = 0;
    let lastTime = performance.now();

    if (springAnimRef.current) cancelAnimationFrame(springAnimRef.current);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;

      // Spring formula: F = -k * (x - target) - c * v
      const fSpring = -stiffness * (currentX - targetX);
      const fDamper = -damping * v;
      const a = (fSpring + fDamper) / mass;

      v += a * dt;
      currentX += v * dt;
      setSpringPos(currentX);

      if (Math.abs(currentX - targetX) > 0.1 || Math.abs(v) > 0.1) {
        springAnimRef.current = requestAnimationFrame(step);
      } else {
        setSpringPos(0);
      }
    };

    springAnimRef.current = requestAnimationFrame(step);
  };

  // Generate SVG path for the spring curve
  const springSvgPath = useMemo(() => {
    const points: string[] = [];
    const width = 240;
    const height = 60;
    const omega = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));

    for (let px = 0; px <= width; px += 4) {
      const t = (px / width) * 2; // 0 to 2s
      let yVal = 0;
      if (zeta < 1) {
        // Underdamped
        const wd = omega * Math.sqrt(1 - zeta * zeta);
        yVal = Math.exp(-zeta * omega * t) * Math.cos(wd * t);
      } else {
        yVal = Math.exp(-omega * t);
      }
      const py = height / 2 - yVal * 22;
      points.push(`${px},${py.toFixed(1)}`);
    }
    return `M ${points.join(' L ')}`;
  }, [stiffness, damping, mass]);

  // --- Card 2: Kinetic Letters (HANQIN LAB) ---
  const hanqinLetters = ['H', 'A', 'N', 'Q', 'I', 'N'];
  const [letterOffsets, setLetterOffsets] = useState<{ x: number; y: number; rot: number }[]>(
    hanqinLetters.map(() => ({ x: 0, y: 0, rot: 0 })),
  );

  const handleLetterHover = (index: number) => {
    setLetterOffsets((prev) =>
      prev.map((off, i) =>
        i === index
          ? {
              x: (Math.random() - 0.5) * 16,
              y: -12,
              rot: (Math.random() - 0.5) * 25,
            }
          : off,
      ),
    );
    setTimeout(() => {
      setLetterOffsets((prev) =>
        prev.map((off, i) => (i === index ? { x: 0, y: 0, rot: 0 } : off)),
      );
    }, 450);
  };

  const triggerLetterExplosion = () => {
    setLetterOffsets(
      hanqinLetters.map(() => ({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 30 - 10,
        rot: (Math.random() - 0.5) * 40,
      })),
    );
    setTimeout(() => {
      setLetterOffsets(hanqinLetters.map(() => ({ x: 0, y: 0, rot: 0 })));
    }, 600);
  };

  // --- Card 3: Dynamic Island State ---
  const [islandMode, setIslandMode] = useState<'compact' | 'player' | 'palette'>('compact');
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Card 4: Live Token Transformer ---
  const [tokenRadius, setTokenRadius] = useState(16);
  const [tokenGlow, setTokenGlow] = useState(12);
  const [tokenColor, setTokenColor] = useState('#f97316');

  // --- Card 5: Micro-Interaction State Machine ---
  const [holdProgress, setHoldProgress] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);

  const startHold = () => {
    setIsConfirmed(false);
    let progress = 0;
    holdIntervalRef.current = window.setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        setHoldProgress(100);
        setIsConfirmed(true);
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      } else {
        setHoldProgress(progress);
      }
    }, 25);
  };

  const endHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const [particleList, setParticleList] = useState<{ id: number; x: number; y: number }[]>([]);
  const triggerBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
    }));

    setParticleList((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticleList((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 600);
  };

  return (
    <section id="bento-labs" className="section-container relative z-10 py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-2 uppercase tracking-wider">
            <span>[02] // INTERACTIVE LAB EXPERIMENTS</span>
          </div>
          <h2 className="heading-section text-white">
            设计系统与微交互实验室
          </h2>
        </div>
        <p className="text-sm md:text-base text-text-secondary max-w-md">
          每一个卡片都是可直接上手操作的交互原型，探索前端物理动力学与精细化交互状态。
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Spring Physics Tuner (Large 2-col span on LG) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-sm">
                01
              </div>
              <div>
                <h3 className="heading-card text-white">弹簧物理动力学调校 (Spring Physics)</h3>
                <p className="text-xs text-text-secondary font-mono">实时计算 Hooke 弹性阻尼方程</p>
              </div>
            </div>
            <button
              onClick={triggerSpringBounce}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>⚡ 触发回弹</span>
            </button>
          </div>

          {/* Spring Playground Canvas & Curve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            {/* Interactive Spring Simulation Box */}
            <div className="h-36 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-x-4 top-1/2 h-px bg-white/10" />
              <div
                style={{
                  transform: `translateX(${springPos}px)`,
                }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs font-mono shadow-2xl cursor-pointer border border-amber-300/40 select-none active:scale-95 transition-transform"
                onClick={triggerSpringBounce}
              >
                SPRING
              </div>
            </div>

            {/* Live SVG Curve */}
            <div className="h-36 rounded-2xl bg-black/60 border border-white/10 p-4 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>DAMPED WAVEFORM</span>
                <span>k: {stiffness} | c: {damping}</span>
              </div>
              <svg className="w-full h-16 stroke-amber-400 fill-none" viewBox="0 0 240 60">
                <path d={springSvgPath} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="text-[10px] font-mono text-emerald-400 text-right">● COMPUTED_REALTIME</div>
            </div>
          </div>

          {/* Control Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
                <span>刚度 (Stiffness)</span>
                <span className="text-amber-400 font-bold">{stiffness}</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                value={stiffness}
                onChange={(e) => setStiffness(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
                <span>阻尼 (Damping)</span>
                <span className="text-amber-400 font-bold">{damping}</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={damping}
                onChange={(e) => setDamping(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
                <span>质量 (Mass)</span>
                <span className="text-amber-400 font-bold">{mass}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Kinetic Typography Matrix (HANQIN) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono text-sm">
                  02
                </div>
                <div>
                  <h3 className="heading-card text-white">磁力排版动力学</h3>
                  <p className="text-xs text-text-secondary font-mono">HANQIN 交互字母矩阵</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary mb-6">
              鼠标悬停在每个字母上体验斥力微位移，或点击按钮触发粒子波浪散开。
            </p>
          </div>

          {/* Interactive Letter Display */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-6 select-none">
            {hanqinLetters.map((letter, idx) => (
              <span
                key={idx}
                onMouseEnter={() => handleLetterHover(idx)}
                style={{
                  transform: `translate(${letterOffsets[idx].x}px, ${letterOffsets[idx].y}px) rotate(${letterOffsets[idx].rot}deg)`,
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="inline-flex items-center justify-center w-11 h-14 rounded-xl bg-surface-100/90 border border-white/15 text-2xl font-black text-white hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-500/10 shadow-lg cursor-pointer"
              >
                {letter}
              </span>
            ))}
          </div>

          <button
            onClick={triggerLetterExplosion}
            className="w-full py-2.5 rounded-xl border border-white/15 bg-black/40 hover:bg-white/10 text-xs font-mono text-white transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>✦ 激发磁场冲击波</span>
          </button>
        </div>

        {/* Card 3: Dynamic Island Morphing Toolbar */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-sm">
                03
              </div>
              <div>
                <h3 className="heading-card text-white">多态灵动岛 (Dynamic Island)</h3>
                <p className="text-xs text-text-secondary font-mono">流体形态平滑过渡</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary mb-6">
              点击下方形态胶囊，测试多状态组件的无缝平滑形变动画。
            </p>
          </div>

          {/* Morphing Capsule Container */}
          <div className="h-36 flex items-center justify-center relative">
            <div
              className={`rounded-full bg-black/90 border border-white/20 p-2 shadow-2xl transition-all duration-500 flex items-center gap-3 ${
                islandMode === 'compact'
                  ? 'w-48 h-12 justify-between px-4'
                  : islandMode === 'player'
                    ? 'w-64 h-16 px-5'
                    : 'w-72 h-16 px-4'
              }`}
            >
              {islandMode === 'compact' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono text-white">HANQIN_STUDIO</span>
                  <span className="text-[10px] text-white/40">READY</span>
                </>
              )}

              {islandMode === 'player' && (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs"
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <div className="text-[10px] font-mono text-white">
                      <div className="font-bold">FLUID_AUDIO</div>
                      <div className="text-white/40">24-bit · 48kHz</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 items-end h-4">
                    <span className="w-1 bg-amber-400 h-2 animate-bounce" />
                    <span className="w-1 bg-amber-400 h-4 animate-bounce delay-75" />
                    <span className="w-1 bg-amber-400 h-3 animate-bounce delay-150" />
                  </div>
                </div>
              )}

              {islandMode === 'palette' && (
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-white/60">COLOR:</span>
                  <div className="flex gap-2">
                    {['#f97316', '#6366f1', '#10b981', '#ec4899'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setTokenColor(c)}
                        style={{ backgroundColor: c }}
                        className="w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {(['compact', 'player', 'palette'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setIslandMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                  islandMode === m
                    ? 'bg-white/20 text-white font-bold border border-white/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Card 4: Live Token Transformer */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-mono text-sm">
                04
              </div>
              <div>
                <h3 className="heading-card text-white">实时 Token 变形器</h3>
                <p className="text-xs text-text-secondary font-mono">动态计算 CSS 属性</p>
              </div>
            </div>
          </div>

          {/* Reactive Component Preview */}
          <div className="my-4 flex flex-col items-center justify-center">
            <div
              style={{
                borderRadius: `${tokenRadius}px`,
                boxShadow: `0 0 ${tokenGlow}px ${tokenColor}`,
                borderColor: tokenColor,
              }}
              className="px-6 py-4 bg-surface-100/90 border transition-all duration-200 flex items-center gap-3 shadow-xl"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tokenColor }} />
              <span className="text-xs font-mono text-white font-bold">REACTIVE_SURFACE</span>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-amber-400/90 w-full text-center shadow-inner">
              radius: {tokenRadius}px; glow: {tokenGlow}px;
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-2">
            <div className="p-2 rounded-xl bg-black/30 border border-white/5">
              <div className="flex justify-between text-xs font-mono text-white/70 mb-1">
                <span>圆角 (Radius)</span>
                <span className="text-amber-400 font-bold">{tokenRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                value={tokenRadius}
                onChange={(e) => setTokenRadius(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
            <div className="p-2 rounded-xl bg-black/30 border border-white/5">
              <div className="flex justify-between text-xs font-mono text-white/70 mb-1">
                <span>光晕强度 (Glow)</span>
                <span className="text-amber-400 font-bold">{tokenGlow}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={tokenGlow}
                onChange={(e) => setTokenGlow(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Micro-Interaction State Machine */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-sm">
                05
              </div>
              <div>
                <h3 className="heading-card text-white">触觉微状态机 (State Machine)</h3>
                <p className="text-xs text-text-secondary font-mono">长按防误触与粒子反馈</p>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Controls */}
          <div className="my-6 space-y-4">
            {/* Hold to confirm button */}
            <div className="relative">
              <button
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className="relative w-full py-3.5 rounded-xl bg-surface-100 border border-white/15 overflow-hidden font-mono text-xs text-white font-medium select-none shadow-md transition-all active:scale-[0.99] flex items-center justify-center"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 bg-emerald-500/30 transition-all"
                  style={{ width: `${holdProgress}%` }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isConfirmed ? (
                    <span className="text-emerald-400 font-bold">✓ 执行确认完成</span>
                  ) : holdProgress > 0 ? (
                    `保持按住... ${holdProgress}%`
                  ) : (
                    '按住以确认执行指令 (Hold)'
                  )}
                </span>
              </button>
            </div>

            {/* Particle Burst Trigger */}
            <div className="relative">
              <button
                onClick={triggerBurst}
                className="w-full py-3 rounded-xl border border-amber-500/40 bg-black/40 hover:bg-amber-500/10 text-xs font-mono text-amber-400 font-semibold transition-all active:scale-95 relative overflow-hidden flex items-center justify-center shadow-sm"
              >
                <span>⚡ 触发粒子微爆破 (Click Burst)</span>
                {particleList.map((p) => (
                  <span
                    key={p.id}
                    style={{ left: p.x, top: p.y }}
                    className="absolute w-2 h-2 rounded-full bg-amber-400 pointer-events-none animate-ping"
                  />
                ))}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
            <span>TACTILE FEEDBACK</span>
            <span className="text-emerald-400">READY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
