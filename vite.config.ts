import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig(({ command, isSsrBuild }) => ({
  appType: 'custom',
  plugins: [
    solid({ ssr: true, serverFunctions: true }),
    command === 'serve' && devServer({
      entry: './server/app.ts',
      injectClientScript: false,
    }),
  ],
  build: isSsrBuild
    ? {
        outDir: 'dist/server',
        copyPublicDir: false,
        rollupOptions: {
          output: {
            entryFileNames: 'index.js',
          },
        },
      }
    : {
        outDir: 'dist/client',
        manifest: true,
        rollupOptions: {
          input: './src/entry-client.tsx',
        },
      },
  ssr: {
    noExternal: ['@solidjs/router'],
  },
}))
