import { useRef } from 'react';
import type { RefCallback } from 'react';
import { useInViewport } from 'ahooks';

export { useInViewport };

export interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

export function useIntersectionObserver(options: IntersectionObserverOptions = {}) {
  const elementRef = useRef<Element | null>(null);
  const [inViewport] = useInViewport(elementRef, {
    threshold: options.threshold,
    rootMargin: options.rootMargin,
  });

  const setRef = (node: Element | null) => {
    elementRef.current = node;
  };

  return {
    ref: setRef as RefCallback<Element>,
    isVisible: !!inViewport,
  };
}
