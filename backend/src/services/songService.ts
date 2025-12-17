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

export const listSongs = async (genre?: string, search?: string, artist?: string, sort?: string, order?: string): Promise<ISong[]> => {
  const filter: any = {};
  if (genre) {
    filter.genre = genre;
  }
  if (artist) {
    filter.artist = artist;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { artist: { $regex: search, $options: 'i' } },
      { album: { $regex: search, $options: 'i' } },
      { genre: { $regex: search, $options: 'i' } },
    ];
  }
  let sortOption: any = { createdAt: -1 };
  if (sort && order) {
    sortOption = { [sort]: order === 'desc' ? -1 : 1 };
  }
  return Song.find(filter).sort(sortOption);
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
  // Advanced statistics
  top5Genres: { genre: string; count: number }[];
  mostProductiveArtist: { artist: string; songCount: number } | null;
  averageSongsPerAlbum: number;
  // Hierarchical view: artist -> albums -> songs
  artistAlbumSongTree: {
    artist: string;
    albums: {
      album: string;
      songs: { title: string; genre: string; createdAt: Date }[];
    }[];
  }[];
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
        // Hierarchical artist -> albums -> songs
        artistAlbumSongTree: [
          {
            $group: {
              _id: {
                artist: '$artist',
                album: '$album',
              },
              songs: {
                $push: {
                  title: '$title',
                  genre: '$genre',
                  createdAt: '$createdAt',
                },
              },
            },
          },
          {
            $group: {
              _id: '$_id.artist',
              albums: {
                $push: {
                  album: '$_id.album',
                  songs: '$songs',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              artist: '$_id',
              albums: 1,
            },
          },
          { $sort: { artist: 1 } },
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
        top5Genres: { $slice: ['$songsPerGenre', 5] },
        mostProductiveArtist: {
          $cond: [
            { $gt: [{ $size: '$songsPerArtist' }, 0] },
            {
              artist: { $arrayElemAt: ['$songsPerArtist.artist', 0] },
              songCount: { $arrayElemAt: ['$songsPerArtist.count', 0] },
            },
            null,
          ],
        },
        averageSongsPerAlbum: {
          $cond: [
            { $gt: [{ $arrayElemAt: ['$totalCounts.totalAlbums', 0] }, 0] },
            {
              $divide: [
                { $arrayElemAt: ['$totalCounts.totalSongs', 0] },
                { $arrayElemAt: ['$totalCounts.totalAlbums', 0] },
              ],
            },
            0,
          ],
        },
        artistAlbumSongTree: 1,
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
    top5Genres: [],
    mostProductiveArtist: null,
    averageSongsPerAlbum: 0,
    artistAlbumSongTree: [],
  };

  return stats[0] ?? empty;
};

