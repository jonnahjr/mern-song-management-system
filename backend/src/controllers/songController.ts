import { Request, Response, NextFunction } from 'express';
import {
  createSong as createSongService,
  listSongs,
  findSongById,
  updateSong as updateSongService,
  deleteSong as deleteSongService,
} from '../services/songService';

// Create a new song
export const createSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const savedSong = await createSongService(req.body);
    res.status(201).json(savedSong);
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

// Get all songs
export const getSongs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { genre, search, artist, sort } = req.query as { genre?: string; search?: string; artist?: string; sort?: string };
    const songs = await listSongs(genre, search, artist, sort);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

// Get a single song by ID
export const getSongById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const song = await findSongById(id);
    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
};

// Update a song by ID
export const updateSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedSong = await updateSongService(id, req.body);
    res.status(200).json(updatedSong);
  } catch (error) {
    next(error);
  }
};

// Delete a song by ID
export const deleteSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteSongService(id);
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};