import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import uno from '@unocss/astro';

export default defineConfig({
  output: 'static',
  prefetch: true,
  devToolbar: { enabled: false },
  server: { port: 4321, host: true },
  integrations: [react(), uno()],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            codemirror: [
              'codemirror',
              '@codemirror/lang-javascript',
              '@codemirror/lang-html',
              '@codemirror/lang-css',
              '@codemirror/theme-one-dark',
            ],
          },
        },
      },
    },
  },
});
