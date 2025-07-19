import { call, takeLatest } from 'redux-saga/effects';
import soundService from '../../../services/soundService';
import { addNotification } from '../../slices/notification/notificationSlice';

function* handlePlayNotificationSound() {
  yield call([soundService, soundService.playSound]);
}

function* soundSaga() {
  yield takeLatest(addNotification.type, handlePlayNotificationSound);
}

export default soundSaga; 