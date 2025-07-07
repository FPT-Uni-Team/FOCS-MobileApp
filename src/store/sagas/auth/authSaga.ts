import { call, put, takeLatest, all, fork } from 'redux-saga/effects';
import { login } from '../../../services/authService';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  initializeAuth,
} from '../../slices/auth/authSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  access_token: string | null;
  refresh_token: string | null;
  errors: string[] | null;
  is_succes: boolean;
}

function* handleLogin(
  action: PayloadAction<{ email: string; password: string }>,
): Generator<unknown, void, { data: AuthResponse }> {
  try {
    const response = yield call(login, action.payload);

    if (response?.data?.is_succes) {
      const accessToken = response.data.access_token;
      if (accessToken) {
        yield put(loginSuccess({ accessToken }));
        
        yield call(AsyncStorage.setItem, 'accessToken', accessToken);
      } else {
        yield put(loginFailure({ error: 'No access token received' }));
      }
    } else {
      yield put(
        loginFailure({
          error: response?.data?.errors?.[0] || 'Login failed: Unknown error',
        }),
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Login failed: Unexpected error';
    yield put(
      loginFailure({
        error: errorMessage,
      }),
    );
  }
}


function* handleLogout(): Generator {
  try {
    yield call(AsyncStorage.removeItem, 'accessToken');
  } finally {
    
  }
}


function* bootstrapAuth(): Generator {
  const token: string | null = (yield call(
    AsyncStorage.getItem,
    'accessToken',
  )) as string | null;
  yield put(initializeAuth({ accessToken: token }));
}

export default function* authSaga() {
  yield all([
    fork(bootstrapAuth),
    takeLatest(loginRequest.type, handleLogin),
    takeLatest(logout.type, handleLogout),
  ]);
}
