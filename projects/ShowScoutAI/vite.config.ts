import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  base: '/projects/ShowScoutAI/dist',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['showscout_icon_192.png', 'showscout_icon_512.png'],
      manifest: {
        name: 'ShowScout AI',
        short_name: 'ShowScoutAI',
        description: 'Track movie and TV production news with AI',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'showscout_icon_192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable'},
          { src: 'showscout_icon_512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable'},
        ],
      },
    }),
  ]
  ,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})