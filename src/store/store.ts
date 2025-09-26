import { configureStore } from '@reduxjs/toolkit';
const createSagaMiddleware = require('redux-saga').default;
import authReducer from './slices/auth/authSlice';
import rootSaga from './sagas/rootSaga';
import tableListReducer from './slices/table/tableListSlice';
import notificationReducer from './slices/notification/notificationSlice';
import menuItemReducer from './slices/menuItem/menuItemSlice';
import menuItemDetailReducer from './slices/menuItem/menuItemDetailSlice';
import orderReducer from './slices/order/orderSlice';
import orderDetailReducer from './slices/order/orderDetailSlice';
import cartReducer from './slices/cart/cartSlice';
import checkoutReducer from './slices/cart/checkoutSlice';
import productionOrderReducer from './slices/production/productionOrderSlice';
import productionOrderDetailReducer from './slices/production/productionOrderDetailSlice';
import { signalrInstance } from '../services/signalrService';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tableList: tableListReducer,
    notification: notificationReducer,
    menuItem: menuItemReducer,
    menuItemDetail: menuItemDetailReducer,
    order: orderReducer,
    orderDetail: orderDetailReducer,
    cartItem: cartReducer,
    checkoutSlice: checkoutReducer,
    productionOrder: productionOrderReducer,
    productionOrderDetail: productionOrderDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

signalrInstance.setStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
