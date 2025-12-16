import { takeEvery, call, put } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import type { Song, SongFormData } from '../types';
import {
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
} from '../redux/slices/songsSlice';
import { fetchStatsStart } from '../redux/slices/statsSlice';

// Fetch songs saga
function* fetchSongsSaga() {
  try {
    const songs: Song[] = yield call([apiService, apiService.getSongs]);
    yield put(fetchSongsSuccess(songs));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch songs';
    yield put(fetchSongsFailure(message));
  }
}

// Add song saga
function* addSongSaga(action: PayloadAction<SongFormData>) {
  try {
    const song: Song = yield call([apiService, apiService.createSong], action.payload);
    yield put(addSongSuccess(song));
    yield put(fetchStatsStart()); // Update stats after adding song
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add song';
    yield put(addSongFailure(message));
  }
}

// Update song saga
function* updateSongSaga(action: PayloadAction<{ id: string; data: SongFormData }>) {
  try {
    const song: Song = yield call([apiService, apiService.updateSong], action.payload.id, action.payload.data);
    yield put(updateSongSuccess(song));
    yield put(fetchStatsStart()); // Update stats after updating song
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update song';
    yield put(updateSongFailure(message));
  }
}

// Delete song saga
function* deleteSongSaga(action: PayloadAction<string>) {
  try {
    yield call([apiService, apiService.deleteSong], action.payload);
    yield put(deleteSongSuccess(action.payload));
    yield put(fetchStatsStart()); // Update stats after deleting song
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete song';
    yield put(deleteSongFailure(message));
  }
}

export default [
  takeEvery(fetchSongsStart.type, fetchSongsSaga),
  takeEvery(addSongStart.type, addSongSaga),
  takeEvery(updateSongStart.type, updateSongSaga),
  takeEvery(deleteSongStart.type, deleteSongSaga),
];