import { Request, Response, NextFunction } from 'express';
import { ApiError } from './apiError';

type KnownError = ApiError | (Error & { statusCode?: number; code?: number; errors?: Record<string, { message: string }> });

export const errorHandler = (
  err: KnownError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = (err as ApiError).statusCode || 500;
  let message = err.message || 'Server Error';

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier';
  }

  // Mongoose duplicate key
  if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate value violates unique constraint';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && 'errors' in err && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: { message: string }) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};