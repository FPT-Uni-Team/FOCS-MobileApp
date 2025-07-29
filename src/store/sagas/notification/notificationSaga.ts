import { call, select, takeLatest, put } from 'redux-saga/effects';
import { signalrInstance } from '../../../services/signalrService';
import { clearNotifications } from '../../slices/notification/notificationSlice';
import FirebaseNotificationService from '../../../services/firebaseNotificationService';

function* handleStopSignalR() {
  yield call([signalrInstance, signalrInstance.disconnect]);

  try {
    const notificationService = FirebaseNotificationService.getInstance();
    yield call([notificationService, notificationService.unregisterToken]);
  } catch (error) {
  }

  yield put(clearNotifications());
}

function* handleStartSignalR() {
  const accessToken: string | null = yield select((state) => state.auth.accessToken);
  
  if (accessToken) {
    yield call([signalrInstance, signalrInstance.connect], accessToken);
  }
}

function* handleAuthStateChange(): Generator<any, void, any> {
  const state: any = yield select((state: any) => state.auth);
  
  if (state.isAuthenticated && state.accessToken && state.isInitialized) {
    yield call(handleStartSignalR);
  }
}

export default function* notificationSaga() {
  yield takeLatest('auth/loginSuccess', handleStartSignalR);
  yield takeLatest('auth/initializeAuth', handleAuthStateChange);
  yield takeLatest('auth/logout', handleStopSignalR);
} 