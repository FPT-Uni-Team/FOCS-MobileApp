import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (
      state,
      action: PayloadAction<{ accessToken: string | null }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
      state.isInitialized = true;
    },
    loginRequest: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (payload: LoginPayload) => ({ payload }),
    },
    loginSuccess: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
    },
    loginFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = action.payload.error;
      state.loading = false;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
});

export const {
  initializeAuth,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setTokens,
} = authSlice.actions;

export default authSlice.reducer;
