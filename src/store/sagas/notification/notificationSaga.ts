import { call, select, takeLatest, put } from 'redux-saga/effects';
import { signalrInstance } from '../../../services/signalrService';
import * as Notifications from 'expo-notifications';
import { clearNotifications } from '../../slices/notification/notificationSlice';

function* handleStopSignalR() {
  yield call([signalrInstance, signalrInstance.disconnect]);

 
  try {
    yield call(Notifications.cancelAllScheduledNotificationsAsync);
    yield call(Notifications.dismissAllNotificationsAsync);
  } catch {}

  
  yield put(clearNotifications());
}

function* handleStartSignalR() {
  const accessToken: string | null = yield select((state) => state.auth.accessToken);
  yield call([signalrInstance, signalrInstance.connect], accessToken ?? '');
}

export default function* notificationSaga() {
  yield takeLatest('auth/loginSuccess', handleStartSignalR);
  yield takeLatest('auth/logout', handleStopSignalR);
} 