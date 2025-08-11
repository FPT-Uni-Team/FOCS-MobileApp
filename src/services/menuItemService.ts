import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { ListPageParams } from '../type/common/common';

const menuItemService = {
  getListMenuItems: (params: ListPageParams) =>
    axiosClient.post(endpoints.menuItem.list(), params),

  menuItemDetail: (itemId: string) =>
    axiosClient.get(endpoints.menuItem.detail(itemId)),

  menuItemImage: (itemId: string) =>
    axiosClient.get(endpoints.menuItem.images(itemId)),

  menuItemGroups: (itemId: string) =>
    axiosClient.get(endpoints.menuItem.variantGroups(itemId)),

  menuItemCategory: (itemId: string) =>
    axiosClient.post(endpoints.menuItem.categories(itemId)),

  changeStatus: (action: string, itemId: string) =>
    axiosClient.put(endpoints.menuItem.changeStatus(action, itemId)),

  getMenuItemsByIds: (itemIds: string[]) =>
    axiosClient.post(endpoints.menuItem.list(), {
      menu_item_ids: itemIds,
      page: 1,
      limit: itemIds.length,
    }),
};

export default menuItemService; 