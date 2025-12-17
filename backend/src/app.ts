import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import songRoutes from './routes/songs';
import { errorHandler } from './utils/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-song-management-system.vercel.app",
    ],
    credentials: true,
  })
);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/songs', songRoutes);

// Root API health route
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'MERN Song Management API is running 🚀' });
});

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;