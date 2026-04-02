
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  // 1. Immediate Health Check
  app.get('/ping', (req, res) => res.send('pong'));

  try {
    console.log(`🚀 Starting Dedicated Backend API Server on port ${PORT}...`);
    
    // 2. Load and Mount Backend API
    try {
      console.log('📦 Loading Backend Modules...');
      const backendModule = await import('./backend/src/app.ts');
      const backendApp = backendModule.default || backendModule;

      if (typeof backendApp === 'function') {
        app.use(backendApp);
        console.log('✅ Backend mounted successfully');
      }
    } catch (err: any) {
      console.error('❌ Backend failed to mount!', err.message);
    }

    // 3. Serve Frontend
    if (!isProd) {
      // Development: Use Vite middleware
      console.log('🛠️ Starting Vite in middleware mode...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('✅ Vite middleware mounted');
    } else {
      // Production: Serve static files from dist
      const distPath = path.join(__dirname, 'dist');
      console.log(`📂 Serving production frontend from: ${distPath}`);
      app.use(express.static(distPath));

      // Handle SPA routing
      app.get('*all', (req, res) => {
        // Skip API routes which should have been handled by backendApp
        if (req.path.startsWith('/api')) {
          return res.status(404).json({ status: false, message: 'API Route not found' });
        }
        
        const indexPath = path.join(distPath, 'index.html');
        res.sendFile(indexPath, (err) => {
          if (err) {
            res.status(404).send('Frontend not built. Run "npm run build" first.');
          }
        });
      });
    }

    // 4. Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SERVER LISTENING: http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/ping`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Startup Error:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
