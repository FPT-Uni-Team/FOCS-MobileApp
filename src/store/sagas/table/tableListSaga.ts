import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  tableListRequest,
  tableListSuccess,
  tableListFailure,
} from '../../slices/table/tableListSlice';
import { fetchTableList } from '../../../services/tableService';
import type { RootState } from '../../store';
import type { TableListParams } from '../../../type/table/table';

function* handleFetch(): Generator<any, void, any> {
  try {
    const params: TableListParams = yield select((state: RootState) => ({
      storeId: state.tableList.storeId,
      page: state.tableList.page,
      page_size: state.tableList.page_size,
    }));

    if (!params.storeId) {
        // You could dispatch a failure action here if storeId is mandatory
        return; 
    }

    const { data } = yield call(fetchTableList, params);
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

export default function* tableListSaga() {
  yield takeLatest([tableListRequest.type, 'tableList/setTableParams'], handleFetch);
} 