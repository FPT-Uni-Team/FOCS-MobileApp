import { all, fork } from 'redux-saga/effects';
import authSaga from './auth/authSaga';
import tableListSaga from './table/tableListSaga';
import notificationSaga from './notification/notificationSaga';
import soundSaga from './sound/soundSaga';
import localNotificationSaga from './notification/localNotificationSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga), 
    fork(tableListSaga), 
    fork(notificationSaga),
    fork(soundSaga),
    fork(localNotificationSaga),
  ]);
}
