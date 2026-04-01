
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // 0. Immediate Health Check
  app.get('/ping', (req, res) => res.send('pong'));

  try {
    console.log(`🚀 Starting Unified Server on port ${PORT}...`);
    
    // 2. Mount Backend API
    try {
      console.log('📦 Loading Backend...');
      const backendModule = await import('./backend/src/app.ts');
      const backendApp = backendModule.default || backendModule;

      if (typeof backendApp === 'function') {
        app.use(backendApp);
        console.log('✅ Backend mounted successfully');
      }
    } catch (err: any) {
      console.error('❌ Backend failed to mount!', err.message);
    }

    // 3. Mount Frontend
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔧 Loading Vite...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(__dirname, 'dist');
      app.use(express.static(distPath));
      
      // Catch-all for SPA - with API guard (Express 5 syntax)
      app.get('(.*)', (req, res) => {
        if (req.path.startsWith('/api')) {
          return res.status(404).json({
            status: false,
            message: `API Route not found: ${req.originalUrl}`
          });
        }
        res.sendFile(path.join(distPath, 'index.html'));
      });
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
