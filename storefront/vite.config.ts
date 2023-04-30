import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
    plugins: [react(), VitePWA()],
    resolve: {
        alias: {
          'src': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 4200
    },
    build: {
        outDir: './build/dist'
    }
})