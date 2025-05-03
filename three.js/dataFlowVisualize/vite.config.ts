import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", 
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: ["date-fns"],
  },
  server: {
    port: 3250, 
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ws": {
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
