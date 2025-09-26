import { takeLatest } from 'redux-saga/effects';
import { addNotification } from '../../slices/notification/notificationSlice';
import { call } from 'redux-saga/effects';
import soundService from '../../../services/soundService';

function* showLocalNotification() {
  try {
    yield call([soundService, soundService.playSound]);
  } catch (e) {
  }
}

export default function* localNotificationSaga() {
  yield takeLatest(addNotification.type, showLocalNotification);
} 