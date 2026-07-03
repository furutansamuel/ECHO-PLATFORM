import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

// Plugin to inject import maps for externalized dependencies
function injectImportMaps() {
  return {
    name: 'inject-import-maps',
    transformIndexHtml(html: string) {
      const importMap = `
    <script type="importmap">
      {
        "imports": {
          "recharts": "https://esm.sh/recharts@2.15.4?external=react,react-dom",
          "leaflet": "https://esm.sh/leaflet@1.9.4",
          "react-leaflet": "https://esm.sh/react-leaflet@5.0.0?external=react,react-dom,leaflet",
          "leaflet.markercluster": "https://esm.sh/leaflet.markercluster@1.5.3?external=leaflet",
          "react-leaflet-markercluster": "https://esm.sh/react-leaflet-markercluster@5.0.0-rc.0?external=react,react-dom,leaflet,react-leaflet"
        }
      }
    </script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />`;

      return html.replace('</head>', importMap + String.raw`
  ` + '</head>');
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    injectImportMaps(),
    react(),
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['recharts', 'leaflet', 'react-leaflet', 'leaflet.markercluster', 'react-leaflet-markercluster'],
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 5000,
    minify: false,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      maxParallelFileOps: 1,
      cache: false,
      external: [
        'recharts',
        'leaflet',
        'leaflet/dist/leaflet.css',
        'leaflet/dist/images/marker-icon.png',
        'leaflet/dist/images/marker-shadow.png',
        'react-leaflet',
        'leaflet.markercluster',
        'react-leaflet-markercluster',
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('leaflet') || id.includes('react-leaflet')) return 'vendor-maps';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('@supabase')) return 'vendor-supabase';
            return 'vendor-other';
          }
        },
      },
    },
  },
});