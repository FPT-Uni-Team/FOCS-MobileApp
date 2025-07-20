import type { ListPageParams } from '../common/common';
import type { CategoryListDataType } from '../category/category';
import type { VariantGroup } from '../variant/variant';

export interface MenuListDataType {
  menuId: string;
  menuName: string;
  menuDescription: string;
  menuBasePrice: number;
  isAvailable: boolean;
}

export interface MenuItem {
  id?: string;
  name?: string;
  description?: string;
  images?: any[];
  base_price?: number;
  is_available?: boolean;
  categories?: CategoryListDataType[];
  variant_groups?: VariantGroup[];
}

export interface MenuItemListState {
  menuItems: MenuListDataType[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
} 