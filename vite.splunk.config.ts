import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env': '{}',
  },
  build: {
    outDir: 'dist-splunk',
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    lib: {
      entry: 'src/splunk/splunkMain.tsx',
      name: 'SplunkReactApp',
      formats: ['iife'],
      fileName: () => 'splunk_react_app',
    },
    rollupOptions: {
      output: {
        banner:
          ";(function(){try{var g=typeof globalThis!=='undefined'?globalThis:window;g.process=g.process||{env:{}};g.process.env=g.process.env||{};g.process.env.NODE_ENV=g.process.env.NODE_ENV||'production';}catch(e){}})();",
        inlineDynamicImports: true,
        entryFileNames: 'splunk_react_app.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'splunk_react_app.css'
          return 'asset-[name][extname]'
        },
      },
    },
    target: 'es2018',
  },
})
