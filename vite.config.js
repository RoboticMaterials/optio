import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    // Pre-transform .js files in src/ as JSX so that vite:define (which uses
    // esbuild with the 'js' loader) doesn't choke on JSX syntax before the
    // React plugin has a chance to handle it.
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id)) return null
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
          jsxImportSource: 'react',
        })
      },
    },
    svgr(),
    react({ include: /\.(jsx|js)$/ }),
  ],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['@testing-library/react', '@testing-library/dom'],
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
})

