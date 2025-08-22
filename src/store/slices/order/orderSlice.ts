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
    fetchOrderListStart(state, action: PayloadAction<OrderListParams>) {
      state.loading = true;
      state.error = null;
      const nextParams = action.payload;
      if (nextParams.page === 1) {
        state.items = [];
      }
      state.params = nextParams;
    },
    fetchOrderListSuccess(state, action: PayloadAction<{ items: OrderDTO[]; total: number }>) {
      state.loading = false;
      state.error = null;
      if (state.params.page === 1) {
        
        state.items = action.payload.items;
      } else {
        
        const existingIds = new Set(state.items.map(item => item.id));
        const newItems = action.payload.items.filter(item => !existingIds.has(item.id));
        state.items.push(...newItems);
      }
      state.total = action.payload.total;
    },
    fetchOrderListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      if (state.params.page === 1) {
        state.items = [];
        state.total = 0;
      }
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
  fetchOrderListStart,
  fetchOrderListSuccess,
  fetchOrderListFailure,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer; 