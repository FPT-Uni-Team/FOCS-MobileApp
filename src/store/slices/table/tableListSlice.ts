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
    tableListRequest(state, action: PayloadAction<TableListParams>) {
      state.loading = true;
      state.error = null;
      state.page = action.payload.page;
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
    setTableParams(state, action: PayloadAction<Partial<TableListState>>) {
      const { filters, ...rest } = action.payload;
      if (filters !== undefined) {
        state.filters = filters;
      }
      Object.assign(state, rest);
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