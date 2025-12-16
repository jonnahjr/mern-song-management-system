import app from './app';
import connectDB from './config/database';
import { env } from './config/env';

// Connect to database
connectDB();

// Start server
const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});