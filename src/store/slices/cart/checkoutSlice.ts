import { CheckoutRequest, CheckoutResponse, OrderRequest, OrderRequestPayment } from '../../../type/cart/cart';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  loading: boolean;
  error: string | null;
  data: CheckoutResponse | null;
  success: boolean;
  orderLoading: boolean;
  orderSuccess: boolean;
  orderError: string | null;
  orderData: unknown | null;
  paymentLoading: boolean;
  paymentSuccess: boolean;
  paymentError: string | null;
}

const initialState: CheckoutState = {
  loading: false,
  error: null,
  data: null,
  success: false,
  orderLoading: false,
  orderSuccess: false,
  orderError: null,
  orderData: null,
  paymentLoading: false,
  paymentSuccess: false,
  paymentError: null,
};

export interface CheckoutPayload {
  actorId: string;
  data: CheckoutRequest;
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Checkout discount actions
    checkoutStart: {
      reducer(state) {
        state.loading = true;
        state.error = null;
        state.success = false;
      },
      prepare(payload: CheckoutPayload) {
        return { payload };
      },
    },
    checkoutSuccess(state, action: PayloadAction<CheckoutResponse>) {
      state.loading = false;
      state.data = action.payload;
      state.success = true;
      state.error = null;
    },
    checkoutFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    
    // Create order actions
    createOrderStart: {
      reducer(state) {
        state.orderLoading = true;
        state.orderError = null;
        state.orderSuccess = false;
      },
      prepare(payload: OrderRequest) {
        return { payload };
      },
    },
    createOrderSuccess(state, action: PayloadAction<unknown>) {
      state.orderLoading = false;
      state.orderData = action.payload;
      state.orderSuccess = true;
      state.orderError = null;
    },
    createOrderFailed(state, action: PayloadAction<string>) {
      state.orderLoading = false;
      state.orderError = action.payload;
      state.orderSuccess = false;
    },

    // Payment actions
    paymentStart: {
      reducer(state) {
        state.paymentLoading = true;
        state.paymentError = null;
        state.paymentSuccess = false;
      },
      prepare(payload: OrderRequestPayment) {
        return { payload };
      },
    },
    paymentSuccess(state) {
      state.paymentLoading = false;
      state.paymentSuccess = true;
      state.paymentError = null;
    },
    paymentFailed(state, action: PayloadAction<string>) {
      state.paymentLoading = false;
      state.paymentError = action.payload;
      state.paymentSuccess = false;
    },

    resetCheckoutState() {
      return initialState;
    },
  },
});

export const {
  checkoutStart,
  checkoutSuccess,
  checkoutFailed,
  createOrderStart,
  createOrderSuccess,
  createOrderFailed,
  paymentStart,
  paymentSuccess,
  paymentFailed,
  resetCheckoutState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
