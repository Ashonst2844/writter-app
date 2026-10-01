import { defineConfig } from 'vite'
import visualizer from 'rollup-plugin-visualizer'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const shouldOpenBundleAnalyzer = process.env.OPEN_BUNDLE_ANALYZER === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    visualizer({
      filename: 'bundle-analysis.html',
      open: shouldOpenBundleAnalyzer,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
