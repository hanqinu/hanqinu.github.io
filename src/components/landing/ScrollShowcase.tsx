import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/utils/cn';

const cards = [
  { icon: '⚛️', title: 'React', desc: 'Component-driven UI architecture' },
  { icon: '🚀', title: 'Astro', desc: 'Zero JS, maximum performance' },
  { icon: '🧊', title: 'Three.js', desc: 'Immersive WebGL experiences' },
  { icon: '🎬', title: 'GSAP', desc: 'Professional web animation' },
  { icon: '💙', title: 'TypeScript', desc: 'Type-safe scalable code' },
  { icon: '🎨', title: 'UnoCSS', desc: 'Instant atomic CSS engine' },
];

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !containerRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const cardsElements = track.querySelectorAll('.showcase-card');

    const ctx = gsap.context(() => {
      // Horizontal scroll
      const tl = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Enter animations for cards
      cardsElements.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left right',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className={cn(
        'w-full bg-bg-secondary flex items-center relative',
        isMobile ? 'min-h-screen overflow-visible py-12' : 'h-screen overflow-hidden',
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          'flex',
          isMobile
            ? 'flex-col space-y-6 px-6 py-24 h-auto w-full'
            : 'h-full items-center px-[10vw] space-x-12',
        )}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className={cn(
              'showcase-card glass rounded-3xl p-8 shrink-0 flex flex-col justify-between border border-white/5 relative overflow-hidden group',
              isMobile ? 'w-full h-auto' : 'w-[400px] h-[500px]',
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="text-6xl mb-6">{card.icon}</div>
              <h3 className="heading-2 mb-4 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">{card.desc}</p>
            </div>
            <div className="mt-8 text-primary font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">
              0{i + 1} // TECH_STACK
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
