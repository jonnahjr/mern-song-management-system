import { Request, Response, NextFunction } from 'express';
import { computeStats } from '../services/songService';

// Get statistics for songs
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await computeStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};