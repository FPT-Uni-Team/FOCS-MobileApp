import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  TableDTO,
  TableListParams,
  TableListState,
} from '../../../type/table/table';

const initialState: TableListState = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
  search_by: '',
  search_value: '',
  sort_by: '',
  sort_order: undefined,
  filters: {},
  loading: false,
  error: null,
  storeId: '',
};

const tableListSlice = createSlice({
  name: 'tableList',
  initialState,
  reducers: {
    setTableParams(state, action: PayloadAction<Partial<TableListParams>>) {
      if (action.payload.page !== undefined) state.page = action.payload.page;
      if (action.payload.page_size !== undefined)
        state.page_size = action.payload.page_size;
      if (action.payload.storeId !== undefined)
        state.storeId = action.payload.storeId;
      state.loading = true;
    },
    tableListRequest(state) {
      state.loading = true;
      state.error = null;
    },
    tableListSuccess(
      state,
      action: PayloadAction<{ items: TableDTO[]; total: number }>
    ) {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.loading = false;
    },
    tableListFailure(state, action: PayloadAction<{ error: string }>) {
      state.error = action.payload.error;
      state.loading = false;
    },
    clearTableState: () => initialState,
  },
});

export const {
  tableListRequest,
  tableListSuccess,
  tableListFailure,
  setTableParams,
  clearTableState,
} = tableListSlice.actions;

export default tableListSlice.reducer; 