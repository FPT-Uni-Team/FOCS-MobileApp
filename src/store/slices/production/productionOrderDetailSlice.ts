import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductionOrder, KitchenOrderDetailItem } from '../../../type/production/production';

interface ProductionOrderDetailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  productionOrder: ProductionOrder;
  items: KitchenOrderDetailItem[];
  refreshing: boolean;
  changingStatus: boolean;
  changingStatusOrderCode: string | null;
}

const initialState: ProductionOrderDetailState = {
  loading: false,
  success: false,
  error: null,
  productionOrder: {} as ProductionOrder,
  items: [],
  refreshing: false,
  changingStatus: false,
  changingStatusOrderCode: null,
};

const productionOrderDetailSlice = createSlice({
  name: 'productionOrderDetail',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchProductionOrderDetailStart: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    fetchProductionOrderDetailSuccess: (state, action: PayloadAction<{ order: ProductionOrder; items: KitchenOrderDetailItem[] }>) => {
      state.loading = false;
      state.success = true;
      state.productionOrder = action.payload.order;
      state.items = action.payload.items || [];
      state.refreshing = false;
    },
    fetchProductionOrderDetailFailed: (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload || 'Failed to fetch production order detail';
      state.refreshing = false;
    },
    resetProductionOrderDetail: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.productionOrder = {} as ProductionOrder;
      state.items = [];
      state.refreshing = false;
      state.changingStatus = false;
      state.changingStatusOrderCode = null;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    changeProductionOrderStatusStart: (state, action: PayloadAction<{ orderWrapIds: string[]; status: number; orderCode?: string }>) => {
      state.changingStatus = true;
      state.changingStatusOrderCode = action.payload.orderCode || null;
      state.error = null;
    },
    changeProductionOrderStatusByCodeStart: (state, action: PayloadAction<{ orderCode: string; status: number }>) => {
      state.changingStatus = true;
      state.changingStatusOrderCode = action.payload.orderCode;
      state.error = null;
    },
    changeProductionOrderStatusSuccess: (state, action: PayloadAction<number>) => {
      state.changingStatus = false;
      state.changingStatusOrderCode = null;
      state.productionOrder.status = action.payload as any;
    },
    changeProductionOrderStatusFailed: (state, action: PayloadAction<string>) => {
      state.changingStatus = false;
      state.changingStatusOrderCode = null;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProductionOrderDetailStart,
  fetchProductionOrderDetailSuccess,
  fetchProductionOrderDetailFailed,
  resetProductionOrderDetail,
  setRefreshing,
  changeProductionOrderStatusStart,
  changeProductionOrderStatusByCodeStart,
  changeProductionOrderStatusSuccess,
  changeProductionOrderStatusFailed,
} = productionOrderDetailSlice.actions;

export default productionOrderDetailSlice.reducer;
