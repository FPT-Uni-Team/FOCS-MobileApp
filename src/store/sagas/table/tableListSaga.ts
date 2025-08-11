import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  tableListRequest,
  tableListSuccess,
  tableListFailure,
  changeTableStatusRequest,
  changeTableStatusSuccess,
  changeTableStatusFailure,
} from '../../slices/table/tableListSlice';
import { 
  fetchTableList, 
  changeTableStatus,
  mapTableStatusFromApi 
} from '../../../services/tableService';
import type { RootState } from '../../store';
import type { 
  TableListParams, 
  ChangeTableStatusParams 
} from '../../../type/table/table';

function* handleFetch(): Generator<any, void, any> {
  try {
    const params: TableListParams = yield select((state: RootState) => ({
      storeId: state.tableList.storeId,
      page: state.tableList.page,
      page_size: state.tableList.page_size,
    }));

    if (!params.storeId) {
       
        return; 
    }

    const { data } = yield call(fetchTableList, params);
    const mappedItems = data.items.map((it: any) => ({
      tableId: it.id,
      tableNumber: String(it.table_number),
     
      status: mapTableStatusFromApi(it.status),
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


function* handleChangeStatus(action: { payload: ChangeTableStatusParams }): Generator<any, void, any> {
  try {
    yield call(changeTableStatus, action.payload);
    yield put(changeTableStatusSuccess({ 
      tableId: action.payload.tableId, 
      status: action.payload.status 
    }));
    yield put(tableListRequest());
  } catch (e: any) {
    yield put(changeTableStatusFailure({
      error: e?.response?.data?.message || e.message || 'Failed to change table status',
    }));
  }
}

export default function* tableListSaga() {
  yield takeLatest([tableListRequest.type, 'tableList/setTableParams'], handleFetch);
  yield takeLatest(changeTableStatusRequest, handleChangeStatus);
} 