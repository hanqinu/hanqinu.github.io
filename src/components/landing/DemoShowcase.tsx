import React from 'react';
import { demos } from '@/data/demos';

export default function DemoShowcase() {
  const statusBadgeMap = {
    incubation: {
      text: '● 孵化中 INCUBATING',
      className: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    planned: {
      text: '○ 规划中 PLANNED',
      className: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
    tbd: {
      text: '◌ 概念筹备 TBD',
      className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  };

  return (
    <section id="demos" className="section-container relative z-10 py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-2 uppercase tracking-wider">
            <span>[03] // LAB EXPERIMENTS GATEWAY</span>
          </div>
          <h2 className="heading-section text-white">
            实验探索画廊入口
          </h2>
        </div>

        <p className="text-sm md:text-base text-text-secondary max-w-md">
          实验室孵化与探索通道，汇聚前端交互手感、创意计算与高阶设计系统实验。
        </p>
      </div>

      {/* Demo Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {demos.map((demo, idx) => {
          const statusInfo = statusBadgeMap[demo.status];
          return (
            <div
              key={demo.slug}
              className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group shadow-2xl relative overflow-hidden"
            >
              <div>
                {/* Window Bar Header */}
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[10px] text-white/40">
                      exp_0{idx + 1}::{demo.slug}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                </div>

                {/* Card Title & Icon */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-100/90 border border-white/15 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-md">
                    {demo.icon}
                  </div>
                  <div>
                    <h3 className="heading-card text-white group-hover:text-amber-400 transition-colors">
                      {demo.title}
                    </h3>
                    <span className="text-[10px] font-mono text-white/40 tracking-wider">
                      {demo.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-text-secondary mb-6 leading-relaxed min-h-[38px]">
                  {demo.description}
                </p>

                {/* Conceptual Wireframe Blueprint Stage */}
                <div className="rounded-2xl bg-black/60 border border-white/10 p-4 mb-6 h-36 flex flex-col justify-between relative overflow-hidden shadow-inner font-mono select-none">
                  <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                  
                  <div className="flex items-center justify-between text-[10px] text-white/40 relative z-10">
                    <span>TRACK_ID: 0{idx + 1}</span>
                    <span className="text-amber-400/80">LAB_INCUBATOR</span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2 relative z-10 text-center">
                    <div className="w-8 h-8 rounded-full border border-dashed border-white/30 flex items-center justify-center text-xs text-white/60 mb-2">
                      +
                    </div>
                    <span className="text-[11px] text-white/70 font-semibold">
                      [ SPECIFICATION_TBD ]
                    </span>
                    <span className="text-[9px] text-white/40 mt-0.5">
                      待定实验功能接入中
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-white/30 pt-1 border-t border-white/5 relative z-10">
                    <span>ASTRO 5 + REACT 19</span>
                    <span>READY FOR MOUNT</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {demo.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="mono-tag text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Entrance Link Button */}
              <a
                href="/demos"
                className="w-full py-3.5 rounded-xl bg-black/40 hover:bg-amber-500 text-white text-xs font-semibold font-mono flex items-center justify-center gap-2 border border-white/15 hover:border-amber-400 transition-all duration-300 shadow-md group-hover:shadow-amber-500/20"
              >
                <span>查看实验专区入口</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
