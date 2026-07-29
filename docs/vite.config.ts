import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 8080,
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 5000,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
            if (id.includes("leaflet") || id.includes("react-leaflet")) return "vendor-maps";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("@supabase")) return "vendor-supabase";
            return "vendor-other";
          }
        },
      },
    },
  },
});
