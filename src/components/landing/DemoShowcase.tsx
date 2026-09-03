import React from 'react';
import { demos } from '@/data/demos';
import { soundEngine } from '@/utils/audio';

export default function DemoShowcase() {
  return (
    <section id="demos" className="section-container relative z-10 py-24 border-t border-white/10">
      {/* Sleek Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">
            <span>04 // LAB PROTOTYPES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Experimental Playground
          </h2>
        </div>

        <a
          href="/demos"
          onClick={() => soundEngine.playBurst()}
          className="inline-flex items-center gap-2 text-xs font-mono text-white/80 hover:text-white px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 transition-all w-fit"
        >
          <span>VIEW FULL ARCHIVE</span>
          <span>&rarr;</span>
        </a>
      </div>

      {/* Luxury Compact 3-Column Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demos.slice(0, 3).map((demo, idx) => (
          <a
            key={demo.slug}
            href={`/demos#${demo.slug}`}
            onMouseEnter={() => soundEngine.playPop(480 + idx * 60)}
            className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/40 hover:scale-[1.02] transition-all duration-300 group shadow-2xl relative overflow-hidden border border-white/10 bg-black/40"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
                <span className="font-mono text-[10px] text-white/40 tracking-wider">
                  EXP_0{idx + 1}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 text-white/50">
                  {demo.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {demo.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {demo.title}
                  </h3>
                  <span className="text-[10px] font-mono text-white/40 tracking-wider">
                    {demo.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-white/80 transition-colors">
              <span>EXPLORE EXPERIMENT</span>
              <span>&rarr;</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
