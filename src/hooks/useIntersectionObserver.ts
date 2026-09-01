import { useState, useEffect, useRef } from 'react';
import type { RefCallback } from 'react';

export interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  triggerOnce = false,
}: IntersectionObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  const setRef = (node: Element | null) => {
    ref.current = node;
  };

  return { ref: setRef as RefCallback<Element>, isVisible };
}
