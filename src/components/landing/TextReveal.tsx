import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/utils/cn';

interface TextRevealProps {
  text: string;
  className?: string;
}

export default function TextReveal({ text, className }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  const { ref: observerRef, isVisible } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true,
  });

  const chars = text
    .split('')
    .map((char, i) => (
      <span
        key={i}
        className="inline-block opacity-0 translate-y-5"
        dangerouslySetInnerHTML={{ __html: char === ' ' ? '&nbsp;' : char }}
      />
    ));

  useEffect(() => {
    if (!isVisible || !textRef.current || !tagsRef.current) return;

    const ctx = gsap.context(() => {
      const charElements = textRef.current?.querySelectorAll('span');
      if (charElements) {
        gsap.to(charElements, {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.6,
          ease: 'power3.out',
        });
      }

      gsap.to(tagsRef.current?.children || [], {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isVisible]);

  return (
    <section
      ref={(el) => {
        containerRef.current = el;
        observerRef(el);
      }}
      className="section-container py-32 flex flex-col items-center text-center"
    >
      <h2 ref={textRef} className={cn('heading-1 mb-12', className)}>
        {chars}
      </h2>

      <div ref={tagsRef} className="flex flex-wrap justify-center gap-4">
        {['Frontend Magic', '3D Graphics', 'Creative Coding', 'Performant Web'].map((tag, i) => (
          <span
            key={i}
            className="opacity-0 translate-y-4 px-6 py-2 rounded-full border border-white/10 glass text-text-secondary text-sm font-medium tracking-wide"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
