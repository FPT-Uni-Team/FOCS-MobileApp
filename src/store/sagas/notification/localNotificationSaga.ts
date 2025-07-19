import { takeLatest } from 'redux-saga/effects';
import * as Notifications from 'expo-notifications';
import { addNotification } from '../../slices/notification/notificationSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { StaffNotification } from '../../../type/notification/notification';
import { call } from 'redux-saga/effects';

function* showLocalNotification(action: PayloadAction<StaffNotification>) {
  const { title, message } = action.payload;
  try {
    yield call(() =>
      Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          sound: 'default',
        },
        trigger: null,
      }),
    );
  } catch (e) {
    console.warn('Cannot present notification', e);
  }
}

export default function* localNotificationSaga() {
  yield takeLatest(addNotification.type, showLocalNotification);
} 