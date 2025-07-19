import type { ListPageParams } from '../common/common';

export interface MenuListDataType {
  menuId: string;
  menuName: string;
  menuDescription: string;
  menuBasePrice: number;
  isAvailable: boolean;
}

export interface MenuItemListState {
  menuItems: MenuListDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
} 