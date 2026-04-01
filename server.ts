
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // 1. Immediate Health Check
  app.get('/ping', (req, res) => res.send('pong'));

  try {
    console.log(`🚀 Starting Dedicated Backend API Server on port ${PORT}...`);
    
    // 2. Mount Backend API
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
      // Don't exit if we want to at least serve the frontend
    }

    // 3. Serve Frontend (Production)
    const distPath = path.join(__dirname, 'dist');
    if (path.resolve(__dirname).includes('node_modules')) {
      // If we are in node_modules, we need to go up
    }
    
    console.log(`📂 Checking for frontend at: ${distPath}`);
    
    // Serve static files from the dist directory
    app.use(express.static(distPath));

    // Handle SPA routing - redirect all non-API requests to index.html
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

    // 4. Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 BACKEND API LISTENING: http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/ping`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Startup Error:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);
