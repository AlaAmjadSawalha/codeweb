import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure PostCSS + Tailwind run reliably (fixes unprocessed @tailwind in index.css).
  css: {
    postcss: path.resolve(__dirname, "postcss.config.cjs"),
  },
  // Dev: same-origin /api → Laravel (avoids CORS and "Connection error" when frontend is on :5173).
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
