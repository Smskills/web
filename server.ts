
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 0. Immediate Health Check
  app.get('/ping', (req, res) => res.send('pong'));

  try {
    console.log('🚀 Starting Unified Server...');
    
    // 1. Start listening immediately
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SERVER LISTENING: http://0.0.0.0:${PORT}`);
      console.log(`📡 Health check: http://0.0.0.0:${PORT}/ping`);
    });

    // 2. Mount Backend API
    try {
      console.log('📦 Loading Backend from ./backend/src/app.ts...');
      const backendModule = await import('./backend/src/app.ts');
      const backendApp = backendModule.default || backendModule;
      if (typeof backendApp === 'function') {
        app.use(backendApp);
        console.log('✅ Backend mounted successfully');
      } else {
        console.warn('⚠️ Backend module loaded but is not a function/middleware');
      }
    } catch (err) {
      console.error('❌ Backend failed to load:', err);
    }

    // 3. Mount Vite
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔧 Loading Vite...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('✅ Vite mounted');
    } else {
      app.use(express.static(path.join(__dirname, 'dist')));
      app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
    }

  } catch (error) {
    console.error('❌ Startup Error:', error);
  }
}

startServer().catch(console.error);
