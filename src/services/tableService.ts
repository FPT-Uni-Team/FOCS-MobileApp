import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { 
  TableListParams, 
  ChangeTableStatusParams,
  TableStatus 
} from '../type/table/table';
import { TABLE_STATUS_API_MAPPING, API_TO_TABLE_STATUS } from '../utils/tableStatusColors';

export const mapTableStatusToApi = (status: TableStatus): number => {
  return TABLE_STATUS_API_MAPPING[status];
};

export const mapTableStatusFromApi = (apiStatus: number): TableStatus => {
  return API_TO_TABLE_STATUS[apiStatus] || 'Available';
};

export const fetchTableList = (params: TableListParams) => {
  const { storeId, ...body } = params;
  return axiosClient.post(endpoints.table.list(storeId), body);
};

export const changeTableStatus = (params: ChangeTableStatusParams) => {
  const { tableId, storeId, status } = params;
  const apiStatus = mapTableStatusToApi(status);
  return axiosClient.put(endpoints.table.changeStatus(tableId, storeId), apiStatus);
}; 