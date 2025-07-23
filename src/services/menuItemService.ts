import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { ListPageParams } from '../type/common/common';

const menuItemService = {
  getListMenuItems: (params: ListPageParams) =>
    axiosClient.post(endpoints.menuItem.list(), params),
};

export default menuItemService; 