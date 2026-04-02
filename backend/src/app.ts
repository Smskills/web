
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.ts';
import { errorHandler } from './middleware/error.middleware.ts';
import { ENV } from './config/env.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

const allowedOrigins = [
  'https://ais-dev-fwqzcdx5racjd5xyqifq67-57272006855.asia-east1.run.app',
  'https://ais-pre-fwqzcdx5racjd5xyqifq67-57272006855.asia-east1.run.app',
  'https://web-1-civ6.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to true for development flexibility, or restrict as needed
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: ENV.UPLOAD_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: ENV.UPLOAD_LIMIT }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', apiRoutes);

// Catch-all for unknown API routes
app.use('/api/*all', (req, res) => {
  res.status(404).json({
    status: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

// Error Handling
app.use(errorHandler);

export default app;
