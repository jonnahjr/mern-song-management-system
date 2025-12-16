import mongoose from 'mongoose';
import Song, { ISong } from '../models/Song';
import { ApiError } from '../utils/apiError';

export interface SongPayload {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export const createSong = async (payload: SongPayload): Promise<ISong> => {
  const song = new Song(payload);
  return song.save();
};

export const listSongs = async (genre?: string): Promise<ISong[]> => {
  const filter = genre ? { genre } : {};
  return Song.find(filter).sort({ createdAt: -1 });
};

export const findSongById = async (id: string): Promise<ISong> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError('Invalid song id', 400);
  }

  const song = await Song.findById(id);
  if (!song) {
    throw new ApiError('Song not found', 404);
  }
  return song;
};

export const updateSong = async (id: string, payload: SongPayload): Promise<ISong> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError('Invalid song id', 400);
  }

  const updated = await Song.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new ApiError('Song not found', 404);
  }

  return updated;
};

export const deleteSong = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError('Invalid song id', 400);
  }

  const deleted = await Song.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError('Song not found', 404);
  }
};

export interface SongStats {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsPerGenre: { genre: string; count: number }[];
  songsPerArtist: { artist: string; count: number }[];
  albumsPerArtist: { artist: string; albumCount: number }[];
  songsPerAlbum: { album: string; count: number }[];
  latestSongs: { title: string; artist: string; album: string; genre: string; createdAt: Date }[];
  topGenres: { genre: string; count: number }[];
}

export const computeStats = async (): Promise<SongStats> => {
  const stats = await Song.aggregate([
    {
      $facet: {
        totalCounts: [
          {
            $group: {
              _id: null,
              totalSongs: { $sum: 1 },
              artists: { $addToSet: '$artist' },
              albums: { $addToSet: '$album' },
              genres: { $addToSet: '$genre' },
            },
          },
          {
            $project: {
              _id: 0,
              totalSongs: 1,
              totalArtists: { $size: '$artists' },
              totalAlbums: { $size: '$albums' },
              totalGenres: { $size: '$genres' },
            },
          },
        ],
        songsPerGenre: [
          {
            $group: {
              _id: '$genre',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          {
            $project: {
              _id: 0,
              genre: '$_id',
              count: 1,
            },
          },
        ],
        songsPerArtist: [
          {
            $group: {
              _id: '$artist',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          {
            $project: {
              _id: 0,
              artist: '$_id',
              count: 1,
            },
          },
        ],
        albumsPerArtist: [
          {
            $group: {
              _id: '$artist',
              albums: { $addToSet: '$album' },
            },
          },
          {
            $project: {
              _id: 0,
              artist: '$_id',
              albumCount: { $size: '$albums' },
            },
          },
          { $sort: { albumCount: -1 } },
        ],
        songsPerAlbum: [
          {
            $group: {
              _id: '$album',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          {
            $project: {
              _id: 0,
              album: '$_id',
              count: 1,
            },
          },
        ],
        latestSongs: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 0,
              title: 1,
              artist: 1,
              album: 1,
              genre: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        totalSongs: { $arrayElemAt: ['$totalCounts.totalSongs', 0] },
        totalArtists: { $arrayElemAt: ['$totalCounts.totalArtists', 0] },
        totalAlbums: { $arrayElemAt: ['$totalCounts.totalAlbums', 0] },
        totalGenres: { $arrayElemAt: ['$totalCounts.totalGenres', 0] },
        songsPerGenre: 1,
        songsPerArtist: 1,
        albumsPerArtist: 1,
        songsPerAlbum: 1,
        latestSongs: 1,
        topGenres: { $slice: ['$songsPerGenre', 3] },
      },
    },
  ]);

  const empty: SongStats = {
    totalSongs: 0,
    totalArtists: 0,
    totalAlbums: 0,
    totalGenres: 0,
    songsPerGenre: [],
    songsPerArtist: [],
    albumsPerArtist: [],
    songsPerAlbum: [],
    latestSongs: [],
    topGenres: [],
  };

  return stats[0] ?? empty;
};

