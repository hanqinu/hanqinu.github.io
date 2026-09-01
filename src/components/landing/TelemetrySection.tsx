import React, { useState } from 'react';

export default function TelemetrySection() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('https://github.com/hanqinu');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const marqueeItems = [
    'HANQIN // LAB',
    'SPRING DYNAMICS',
    '60 FPS RENDER LOOP',
    'SUB-PIXEL PRECISION',
    'ZERO JANK CRAFT',
    'REACT 19 + ASTRO 5',
    'TACTILE FEEDBACK',
    'RADICAL MINIMALISM',
  ];

  const telemetryStats = [
    {
      num: '60 FPS',
      label: '恒定渲染帧率',
      desc: '基于 requestAnimationFrame 与合成层加速，确保复杂物理运算下 0 掉帧。',
      tag: 'PERFORMANCE',
    },
    {
      num: '< 15KB',
      label: '极简动效负载',
      desc: '摒弃笨重庞大的 3D 网格包袱，以纯粹的 2D 物理代码实现秒级可交互。',
      tag: 'LIGHTWEIGHT',
    },
    {
      num: '< 0.01px',
      label: '亚像素级精度',
      desc: '严苛的数学间距与排版律动，发丝微边框与高光均经过严谨对齐。',
      tag: 'PRECISION',
    },
    {
      num: '100%',
      label: '自然物理直觉',
      desc: '以牛顿力学与弹性阻尼为核心法则，赋予界面可触摸感知的真实手感。',
      tag: 'KINEMATICS',
    },
  ];

  return (
    <div className="w-full relative z-10 py-16 overflow-hidden">
      {/* Kinetic Infinite Marquee Strip */}
      <div className="w-full py-5 border-y border-white/10 bg-surface-100/60 backdrop-blur-md overflow-hidden relative select-none">
        <div className="animate-marquee flex items-center gap-12 font-mono text-xs tracking-widest text-white/50">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-4 shrink-0 hover:text-amber-400 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Principles Grid */}
      <div className="section-container pt-24 pb-16">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-2 uppercase tracking-wider font-semibold">
          <span>[04] // ENGINEERING PRINCIPLES & BENCHMARKS</span>
        </div>
        <h2 className="heading-section text-white mb-4">
          设计工程哲学与性能基准
        </h2>
        <p className="text-sm md:text-base text-text-secondary max-w-xl mb-14 leading-relaxed font-normal">
          无需喧哗，手感自会说话。将对渲染管线、物理计算与类型架构的严苛偏执，贯穿于每一行代码中。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {telemetryStats.map((stat, i) => (
            <div
              key={i}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {stat.num}
                  </span>
                  <span className="mono-tag text-[10px]">{stat.tag}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{stat.label}</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-normal">{stat.desc}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/5 text-[10px] font-mono text-white/40 flex justify-between">
                <span>BENCHMARK::0{i + 1}</span>
                <span className="text-emerald-400 font-bold">● VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Final Quiet, Confident CTA Banner */}
        <div className="relative rounded-3xl glass-panel p-8 sm:p-14 overflow-hidden text-center flex flex-col items-center justify-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

          <span className="mono-tag text-xs mb-4 text-amber-400 border-amber-500/30 font-medium">
            HANQIN // CRAFT & CODE
          </span>

          <h3 className="heading-section text-white max-w-2xl mx-auto mb-4 tracking-tight">
            持续探索自然无痕的前端交互与工程实现
          </h3>
          <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto mb-9 leading-relaxed font-normal">
            欢迎进入实验专区查看已规划的微动效动力学、创意计算与高阶设计系统组件。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/demos"
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-mono"
            >
              <span>查看实验专区入口</span>
              <span>&rarr;</span>
            </a>

            <button
              onClick={copyCommand}
              className="px-6 py-3.5 rounded-xl bg-black/50 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-mono transition-all active:scale-95 flex items-center gap-2 shadow-md"
            >
              <span>{copied ? '✓ 已复制 GitHub 链接' : '🔗 GitHub @hanqinu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
