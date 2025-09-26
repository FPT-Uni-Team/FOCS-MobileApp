import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartItemType, VariantSelection } from '../../../type/cart/cart';

interface CartState {
  cartItems: CartItemType[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
};

export interface FetchCartPayload {
  tableId: string;
}

export interface AddToCartPayload {
  tableId: string;
  cartItem: CartItem;
}

export interface UpdateCartItemPayload {
  tableId: string;
  menuItemId: string;
  quantity: number;
  variants: VariantSelection[];
  note: string;
}

export interface RemoveFromCartPayload {
  tableId: string;
  menuItemId: string;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    fetchCartItemsStart: {
      reducer(state) {
        state.loading = true;
        state.error = null;
      },
      prepare(payload: FetchCartPayload) {
        return { payload };
      },
    },
    fetchCartItemsSuccess(state, action: PayloadAction<{ cartItems: CartItemType[] }>) {
      state.loading = false;
      state.cartItems = action.payload.cartItems;
      state.totalItems = action.payload.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = action.payload.cartItems.reduce(
        (sum, item) => sum + ((item.base_price || 0) * item.quantity), 0
      );
    },
    fetchCartItemsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addToCartStart: {
      reducer(state) {
        state.loading = true;
        state.error = null;
      },
      prepare(payload: AddToCartPayload) {
        return { payload };
      },
    },
    addToCartSuccess(state) {
      state.loading = false;
    },
    addToCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItemStart: {
      reducer(state) {
        state.loading = true;
        state.error = null;
      },
      prepare(payload: UpdateCartItemPayload) {
        return { payload };
      },
    },
    updateCartItemSuccess(state) {
      state.loading = false;
    },
    updateCartItemFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCartStart: {
      reducer(state) {
        state.loading = true;
        state.error = null;
      },
      prepare(payload: RemoveFromCartPayload) {
        return { payload };
      },
    },
    removeFromCartSuccess(state) {
      state.loading = false;
    },
    removeFromCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearCartStart: {
      reducer(state) {
        state.loading = true;
        state.error = null;
      },
      prepare(payload: { tableId: string }) {
        return { payload };
      },
    },
    clearCartSuccess(state) {
      state.loading = false;
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    clearCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetCartState() {
      return initialState;
    },
  },
});

export const {
  fetchCartItemsStart,
  fetchCartItemsSuccess,
  fetchCartItemsFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartStart,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
  resetCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
