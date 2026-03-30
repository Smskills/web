
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
    
    // 2. Mount Backend API
    try {
      console.log('📦 Loading Backend...');
      // Use dynamic import to break potential module cycles
      const backendModule = await import('./backend/src/app.ts');
      const backendApp = backendModule.default || backendModule;

      if (typeof backendApp === 'function') {
        // Mount backend at root; it internally handles /api and /uploads
        app.use(backendApp);
        console.log('✅ Backend mounted successfully');
      } else {
        console.warn('⚠️ Backend module loaded but is not a function/middleware');
        console.log('Backend module type:', typeof backendApp);
        console.log('Backend module keys:', Object.keys(backendModule));
      }
    } catch (err: any) {
      console.error('❌ Backend failed to mount!');
      console.error('Error Name:', err.name);
      console.error('Error Message:', err.message);
      console.error('Error Stack:', err.stack);
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
      const distPath = path.join(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*all', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }

    // 4. Start listening AFTER mounting everything
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SERVER LISTENING: http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/ping`);
    });

  } catch (error) {
    console.error('❌ Startup Error:', error);
  }
}

startServer().catch(console.error);
