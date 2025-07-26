import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { OrderDTO } from '../../../type/order/order';
import type { OrderListParams } from '../../../type/order/order';

export interface OrderListState {
  items: OrderDTO[];
  total: number;
  loading: boolean;
  error: string | null;
  params: OrderListParams;
}

const initialState: OrderListState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  params: {
    page: 1,
    page_size: 10,
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    fetchOrdersStart(state, action: PayloadAction<Partial<OrderListParams> | undefined>) {
      state.loading = true;
      state.error = null;
      const newParams = { ...state.params, ...(action.payload || {}) };
      state.params = {
        page: newParams.page ?? 1,
        page_size: newParams.page_size ?? 10,
      };
    },
    fetchOrdersSuccess(state, action: PayloadAction<{ items: OrderDTO[]; total: number }>) {
      state.loading = false;
      state.error = null;
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.items = [];
      state.total = 0;
    },
    resetOrderState(state) {
      state.loading = false;
      state.error = null;
      state.items = [];
      state.total = 0;
      state.params = { page: 1, page_size: 10 };
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer; 