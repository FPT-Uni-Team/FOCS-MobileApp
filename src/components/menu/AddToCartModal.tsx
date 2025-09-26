import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { Text, TextInput, Surface } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { formatPrice } from '../../utils/formatPrice';
import { CartItem, VariantSelection } from '../../type/cart/cart';

import { addToCartStart } from '../../store/slices/cart/cartSlice';
import { fetchMenuItemDetailStart } from '../../store/slices/menuItem/menuItemDetailSlice';
import Colors from '../../utils/Colors';
import { spacing } from '../../utils/spacing';
import type { RootState } from '../../store/store';

interface AddToCartModalProps {
  visible: boolean;
  onClose: () => void;
  menuItemId: string;
  menuItemName: string;
  menuItemPrice: number;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  visible,
  onClose,
  menuItemId,
  menuItemName,
  menuItemPrice,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { menuItem, loading } = useSelector((state: RootState) => state.menuItemDetail);
  
  const [selectedVariants, setSelectedVariants] = useState<VariantSelection[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const tableId = '1'; // TODO: Get from app state

  useEffect(() => {
    if (visible && menuItemId) {
      dispatch(fetchMenuItemDetailStart(menuItemId));
      setSelectedVariants([]);
      setQuantity(1);
      setNote('');
    }
  }, [visible, menuItemId, dispatch]);

  useEffect(() => {
    calculateTotalPrice();
  }, [menuItem, selectedVariants, quantity]);

  const calculateTotalPrice = () => {
    const basePrice = menuItem?.base_price || menuItemPrice || 0;
    let variantPrice = 0;

    selectedVariants.forEach(selectedVariant => {
      menuItem?.variant_groups?.forEach(group => {
        const variant = group.variants?.find(v => v.id === selectedVariant.variant_id);
        if (variant) {
          variantPrice += (variant.price || 0) * selectedVariant.quantity;
        }
      });
    });

    setTotalPrice((basePrice + variantPrice) * quantity);
  };

  const handleVariantChange = (variantId: string, variantQuantity: number) => {
    setSelectedVariants(prev => {
      const existing = prev.find(v => v.variant_id === variantId);
      if (existing) {
        if (variantQuantity <= 0) {
          return prev.filter(v => v.variant_id !== variantId);
        }
        return prev.map(v => 
          v.variant_id === variantId 
            ? { ...v, quantity: variantQuantity }
            : v
        );
      } else if (variantQuantity > 0) {
        return [...prev, { variant_id: variantId, quantity: variantQuantity }];
      }
      return prev;
    });
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      menu_item_id: menuItemId,
      variants: selectedVariants,
      quantity,
      note,
    };

    dispatch(addToCartStart({ tableId, cartItem }));
    
    onClose();
    
    Alert.alert(
      'Added to Cart',
      `${menuItem?.name || menuItemName} has been added to your cart`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { 
          text: 'View Cart', 
          style: 'default',
          onPress: () => navigation.navigate('Cart')
        }
      ]
    );
  };

  const renderVariantGroups = () => {
    if (!menuItem?.variant_groups || menuItem.variant_groups.length === 0) {
      return null;
    }

    return menuItem.variant_groups.map((group, groupIndex) => (
      <View key={groupIndex} style={styles.variantGroup}>
        <Text variant="titleMedium" style={styles.variantGroupTitle}>
          {group.group_name}
        </Text>
        <Text variant="bodySmall" style={styles.variantGroupSubtitle}>
          {group.is_required ? 'Required' : 'Not required'}, Max {group.max_select}
        </Text>
        
        {group.variants?.map((variant, variantIndex) => {
          const selectedVariant = selectedVariants.find(v => v.variant_id === variant.id);
          const isSelected = !!selectedVariant;
          
          return (
            <TouchableOpacity
              key={variantIndex}
              style={styles.variantItem}
              onPress={() => handleVariantChange(variant.id || '', isSelected ? 0 : 1)}
            >
              <View style={[styles.variantCheckbox, isSelected && styles.variantCheckboxSelected]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              
              <View style={styles.variantInfo}>
                <Text style={styles.variantName}>{variant.name}</Text>
                <Text style={styles.variantPrice}>+{formatPrice(variant.price || 0)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text variant="titleLarge" style={styles.headerTitle}>
            {menuItem?.name || menuItemName}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item Info */}
          <Surface style={styles.section} elevation={1}>
            <View style={styles.itemHeader}>
              <Image
                source={{
                  uri: (typeof menuItem?.images?.[0] === 'string' ? menuItem.images[0] : '') || 'https://via.placeholder.com/120',
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text variant="titleMedium" style={styles.itemName}>
                  {menuItem?.name || menuItemName}
                </Text>
                <Text variant="bodyMedium" style={styles.itemDescription}>
                  {menuItem?.description || 'món chính'}
                </Text>
                <Text variant="titleLarge" style={styles.basePrice}>
                  {formatPrice(menuItem?.base_price || menuItemPrice)}
                </Text>
                <Text variant="bodySmall" style={styles.basePriceLabel}>
                  Base Price
                </Text>
              </View>
            </View>
          </Surface>

          {/* Variant Selection */}
          {renderVariantGroups()}

          {/* Note */}
          <Surface style={styles.section} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Note</Text>
            <Text variant="bodySmall" style={styles.sectionSubtitle}>Not required</Text>
            <TextInput
              mode="outlined"
              placeholder="Add any special instructions or notes here"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              style={styles.noteInput}
            />
          </Surface>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Bottom Add to Cart Section */}
        <View style={styles.bottomSection}>
          <View style={styles.quantitySection}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            disabled={loading}
          >
            <Text style={styles.addToCartText}>
              {loading ? 'Loading...' : `Add to Cart - ${formatPrice(totalPrice)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  closeButton: {
    padding: spacing.s,
    marginRight: spacing.s,
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  headerTitle: {
    flex: 1,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  section: {
    marginBottom: spacing.m,
    borderRadius: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
    padding: spacing.m,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: spacing.s,
    marginRight: spacing.m,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    color: Colors.textSecondary,
    marginBottom: spacing.s,
  },
  basePrice: {
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  basePriceLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  sectionTitle: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    color: Colors.textMuted,
    marginBottom: spacing.m,
  },
  variantGroup: {
    marginBottom: spacing.m,
  },
  variantGroupTitle: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  variantGroupSubtitle: {
    color: Colors.textMuted,
    marginBottom: spacing.m,
  },
  variantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  variantCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    marginRight: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  variantCheckboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.backgroundPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  variantInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variantName: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  variantPrice: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: Colors.backgroundPrimary,
  },
  spacer: {
    height: spacing.xl,
  },
  bottomSection: {
    backgroundColor: Colors.backgroundPrimary,
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: spacing.m,
    borderRadius: spacing.m,
    alignItems: 'center',
  },
  addToCartText: {
    color: Colors.backgroundPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddToCartModal;
