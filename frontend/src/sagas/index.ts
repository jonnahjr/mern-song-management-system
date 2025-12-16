import { all } from 'redux-saga/effects';
import songsSagas from './songsSagas';
import statsSagas from './statsSagas';

export default function* rootSaga() {
  yield all([
    ...songsSagas,
    ...statsSagas,
  ]);
}