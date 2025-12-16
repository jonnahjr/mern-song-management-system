import express from 'express';
import {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
} from '../controllers/songController';
import { getStats } from '../controllers/statsController';
import { validateSongPayload } from '../utils/validators';

const router = express.Router();

// Statistics route (placed before param routes to avoid /stats matching :id)
router.get('/stats', getStats);

// CRUD routes for songs
router.post('/', validateSongPayload, createSong);
router.get('/', getSongs);
router.get('/:id', getSongById);
router.put('/:id', validateSongPayload, updateSong);
router.delete('/:id', deleteSong);

export default router;