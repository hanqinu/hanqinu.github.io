import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno({
      dark: 'class',
    }),
  ],
  theme: {
    colors: {
      obsidian: '#090a0f',
      surface: {
        50: '#ffffff',
        100: '#161922',
        200: '#12141c',
        300: '#0d0f15',
        card: 'rgba(255, 255, 255, 0.03)',
        cardHover: 'rgba(255, 255, 255, 0.06)',
      },
      accent: {
        amber: '#f97316',
        amberLight: '#fb923c',
        cobalt: '#6366f1',
        cobaltLight: '#818cf8',
        emerald: '#10b981',
        emeraldLight: '#34d399',
      },
    },
  },
  rules: [
    [
      'glass-card',
      {
        'backdrop-filter': 'blur(20px)',
        '-webkit-backdrop-filter': 'blur(20px)',
        background: 'rgba(18, 20, 28, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
      },
    ],
    [
      'glass-subtle',
      {
        'backdrop-filter': 'blur(12px)',
        '-webkit-backdrop-filter': 'blur(12px)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
    ],
    [
      'border-hairline',
      {
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
    ],
    [
      'border-hairline-hover',
      {
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
    ],
    [
      'bg-grid-pattern',
      {
        'background-size': '32px 32px',
        'background-image':
          'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
      },
    ],
    [
      'bg-dot-pattern',
      {
        'background-size': '24px 24px',
        'background-image': 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
      },
    ],
    [
      'text-gradient-amber',
      {
        background: 'linear-gradient(135deg, #ffffff 0%, #fb923c 50%, #f97316 100%)',
        'background-clip': 'text',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
    ],
    [
      'text-gradient-silver',
      {
        background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
        'background-clip': 'text',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
    ],
  ],
  shortcuts: {
    'section-container': 'px-6 py-20 md:px-12 lg:px-20 max-w-7xl mx-auto',
    'heading-hero':
      'text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none',
    'heading-section': 'text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight',
    'heading-card': 'text-lg sm:text-xl font-bold tracking-tight',
    'mono-tag':
      'font-mono text-xs tracking-wider uppercase px-2.5 py-1 rounded border border-white/10 bg-white/5 text-white/70',
  },
});
