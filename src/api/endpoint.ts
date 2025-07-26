

const endpoints = {
  auth: {
    login: () => '/api/me/login',
    refresh: () => '/api/me/refresh-token',
    logout: () => '/api/me/logout',
  },
  table: {
    list: (storeId: string) => `/api/manager/tables?storeId=${storeId}`,
  },
  menuItem: {
    list: () => '/api/admin/menu-item/list',
    detail: (itemId: string) => `/api/admin/menu-item/${itemId}`,
    images: (itemId: string) => `/api/admin/menu-item/${itemId}/images`,
    variantGroups: (itemId: string) => `/api/admin/menu-item/${itemId}/variant-groups`,
    categories: (itemId: string) => `/api/menu-item-category/menu-item/${itemId}/categories`,
    changeStatus: (action: string, itemId: string) => `/api/admin/menu-item/${action}/${itemId}`,
  },
  order: {
    list: () => '/api/cashier/orders',
  },
};

export default endpoints;
