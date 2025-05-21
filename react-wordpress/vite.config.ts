import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'functions.php',
          dest: '.' // -> yensi-theme/functions.php
        },
        {
          src: 'index.php',
          dest: '.' // -> yensi-theme/index.php
        },
        {
          src: 'style.css',
          dest: '.' // -> yensi-theme/style.css
        }
      ]
    }),
  ],
  build: {
    outDir: 'yensi-theme',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: ({ name }) =>
          name?.endsWith('.css') ? 'assets/index.css' : 'assets/[name].[ext]',
      },
    },
  },
});
