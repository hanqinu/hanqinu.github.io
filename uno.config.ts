import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno({
      dark: 'class',
    }),
  ],
  rules: [
    [
      'glass',
      {
        'backdrop-filter': 'blur(16px)',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      },
    ],
    [
      'text-gradient',
      {
        'background-clip': 'text',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
    ],
    [
      /^glow-(sm|md|lg)$/,
      ([, size]) => {
        const shadowMap: Record<string, string> = {
          sm: '0 0 10px rgba(139, 92, 246, 0.3)',
          md: '0 0 20px rgba(139, 92, 246, 0.5)',
          lg: '0 0 30px rgba(139, 92, 246, 0.7)',
        };
        return { 'box-shadow': shadowMap[size] };
      },
    ],
  ],
  shortcuts: {
    'section-container': 'px-6 py-24 md:px-12 lg:px-24 max-w-7xl mx-auto',
    'heading-1': 'text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight',
    'heading-2': 'text-2xl md:text-4xl font-bold tracking-tight',
    'heading-3': 'text-xl md:text-2xl font-semibold',
  },
});
