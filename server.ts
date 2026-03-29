
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import backendApp from './backend/src/app.ts';

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
      console.log('📦 Mounting Backend...');
      if (typeof backendApp === 'function') {
        // Mount backend specifically on /api and /uploads
        // backend/src/app.ts handles the routes internally
        app.use('/api', backendApp);
        app.use('/uploads', backendApp);
        console.log('✅ Backend mounted on /api and /uploads');
      } else {
        console.warn('⚠️ Backend module loaded but is not a function/middleware');
      }
    } catch (err) {
      console.error('❌ Backend failed to mount:', err);
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
      app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }

    // 4. Start listening AFTER mounting everything
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SERVER LISTENING: http://0.0.0.0:${PORT}`);
      console.log(`📡 Health check: http://0.0.0.0:${PORT}/ping`);
    });

  } catch (error) {
    console.error('❌ Startup Error:', error);
  }
}

startServer().catch(console.error);
