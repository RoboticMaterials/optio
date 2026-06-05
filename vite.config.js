import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { readFileSync } from 'fs'

export default defineConfig({
  plugins: [
    // Tell esbuild to parse .js files in src/ as JSX during dep optimization
    // (the actual JSX→JS transform is left to @vitejs/plugin-react so that
    // React Fast Refresh preamble injection works correctly).
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/src\/.*\.js$/.test(id)) return null
        // Only re-parse with the jsx loader; preserve source maps.
        // Do NOT use jsx:'automatic' here – that would strip JSX before
        // @vitejs/plugin-react can inject the HMR preamble.
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
        })
      },
    },
    svgr(),
    react({ include: /\.(jsx|js|tsx|ts)$/ }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  define: {
    // Some CJS packages (e.g. local-storage) reference the Node global.
    global: 'globalThis',
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
  optimizeDeps: {
    include: ['d3'],
    exclude: ['@testing-library/react', '@testing-library/dom'],
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      plugins: [
        {
          // d3 v3 is a bare IIFE: !function() { var d3_document = this.document; ... }()
          // In ESM strict mode `this` is undefined. Patch the three top-level
          // `this.<GlobalAPI>` references before esbuild processes the file.
          name: 'fix-d3-v3-global-this',
          setup(build) {
            build.onLoad({ filter: /\/d3\/d3\.js$/ }, (args) => {
              let contents = readFileSync(args.path, 'utf8')
              contents = contents
                .replace(
                  'var d3_document = this.document',
                  'var _d3global = (typeof globalThis!=="undefined"?globalThis:typeof window!=="undefined"?window:self); var d3_document = _d3global.document'
                )
                .replace('this.Element.prototype', '_d3global.Element.prototype')
                .replace('this.CSSStyleDeclaration.prototype', '_d3global.CSSStyleDeclaration.prototype')
                .replace(/\bthis\.navigator\b/g, '_d3global.navigator')
              return { contents, loader: 'js' }
            })
          },
        },
      ],
    },
  },
})

