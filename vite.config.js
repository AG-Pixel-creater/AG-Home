import { defineConfig } from 'vite'

export default defineConfig({
  base: '/AG-Home/', 
  root: 'src',
  build: {
    outDir: '../dist'
  },
  publicDir: '../public',
  envDir: '..',  // Load .env from parent directory (project root)
  server: {
    middleware: [
      // Handle service worker with correct MIME type
      (req, res, next) => {
        if (req.url.endsWith('firebase-messaging-sw.js')) {
          res.setHeader('Content-Type', 'application/javascript');
          // Also set Service-Worker-Allowed header to allow broader scope
          res.setHeader('Service-Worker-Allowed', '/');
        }
        next();
      }
    ]
  }
})