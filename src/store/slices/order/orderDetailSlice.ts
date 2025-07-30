import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderDTO } from '../../../type/order/order';

interface OrderDetailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  order: OrderDTO;
  refreshing: boolean;
}

const initialState: OrderDetailState = {
  loading: false,
  success: false,
  error: null,
  order: {} as OrderDTO,
  refreshing: false,
};

const orderDetailSlice = createSlice({
  name: 'orderDetail',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchOrderDetailStart: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    fetchOrderDetailSuccess: (state, action: PayloadAction<OrderDTO>) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
      state.refreshing = false;
    },
    fetchOrderDetailFailed: (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload || 'Failed to fetch order detail';
      state.refreshing = false;
    },
    resetOrderDetail: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.order = {} as OrderDTO;
      state.refreshing = false;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
  },
});

export const {
  fetchOrderDetailStart,
  fetchOrderDetailSuccess,
  fetchOrderDetailFailed,
  resetOrderDetail,
  setRefreshing,
} = orderDetailSlice.actions;

export default orderDetailSlice.reducer;