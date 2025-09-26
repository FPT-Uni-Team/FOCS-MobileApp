import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProductionOrderListState, ProductionOrderListParams } from '../../../type/production/production';

const initialState: ProductionOrderListState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  page_size: 10,
  storeId: null,
};

const productionOrderSlice = createSlice({
  name: 'productionOrder',
  initialState,
  reducers: {
    fetchProductionOrderListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductionOrderListSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.items = action.payload.items;
      state.total = action.payload.total_count;
      state.page = action.payload.page_index;
      state.page_size = action.payload.page_size;
    },
    fetchProductionOrderListFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setProductionOrderParams: (state, action: PayloadAction<Partial<ProductionOrderListParams & { storeId: string }>>) => {
      const { storeId, ...params } = action.payload;
      if (storeId) {
        state.storeId = storeId;
      }
      if (Object.keys(params).length > 0) {
        Object.assign(state, params);
      }
    },
    clearProductionOrderList: (state) => {
      state.items = [];
      state.total = 0;
      state.page = 1;
    },
  },
});

export const {
  fetchProductionOrderListStart,
  fetchProductionOrderListSuccess,
  fetchProductionOrderListFailure,
  setProductionOrderParams,
  clearProductionOrderList,
} = productionOrderSlice.actions;

export default productionOrderSlice.reducer;
