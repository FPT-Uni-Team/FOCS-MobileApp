import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCartItemsStart, addToCartStart, clearCartStart } from '../../store/slices/cart/cartSlice';
import { fetchOrderListStart } from '../../store/slices/order/orderSlice';
import {
  checkoutStart,
  createOrderStart,
  resetCheckoutState,
} from '../../store/slices/cart/checkoutSlice';
import { CheckoutRequest, OrderRequest, CartItemType, VariantSelection, CartItem } from '../../type/cart/cart';
import { VariantGroup, Variant } from '../../type/variant/variant';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '../../utils/validationSchemas';
import Colors from '../../utils/Colors';
import AppHeader from '../../components/common/AppHeader/AppHeader';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface CheckoutScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const CheckoutScreen = ({ navigation }: CheckoutScreenProps) => {
  const dispatch = useAppDispatch();
  const [orderType, setOrderType] = useState('0');
  const [couponCode, setCouponCode] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
    },
  });

  const { cartItems, loading: cartLoading } = useAppSelector((state: any) => state.cartItem);
  const {
    data: checkoutData,
    loading: checkoutLoading,
    orderLoading,
    orderSuccess,
    error,
  } = useAppSelector((state: any) => state.checkoutSlice);

     

 

  const storeId = useAppSelector((state: any) => state.tableList.storeId || '1');
  const tableId = '1'; 
  const tableIdForAPI = '94690db9-5c86-4fcc-b485-1ee69b3875c0'; 
  const actorId = '1'; 

  const isLoading = cartLoading || checkoutLoading || orderLoading;



  useEffect(() => {
    dispatch(resetCheckoutState());
    dispatch(fetchCartItemsStart({ tableId }));
    return () => {
      dispatch(resetCheckoutState());
    };
  }, [dispatch, tableId]);

  useEffect(() => {
    if (cartItems.length > 0) {
      handleCheckout();
    }
  }, [cartItems]);

  useEffect(() => {
    if (checkoutData?.applied_coupon_code) {
      setCouponCode(checkoutData.applied_coupon_code);
    }
  }, [checkoutData]);

  useEffect(() => {
    if (orderSuccess && cartItems.length > 0) {
      dispatch(clearCartStart({ tableId }));
      dispatch(fetchOrderListStart({ page: 1, page_size: 10 }));
      dispatch(resetCheckoutState());
      
      Alert.alert('Success', 'Order placed successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MainApp', { screen: 'MenuItems' }),
        },
      ]);
    }
  }, [orderSuccess, cartItems.length, navigation, dispatch, tableId]);


  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleCheckout = (applyCoupon?: string) => {
    if (cartItems.length === 0) return;

    const finalCouponCode = applyCoupon || couponCode;
    const checkoutRequest: CheckoutRequest = {
      store_id: storeId,
      table_id: tableIdForAPI, 
      items: cartItems.map((item: CartItemType) => ({
        menuItemId: item.id || '',
        variants: item.selectedVariants || [],
        quantity: item.quantity,
        note: item.note || '',
      })),
      point: 0,
      is_use_point: false,
      ...(finalCouponCode && finalCouponCode.trim() !== '' && { coupon_code: finalCouponCode }),
    };



    dispatch(
      checkoutStart({
        actorId,
        data: checkoutRequest,
      })
    );
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    handleCheckout(couponCode);
  };

  const handleAddDemoItem = () => {
    const demoItem: CartItem = {
      menu_item_id: 'demo-1',
      variants: [],
      quantity: 1,
      note: 'Demo item for testing',
    };
    dispatch(addToCartStart({ tableId, cartItem: demoItem }));
  };

  const onPayNow = (formData: CheckoutFormData) => {
    
    
    const localTotal = cartItems.reduce((total: number, item: any) => {
      const basePrice = item.base_price || 0;
      let variantPrice = 0;
      
      if (item.selectedVariants && item.variant_groups) {
        item.selectedVariants.forEach((selectedVariant: any) => {
          item.variant_groups?.forEach((group: any) => {
            const variant = group.variants.find((v: any) => v.id === selectedVariant.variant_id);
            if (variant) {
              variantPrice += variant.price || 0;
            }
          });
        });
      }
      
      return total + ((basePrice + variantPrice) * item.quantity);
    }, 0);

    const defaultCheckoutData = {
      total_discount: 0,
      total_price: localTotal,
      applied_coupon_code: couponCode,
      applied_promotions: [],
      item_discount_details: [],
      messages: [],
      is_discount_applied: false,
      order_code: null,
    };

    const finalCheckoutData = checkoutData || defaultCheckoutData;
    


    const orderRequest: OrderRequest = {
      store_id: storeId,
      table_id: tableIdForAPI, 
      items: cartItems.map((item: CartItemType) => ({
        menuItemId: item.id || '',
        variants: item.selectedVariants || [],
        quantity: item.quantity,
        note: item.note || '',
      })),
      note: '',
      coupon_code: couponCode,
      is_use_point: false,
      point: 0,
      customer_info: {
        name: formData.customerName,
        phone: formData.customerPhone,
      },
      discount: finalCheckoutData,
      payment_type: 0,
      order_type: parseInt(orderType),
    };

    const createOrderPayload = {
      ...orderRequest,
      actorId: actorId, 
    };

    dispatch(createOrderStart(createOrderPayload));
  };

  



  const renderCartItem = (item: CartItemType, index: number) => {
    const selectedVariants = item.selectedVariants || [];
    const basePrice = item.base_price || 0;
    
    let variantPrice = 0;
    if (item.variant_groups) {
      selectedVariants.forEach((selectedVariant: VariantSelection) => {
        item.variant_groups?.forEach((group: VariantGroup) => {
          const variant = group.variants.find((v: Variant) => v.id === selectedVariant.variant_id);
          if (variant) {
            variantPrice += variant.price;
          }
        });
      });
    }
    
    const totalPrice = (basePrice + variantPrice) * item.quantity;

    return (
      <View key={`${item.id}_${index}`} style={styles.cartItem}>
        <Image
          source={{
            uri: (typeof item.images?.[0] === 'string' ? item.images[0] : '') || 'https://via.placeholder.com/96',
          }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name || ''}
          </Text>
          <Text style={styles.itemCategory} numberOfLines={1}>
            {item.categories?.map((cat: any) => cat.name).join(', ') || ''}
          </Text>
          {selectedVariants.length > 0 && (
            <Text style={styles.itemVariants} numberOfLines={1}>
              {selectedVariants.map((selectedVariant: VariantSelection) => {
                let variantName = '';
                item.variant_groups?.forEach((group: VariantGroup) => {
                  const variant = group.variants.find((v: Variant) => v.id === selectedVariant.variant_id);
                  if (variant) {
                    variantName = variant.name;
                  }
                });
                return variantName;
              }).filter(Boolean).join(', ')}
            </Text>
          )}
          <Text style={styles.itemPrice}>{totalPrice.toLocaleString()} VND</Text>
        </View>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>QTY:</Text>
          <Text style={styles.quantityValue}>
            {item.quantity.toString().padStart(2, '0')}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Checkout" showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Cart Items */}
          <View style={styles.section}>
            {cartItems.length > 0 ? (
              cartItems.map(renderCartItem)
            ) : (
              <View style={styles.emptyCartContainer}>
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
                <Text style={styles.emptyCartSubtext}>
                  Please add some items to your cart before checkout
                </Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.addItemsButton}
                    onPress={() => navigation.navigate('MainApp', { screen: 'MenuItems' })}
                  >
                    <Text style={styles.addItemsButtonText}>Browse Menu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.demoButton}
                    onPress={handleAddDemoItem}
                  >
                    <Text style={styles.demoButtonText}>Add Demo Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="customerName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.customerName && styles.inputError]}
                      placeholder="Full Name"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor={Colors.textSecondary}
                    />
                  )}
                />
                {errors.customerName && (
                  <Text style={styles.errorText}>{errors.customerName.message}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="customerPhone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.customerPhone && styles.inputError]}
                      placeholder="Phone Number"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.textSecondary}
                    />
                  )}
                />
                {errors.customerPhone && (
                  <Text style={styles.errorText}>{errors.customerPhone.message}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Order Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Type</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setOrderType('0')}
              >
                <View style={[styles.radio, orderType === '0' && styles.radioSelected]} />
                <Text style={styles.radioLabel}>Dine In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setOrderType('1')}
              >
                <View style={[styles.radio, orderType === '1' && styles.radioSelected]} />
                <Text style={styles.radioLabel}>Take Away</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Coupon Code */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coupon Code</Text>
            <View style={styles.couponContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon code"
                value={couponCode}
                onChangeText={setCouponCode}
                placeholderTextColor={Colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.couponButton}
                onPress={handleApplyCoupon}
                disabled={!couponCode.trim()}
              >
                <Text style={styles.couponButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Summary */}
      <View style={styles.bottomContainer}>
                 <View style={styles.summaryContainer}>
           <View style={styles.summaryRow}>
             <Text style={styles.summaryLabel}>Subtotal:</Text>
             <Text style={styles.summaryValue}>
               {cartItems.reduce((total: number, item: any) => {
                 const basePrice = item.base_price || 0;
                 let variantPrice = 0;
                 if (item.selectedVariants && item.variant_groups) {
                   item.selectedVariants.forEach((selectedVariant: any) => {
                     item.variant_groups?.forEach((group: any) => {
                       const variant = group.variants.find((v: any) => v.id === selectedVariant.variant_id);
                       if (variant) {
                         variantPrice += variant.price || 0;
                       }
                     });
                   });
                 }
                 return total + ((basePrice + variantPrice) * item.quantity);
               }, 0).toLocaleString()} VND
             </Text>
           </View>
           <View style={styles.summaryRow}>
             <Text style={styles.summaryLabel}>Discount:</Text>
             <Text style={styles.discountValue}>
               -{(checkoutData?.total_discount || 0).toLocaleString()} VND
             </Text>
           </View>
         </View>
         
         <View style={styles.totalContainer}>
           <Text style={styles.totalLabel}>Total:</Text>
           <Text style={styles.totalValue}>
             {(() => {
               const localTotal = cartItems.reduce((total: number, item: any) => {
                 const basePrice = item.base_price || 0;
                 let variantPrice = 0;
                 if (item.selectedVariants && item.variant_groups) {
                   item.selectedVariants.forEach((selectedVariant: any) => {
                     item.variant_groups?.forEach((group: any) => {
                       const variant = group.variants.find((v: any) => v.id === selectedVariant.variant_id);
                       if (variant) {
                         variantPrice += variant.price || 0;
                       }
                     });
                   });
                 }
                 return total + ((basePrice + variantPrice) * item.quantity);
               }, 0);
               
               const discount = checkoutData?.total_discount || 0;
               return (localTotal - discount).toLocaleString();
             })()} VND
           </Text>
         </View>
        
                    <TouchableOpacity
              style={[
                styles.payNowButton, 
                (isLoading || cartItems.length === 0) && styles.disabledButton
              ]}
              onPress={handleSubmit(onPayNow)}
              disabled={isLoading || cartItems.length === 0}
            >
              <Text style={styles.buttonText}>
                {cartItems.length === 0 
                  ? 'Add Items to Cart First' 
                  : isLoading 
                    ? 'Processing...' 
                    : 'Pay Now'
                }
              </Text>
            </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  itemCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemVariants: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  quantityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  quantityLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  quantityValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.backgroundPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  radioSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  couponContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.backgroundPrimary,
  },
  couponButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  couponButtonText: {
    color: Colors.backgroundPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomContainer: {
    backgroundColor: Colors.backgroundPrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  summaryContainer: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  payNowButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textMuted,
  },
  buttonText: {
    color: Colors.backgroundPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCartContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 12,
    marginVertical: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  addItemsButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addItemsButtonText: {
    color: Colors.backgroundPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  demoButtonText: {
    color: Colors.backgroundPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CheckoutScreen;