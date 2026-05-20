import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],

  build: {
    commonjsOptions: {
      include: [/lottie-web/, /node_modules/],
      transformMixedEsModules: true,
    },
  },

  optimizeDeps: {
    include: ["lottie-web"],
  },

  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: process.env.BFF_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost:3000",
      },
    },
    setupFiles: "./tests/setup.ts",
    globals: false,
    css: true,
  },
});
