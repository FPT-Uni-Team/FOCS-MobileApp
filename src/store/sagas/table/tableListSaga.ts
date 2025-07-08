import { call, put, takeLatest, debounce, select } from 'redux-saga/effects';
import {
  tableListRequest,
  tableListSuccess,
  tableListFailure,
  setTableParams,
} from '../../slices/table/tableListSlice';
import { fetchTableList } from '../../../services/tableService';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TableListParams } from '../../../type/table/table';

function* handleFetch(
  action: PayloadAction<TableListParams>
): Generator<any, void, any> {
  try {
    const { data } = yield call(fetchTableList, action.payload);
    const mappedItems = data.items.map((it: any) => ({
      tableId: it.id,
      tableNumber: String(it.table_number),
      status: it.is_active ? 'ACTIVE' : 'INACTIVE',
      capacity: it.capacity ?? undefined,
      note: it.note ?? undefined,
      createdAt: it.created_at ?? '',
    }));
    yield put(
      tableListSuccess({ items: mappedItems, total: data.total_count || data.total })
    );
  } catch (e: any) {
    yield put(
      tableListFailure({
        error: e?.response?.data?.message || e.message || 'Error',
      })
    );
  }
}

function* handleParamsChange(): Generator<any, void, any> {
  const state: any = yield select((s) => s.tableList);
  const { storeId, page, page_size, search_by, search_value, sort_by, sort_order, filters } = state;
  if (!storeId) return;
  const params: TableListParams = {
    storeId,
    page,
    page_size,
    search_by,
    search_value,
    sort_by,
    sort_order,
    filters,
  };
  yield put(tableListRequest(params));
}

export default function* tableListSaga() {
  yield takeLatest(tableListRequest.type, handleFetch);
  yield debounce(300, setTableParams.type, handleParamsChange);
} 