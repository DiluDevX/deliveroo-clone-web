import { defineConfig } from "vite";
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
        target: "http://localhost:4000", // Backend URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional rewrite
      },
    },
  },
});
