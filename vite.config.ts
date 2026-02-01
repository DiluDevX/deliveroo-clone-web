import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

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
        target: "https://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
