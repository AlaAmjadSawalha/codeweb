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
});
