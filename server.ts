
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
      process.exit(1); // Exit if backend fails to load
    }

    // 3. Start listening
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
