import { call, Effect, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import cartService from '../../../services/cartService';
import menuItemService from '../../../services/menuItemService';
import { CartItem, CartItemType, CheckoutResponse } from '../../../type/cart/cart';
import { MenuItem } from '../../../type/menu/menu';
import {
  fetchCartItemsStart,
  fetchCartItemsSuccess,
  fetchCartItemsFailure,
  FetchCartPayload,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  AddToCartPayload,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  UpdateCartItemPayload,
  removeFromCartStart,
  removeFromCartSuccess,
  removeFromCartFailure,
  RemoveFromCartPayload,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
} from '../../slices/cart/cartSlice';
import {
  checkoutStart,
  checkoutSuccess,
  checkoutFailed,
  CheckoutPayload,
  createOrderStart,
  createOrderSuccess,
  createOrderFailed,
} from '../../slices/cart/checkoutSlice';

function* fetchCartItemsSaga(
  action: PayloadAction<FetchCartPayload>
): Generator<Effect, void, any> {
  try {
    const { tableId } = action.payload;
    const cartItems: CartItem[] = yield call(
      cartService.getCartFromStorage,
      tableId
    );

    if (cartItems.length === 0) {
      yield put(fetchCartItemsSuccess({ cartItems: [] }));
      return;
    }

    // Fetch menu item details for each cart item
    const mergedData: CartItemType[] = [];
    
    for (const cartItem of cartItems) {
      try {
        const menuItemResponse: AxiosResponse<MenuItem> = yield call(
          menuItemService.menuItemDetail,
          cartItem.menu_item_id
        );
        
        const menuItem = menuItemResponse.data;
        
        // Fetch images for this menu item
        let images: string[] = [];
        try {
          const imageResponse = yield call(menuItemService.menuItemImage, cartItem.menu_item_id);
          const imageData = imageResponse.data || [];
          images = Array.isArray(imageData) 
            ? imageData.map((img: any) => typeof img === 'string' ? img : img?.url || img?.image_url || '')
            : [];
        } catch (imageError) {
          images = [];
        }
        
        mergedData.push({
          ...menuItem,
          images,
          quantity: cartItem.quantity,
          note: cartItem.note,
          selectedVariants: cartItem.variants,
        });
      } catch (error) {
       
        mergedData.push({
          id: cartItem.menu_item_id,
          name: 'Unknown Item',
          description: 'Item details unavailable',
          base_price: 0,
          images: [],
          quantity: cartItem.quantity,
          note: cartItem.note,
          selectedVariants: cartItem.variants,
        } as CartItemType);
      }
    }

    yield put(fetchCartItemsSuccess({ cartItems: mergedData }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to fetch cart items';
    yield put(fetchCartItemsFailure(errorMessage));
  }
}

function* addToCartSaga(
  action: PayloadAction<AddToCartPayload>
): Generator<Effect, void, any> {
  try {
    const { tableId, cartItem } = action.payload;
    yield call(cartService.addToCart, tableId, cartItem);
    yield put(addToCartSuccess());
    yield put(fetchCartItemsStart({ tableId }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to add item to cart';
    yield put(addToCartFailure(errorMessage));
  }
}

function* updateCartItemSaga(
  action: PayloadAction<UpdateCartItemPayload>
): Generator<Effect, void, any> {
  try {
    const { tableId, menuItemId, quantity, variants, note } = action.payload;
    yield call(cartService.updateCartItem, tableId, menuItemId, { quantity, variants, note });
    yield put(updateCartItemSuccess());
    yield put(fetchCartItemsStart({ tableId }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to update cart item';
    yield put(updateCartItemFailure(errorMessage));
  }
}

function* removeFromCartSaga(
  action: PayloadAction<RemoveFromCartPayload>
): Generator<Effect, void, any> {
  try {
    const { tableId, menuItemId } = action.payload;
    yield call(cartService.removeFromCart, tableId, menuItemId);
    yield put(removeFromCartSuccess());
    yield put(fetchCartItemsStart({ tableId }));
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to remove item from cart';
    yield put(removeFromCartFailure(errorMessage));
  }
}

function* clearCartSaga(
  action: PayloadAction<{ tableId: string }>
): Generator<Effect, void, any> {
  try {
    const { tableId } = action.payload;
    yield call(cartService.clearCart, tableId);
    yield put(clearCartSuccess());
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to clear cart';
    yield put(clearCartFailure(errorMessage));
  }
}

function* handleCheckoutSaga(
  action: PayloadAction<CheckoutPayload>
): Generator<Effect, void, AxiosResponse<CheckoutResponse>> {
  try {
    const response = yield call(
      cartService.checkout,
      action.payload.actorId,
      action.payload.data
    );
    yield put(checkoutSuccess(response.data));
  } catch (err: any) {
    yield put(checkoutFailed(err.response?.data?.message || 'Checkout failed'));
  }
}

function* handleCreateOrderSaga(
  action: PayloadAction<any>
): Generator<Effect, void, AxiosResponse<any>> {
  try {
    const response = yield call(cartService.createOrder, action.payload.actorId || '1', action.payload);
    yield put(createOrderSuccess(response.data));
  } catch (err: any) {
    yield put(createOrderFailed(err.response?.data?.message || 'Create order failed'));
  }
}



export function* watchCartSaga() {
  yield takeLatest(fetchCartItemsStart.type, fetchCartItemsSaga);
  yield takeLatest(addToCartStart.type, addToCartSaga);
  yield takeLatest(updateCartItemStart.type, updateCartItemSaga);
  yield takeLatest(removeFromCartStart.type, removeFromCartSaga);
  yield takeLatest(clearCartStart.type, clearCartSaga);
  yield takeLatest(checkoutStart.type, handleCheckoutSaga);
  yield takeLatest(createOrderStart.type, handleCreateOrderSaga);
}
