import { Request, Response, NextFunction } from 'express';
import { ApiError } from './apiError';
import { SongPayload } from '../services/songService';

// Simple payload validator to keep controllers lean and ensure required fields exist.
export const validateSongPayload = (req: Request, _res: Response, next: NextFunction): void => {
  const requiredFields: Array<keyof SongPayload> = ['title', 'artist', 'album', 'genre'];

  const missing = requiredFields.filter((field) => {
    const value = req.body?.[field];
    return value === undefined || value === null || String(value).trim().length === 0;
  });

  if (missing.length > 0) {
    return next(new ApiError(`Missing or empty fields: ${missing.join(', ')}`, 400));
  }

  next();
};

