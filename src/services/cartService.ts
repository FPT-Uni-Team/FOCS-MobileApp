import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import {
  CartItem,
  CheckoutRequest,
  OrderRequest,
  OrderRequestPayment,
  LocalStorageCart,
} from '../type/cart/cart';

const CART_STORAGE_KEY = 'cart_items';

const cartService = {
  // Local Storage Operations
  getCartFromStorage: async (tableId: string): Promise<CartItem[]> => {
    try {
      const cartData = await AsyncStorage.getItem(`${CART_STORAGE_KEY}_${tableId}`);
      if (cartData) {
        const parsedCart: LocalStorageCart = JSON.parse(cartData);
        return parsedCart.items || [];
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  saveCartToStorage: async (tableId: string, items: CartItem[]): Promise<void> => {
    const cartData: LocalStorageCart = {
      items,
      lastUpdated: new Date().toISOString(),
      tableId,
    };
    await AsyncStorage.setItem(
      `${CART_STORAGE_KEY}_${tableId}`,
      JSON.stringify(cartData)
    );
  },

  addToCart: async (tableId: string, cartItem: CartItem): Promise<void> => {
    const existingItems = await cartService.getCartFromStorage(tableId);
    const existingItemIndex = existingItems.findIndex(
      (item) => item.menu_item_id === cartItem.menu_item_id
    );

    if (existingItemIndex >= 0) {
      existingItems[existingItemIndex] = {
        ...existingItems[existingItemIndex],
        quantity: existingItems[existingItemIndex].quantity + cartItem.quantity,
        note: cartItem.note || existingItems[existingItemIndex].note,
        variants: cartItem.variants,
      };
    } else {
      existingItems.push(cartItem);
    }

    await cartService.saveCartToStorage(tableId, existingItems);
  },

  updateCartItem: async (
    tableId: string,
    menuItemId: string,
    updates: Partial<CartItem>
  ): Promise<void> => {
    const existingItems = await cartService.getCartFromStorage(tableId);
    const itemIndex = existingItems.findIndex(
      (item) => item.menu_item_id === menuItemId
    );

    if (itemIndex >= 0) {
      existingItems[itemIndex] = {
        ...existingItems[itemIndex],
        ...updates,
      };
      await cartService.saveCartToStorage(tableId, existingItems);
    }
  },

  removeFromCart: async (tableId: string, menuItemId: string): Promise<void> => {
    const existingItems = await cartService.getCartFromStorage(tableId);
    const filteredItems = existingItems.filter(
      (item) => item.menu_item_id !== menuItemId
    );
    await cartService.saveCartToStorage(tableId, filteredItems);
  },

  clearCart: async (tableId: string): Promise<void> => {
    await AsyncStorage.removeItem(`${CART_STORAGE_KEY}_${tableId}`);
  },

 
  checkout: (actorId: string, dataCheckout: CheckoutRequest) => {
    const endpoint = endpoints.checkout.apply_discount(actorId);
    return axiosClient.post(endpoint, dataCheckout);
  },

  createOrder: (actorId: string, data: OrderRequest) => {
    const endpoint = endpoints.checkout.create_cart();
    const requestData = { ...data };
    delete requestData.actorId;
    const headers = {
      'actorId': actorId,
    };
    
    return axiosClient.post(endpoint, requestData, { headers });
  },

  paymentOrder: (data: OrderRequestPayment) => {
    return axiosClient.post(endpoints.checkout.payment(), data);
  },
};

export default cartService;
