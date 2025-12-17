import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Song, SongFormData } from '../../types';

interface SongsState {
  songs: Song[];
  loading: boolean;
  error: string | null;
  selectedSong: Song | null;
  search: string;
  selectedGenre: string;
  selectedArtist: string;
  selectedSort: string;
}

const initialState: SongsState = {
  songs: [],
  loading: false,
  error: null,
  selectedSong: null,
  search: '',
  selectedGenre: '',
  selectedArtist: '',
  selectedSort: 'createdAt:desc',
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // Fetch songs
    fetchSongsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.loading = false;
      state.songs = action.payload;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Add song
    addSongStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false;
      state.songs.push(action.payload);
    },
    addSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update song
    updateSongStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false;
      const index = state.songs.findIndex(song => song._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete song
    deleteSongStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.songs = state.songs.filter(song => song._id !== action.payload);
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Select song
    setSelectedSong: (state, action: PayloadAction<Song | null>) => {
      state.selectedSong = action.payload;
    },

    // Set search
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    // Set selected genre
    setSelectedGenre: (state, action: PayloadAction<string>) => {
      state.selectedGenre = action.payload;
    },

    // Set selected artist
    setSelectedArtist: (state, action: PayloadAction<string>) => {
      state.selectedArtist = action.payload;
    },

    // Set selected sort
    setSelectedSort: (state, action: PayloadAction<string>) => {
      state.selectedSort = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchSongsStart,
  fetchSongsSuccess,
  fetchSongsFailure,
  addSongStart,
  addSongSuccess,
  addSongFailure,
  updateSongStart,
  updateSongSuccess,
  updateSongFailure,
  deleteSongStart,
  deleteSongSuccess,
  deleteSongFailure,
  setSelectedSong,
  setSearch,
  setSelectedGenre,
  setSelectedArtist,
  setSelectedSort,
  clearError,
} = songsSlice.actions;

export default songsSlice.reducer;