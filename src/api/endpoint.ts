

const endpoints = {
  auth: {
    login: () => '/api/me/login',
    refresh: () => '/api/me/refresh-token',
    logout: () => '/api/me/logout',
    mobileToken: () => '/api/me/mobile-token',
  },
  table: {
    list: (storeId: string) => `/api/manager/tables?storeId=${storeId}`,
    changeStatus: (tableId: string, storeId: string) => `/api/manager/table/status?tableId=${tableId}&storeId=${storeId}`,
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
    detail: (orderCode: string) => `/api/order/order-by-code/${orderCode}`,
  },
  checkout: {
    apply_discount: (actorId: string) => `/api/order/${actorId}/apply-discount`,
    create_cart: () => `/api/order`,
    payment: () => '/api/payment',
  },
  production: {
    kitchenOrders: () => '/api/KitchenOrder',
    kitchenOrderDetail: (code: string) => `/api/KitchenOrder/${code}`,
    changeStatus: () => '/api/KitchenOrder/change-status',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: endpoints.auth.login(),
    REFRESH: endpoints.auth.refresh(),
    LOGOUT: endpoints.auth.logout(),
    MOBILE_TOKEN: endpoints.auth.mobileToken(),
  },
  TABLE: {
    LIST: endpoints.table.list,
    CHANGE_STATUS: endpoints.table.changeStatus,
  },
  MENU_ITEM: {
    LIST: endpoints.menuItem.list(),
    DETAIL: endpoints.menuItem.detail,
    IMAGES: endpoints.menuItem.images,
    VARIANT_GROUPS: endpoints.menuItem.variantGroups,
    CATEGORIES: endpoints.menuItem.categories,
    CHANGE_STATUS: endpoints.menuItem.changeStatus,
  },
  ORDER: {
    LIST: endpoints.order.list(),
    DETAIL: endpoints.order.detail,
  },
  CHECKOUT: {
    APPLY_DISCOUNT: endpoints.checkout.apply_discount,
    CREATE_CART: endpoints.checkout.create_cart(),
    PAYMENT: endpoints.checkout.payment(),
  },
  PRODUCTION: {
    KITCHEN_ORDERS: endpoints.production.kitchenOrders(),
    KITCHEN_ORDER_DETAIL: endpoints.production.kitchenOrderDetail,
    CHANGE_STATUS: endpoints.production.changeStatus(),
  },
};

export default endpoints;
