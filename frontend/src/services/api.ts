import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { Song, SongFormData, Stats } from '../types';

// Single source of truth for backend URL.
// In production, Vercel must define VITE_API_BASE_URL (e.g. https://mern-song-management-system.onrender.com).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth headers if needed
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors
        if (error.response?.status === 404) {
          throw new Error('Resource not found');
        }
        if (error.response?.status === 400) {
          throw new Error(error.response.data.message || 'Bad request');
        }
        if (error.response?.status >= 500) {
          throw new Error('Server error');
        }
        throw error;
      }
    );
  }

  // Songs API
  async getSongs(search?: string, genre?: string, artist?: string, sort?: string): Promise<Song[]> {
    const params: any = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    if (artist) params.artist = artist;
    if (sort) params.sort = sort;
    const response: AxiosResponse<Song[]> = await this.api.get('/api/songs', { params });
    return response.data;
  }

  async getSongById(id: string): Promise<Song> {
    const response: AxiosResponse<Song> = await this.api.get(`/api/songs/${id}`);
    return response.data;
  }

  async createSong(songData: SongFormData): Promise<Song> {
    const response: AxiosResponse<Song> = await this.api.post('/api/songs', songData);
    return response.data;
  }

  async updateSong(id: string, songData: SongFormData): Promise<Song> {
    const response: AxiosResponse<Song> = await this.api.put(`/api/songs/${id}`, songData);
    return response.data;
  }

  async deleteSong(id: string): Promise<void> {
    await this.api.delete(`/api/songs/${id}`);
  }

  // Stats API
  async getStats(): Promise<Stats> {
    const response: AxiosResponse<Stats> = await this.api.get('/api/songs/stats');
    return response.data;
  }
}

export const apiService = new ApiService();