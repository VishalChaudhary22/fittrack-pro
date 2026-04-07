import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FitTrack Pro',
        short_name: 'FitTrack',
        description: 'Kinetic Elite Fitness Tracker',
        theme_color: '#f85f1b',
        background_color: '#090a0f',
        display: 'standalone',
        icons: [
          {
            src: '/fittrack-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/fittrack-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
