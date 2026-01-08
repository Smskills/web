import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Required for serving local uploads
}));
app.use(cors());

// Logging
app.use(morgan('dev'));

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Files (Uploads)
// Fix: Replaced environment-dependent '__dirname' with robust 'process.cwd()' path resolution for ESM compatibility
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));

// API Routes
app.use('/api', apiRoutes);

// Error Handling
app.use(errorHandler);

export default app;