// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    electron({
      entry: 'electron/main.ts', // this is your Electron main process
    }),
    renderer(), // support for Node.js in renderer
  ],
  server: {
    host: '0.0.0.0', // allow LAN access
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
