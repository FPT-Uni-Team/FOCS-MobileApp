import { all, fork } from 'redux-saga/effects';
import authSaga from './auth/authSaga';
import tableListSaga from './table/tableListSaga';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(tableListSaga)]);
}
