export interface Song {
  _id: string;
  id?: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
}

export interface SongFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface Stats {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsPerGenre: { genre: string; count: number }[];
  songsPerArtist: { artist: string; count: number }[];
  albumsPerArtist: { artist: string; albumCount: number }[];
  songsPerAlbum: { album: string; count: number }[];
  latestSongs: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    createdAt: string;
  }[];
  topGenres: { genre: string; count: number }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}