import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { TableListParams } from '../type/table/table';
 
export const fetchTableList = (params: TableListParams) => {
  const { storeId, ...body } = params;
  return axiosClient.post(endpoints.table.list(storeId), body);
}; 