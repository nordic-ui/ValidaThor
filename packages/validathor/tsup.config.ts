import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', '!src/**/*.test.*'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  outExtension: (ctx) => {
    return { js: `.${ctx.format}.js` }
  },
  splitting: false,
  sourcemap: true,
  clean: true,
})
