import React from 'react';
import { useBoolean } from 'ahooks';
import { soundEngine } from '@/utils/audio';

export default function TelemetrySection() {
  const [copied, { setTrue: setCopiedTrue, setFalse: setCopiedFalse }] = useBoolean(false);

  const copyCommand = () => {
    soundEngine.playLaser(920);
    navigator.clipboard.writeText('https://github.com/hanqinu');
    setCopiedTrue();
    setTimeout(() => setCopiedFalse(), 2000);
  };

  const marqueeItems = [
    '✦ CREATIVE DIRECTION',
    '✦ REALTIME WEBGL & THREE.JS',
    '✦ CUSTOM GLSL SHADERS',
    '✦ KINETIC INTERACTION DESIGN',
    '✦ 60 FPS SOLID PHYSICS',
    '✦ LUXURY DIGITAL CRAFT',
    '✦ SPATIAL TYPOGRAPHY',
  ];

  const telemetryStats = [
    {
      num: '60 FPS',
      label: 'Native Physics Engine',
      desc: 'Zero drop frames. Realtime composite layer dynamics.',
      tag: 'RENDER_PERF',
    },
    {
      num: '0.0 MS',
      label: 'Input Damping Latency',
      desc: 'Immediate tactile haptic and audio micro-feedback.',
      tag: 'HAPTIC_SYNTH',
    },
    {
      num: 'GLSL',
      label: 'Bespoke Shaders',
      desc: 'Chromatic dispersion, fluid metaballs, and procedural wave fields.',
      tag: 'GRAPHICS',
    },
    {
      num: '100%',
      label: 'Bespoke Craft',
      desc: 'Tailored interactions engineered without off-the-shelf bloat.',
      tag: 'CRAFT',
    },
  ];

  return (
    <div className="w-full relative z-10 py-16 overflow-hidden select-none">
      {/* Infinite Kinetic Marquee Strip */}
      <div className="w-full py-5 border-y border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden relative select-none shadow-2xl">
        <div className="animate-marquee flex items-center gap-10 font-mono text-xs sm:text-sm tracking-[0.25em] text-white/60 font-bold">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 shrink-0 hover:text-white transition-colors cursor-default"
            >
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy & Metrics */}
      <div className="section-container pt-20 pb-16 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">
              <span>05 // PERFORMANCE BENCHMARKS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Engineering Rigor & Telemetry
            </h2>
          </div>

          <div className="text-xs font-mono text-white/40">
            <span>SYS_SPEC // AESTHETICS & LATENCY</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {telemetryStats.map((stat, i) => (
            <div
              key={i}
              onMouseEnter={() => soundEngine.playPop(500 + i * 80)}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-white/40 hover:scale-[1.02] transition-all group shadow-2xl relative overflow-hidden bg-black/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-white group-hover:text-blue-400 transition-colors">
                    {stat.num}
                  </span>
                  <span className="mono-tag text-[10px] font-bold text-white/50 border-white/20">
                    {stat.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{stat.label}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{stat.desc}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[10px] font-mono text-white/40 flex justify-between">
                <span>SPEC_0{i + 1}</span>
                <span className="text-emerald-400 font-bold">● VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Final Luxury Call to Action Banner */}
        <div className="relative rounded-3xl glass-panel p-8 sm:p-14 overflow-hidden text-center flex flex-col items-center justify-center shadow-2xl border border-white/15 bg-black/60">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white max-w-2xl mx-auto mb-4 tracking-tight">
            Available for Select Commissions & Collaborations
          </h3>
          <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed font-normal">
            Partnering with visionary brands, agencies, and founders to create high-impact
            interactive web experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <a
              href="mailto:contact@hanqin.studio"
              onClick={() => soundEngine.playBurst()}
              className="px-8 py-3.5 rounded-2xl bg-white text-black hover:scale-105 active:scale-95 text-xs sm:text-sm font-bold font-mono tracking-wider shadow-2xl transition-all flex items-center gap-2"
            >
              <span>GET IN TOUCH</span>
              <span>&rarr;</span>
            </a>

            <button
              onClick={copyCommand}
              className="px-6 py-3.5 rounded-2xl bg-black/60 hover:bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-mono font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg"
            >
              <span>{copied ? '✓ COPIED GITHUB URL' : '🔗 GITHUB @hanqinu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
