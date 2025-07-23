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
  },
};

export default endpoints;
