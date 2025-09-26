import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Surface, Appbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../hooks/redux';
import { 
  fetchCartItemsStart,
  updateCartItemStart,
  removeFromCartStart 
} from '../../store/slices/cart/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import { CartItemType } from '../../type/cart/cart';
import Colors from '../../utils/Colors';
import { spacing, cardSpacing } from '../../utils/spacing';

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { cartItems, loading, totalPrice, totalItems } = useAppSelector((state: any) => state.cartItem);
  const tableId = '1'; // TODO: Get from app state

  useEffect(() => {
    dispatch(fetchCartItemsStart({ tableId }));
  }, [dispatch, tableId]);

  const handleQuantityChange = (item: CartItemType, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => dispatch(removeFromCartStart({ 
              tableId, 
              menuItemId: item.id || '' 
            }))
          }
        ]
      );
      return;
    }

    dispatch(updateCartItemStart({
      tableId,
      menuItemId: item.id || '',
      quantity: newQuantity,
      variants: item.selectedVariants || [],
      note: item.note || ''
    }));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderCartItem = (item: CartItemType, index: number) => {
    const variantText = item.selectedVariants?.map((v: any) => {
      const group = item.variant_groups?.find((g: any) => g.variants?.some((variant: any) => variant.id === v.variant_id));
      const variant = group?.variants?.find((variant: any) => variant.id === v.variant_id);
      return variant ? `${variant.name}` : '';
    }).filter(Boolean).join(', ');

    return (
      <Surface key={index} style={styles.cartItem} elevation={1}>
        <View style={styles.itemContent}>
          <View style={styles.itemInfo}>
            <Text variant="titleMedium" style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.itemCategory}>
              {item.categories?.map(c => c.name).join(', ')}
            </Text>
            {variantText && (
              <Text variant="bodySmall" style={styles.variantText}>
                {variantText}
              </Text>
            )}
            <Text variant="titleMedium" style={styles.itemPrice}>
              {formatPrice(item.base_price || 0)}
            </Text>
          </View>

          <View style={styles.quantityContainer}>
            <Text variant="bodySmall" style={styles.qtyLabel}>QTY {String(item.quantity).padStart(2, '0')}</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item, item.quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Surface>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>Your cart is empty</Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        Browse our menu and add some delicious items to your cart
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('MainApp', { screen: 'MenuItems' })}
      >
        <Text style={styles.browseButtonText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Cart (${String(totalItems).padStart(2, '0')})`} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map(renderCartItem)}
            
            <View style={styles.totalSection}>
              <Text variant="headlineMedium" style={styles.totalAmount}>
                {formatPrice(totalPrice)}
              </Text>
            </View>
          </>
        ) : (
          renderEmptyCart()
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.checkoutSection}>
          <TouchableOpacity
            style={[styles.checkoutButton, loading && styles.disabledButton]}
            onPress={handleCheckout}
            disabled={loading}
          >
            <Text style={styles.checkoutButtonText}>
              {loading ? 'Loading...' : 'Checkout'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.backgroundPrimary,
    elevation: 2,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  cartItem: {
    marginBottom: spacing.m,
    borderRadius: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
  },
  itemContent: {
    flexDirection: 'row',
    padding: cardSpacing.horizontal,
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.m,
  },
  itemName: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemCategory: {
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  variantText: {
    color: Colors.textMuted,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    color: Colors.primary,
    fontWeight: '700',
  },
  quantityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyLabel: {
    color: Colors.textMuted,
    marginBottom: spacing.xs,
    fontSize: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: Colors.backgroundPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    marginHorizontal: spacing.m,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  totalSection: {
    alignItems: 'center',
    paddingVertical: spacing.l,
  },
  totalAmount: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  checkoutSection: {
    padding: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: spacing.m,
    borderRadius: spacing.m,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textMuted,
  },
  checkoutButtonText: {
    color: Colors.backgroundPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
    borderRadius: spacing.m,
  },
  browseButtonText: {
    color: Colors.backgroundPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;
