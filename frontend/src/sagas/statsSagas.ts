import { takeEvery, call, put } from 'redux-saga/effects';
import { apiService } from '../services/api';
import type { Stats } from '../types';
import {
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
} from '../redux/slices/statsSlice';

// Fetch stats saga
function* fetchStatsSaga() {
  try {
    const stats: Stats = yield call([apiService, apiService.getStats]);
    yield put(fetchStatsSuccess(stats));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    yield put(fetchStatsFailure(message));
  }
}

export default [
  takeEvery(fetchStatsStart.type, fetchStatsSaga),
];