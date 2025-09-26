import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  TableDTO,
  TableListParams,
  TableListState,
  TableStatus,
} from '../../../type/table/table';

const initialState: TableListState = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeTableStatusRequest(state, _action: PayloadAction<{ tableId: string; storeId: string; status: TableStatus }>) {
      state.loading = true;
      state.error = null;
    },
    changeTableStatusSuccess(
      state,
      action: PayloadAction<{ tableId: string; status: TableStatus }>
    ) {
      state.loading = false;
      const tableIndex = state.items.findIndex(
        (table) => table.tableId === action.payload.tableId
      );
      if (tableIndex !== -1) {
        state.items[tableIndex].status = action.payload.status;
      }
    },
    changeTableStatusFailure(state, action: PayloadAction<{ error: string }>) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  tableListRequest,
  tableListSuccess,
  tableListFailure,
  setTableParams,
  clearTableState,
  changeTableStatusRequest,
  changeTableStatusSuccess,
  changeTableStatusFailure,
} = tableListSlice.actions;

export default tableListSlice.reducer; 