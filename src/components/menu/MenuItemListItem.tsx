import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import StatusChip from '../common/StatusChip/StatusChip';
import AddToCartModal from './AddToCartModal';
import { formatPrice } from '../../utils/formatPrice';
import type { MenuListDataType } from '../../type/menu/menu';
import Colors from '../../utils/Colors';
import { cardSpacing, spacing } from '../../utils/spacing';

interface MenuItemListItemProps {
  item: MenuListDataType;
}

const MenuItemListItem: React.FC<MenuItemListItemProps> = ({ item }) => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    navigation.navigate('MenuItemDetail', { menuItemId: item.menuId });
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    
    if (!item.isAvailable) {
      return;
    }

    setModalVisible(true);
  };

  return (
    <>
      <Pressable onPress={handlePress} android_ripple={{ color: '#ccc' }}>
        <Surface style={styles.card} elevation={1}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              {imageError ? (
                <View style={[styles.menuImage, styles.placeholderContainer]}>
                  <Text style={styles.placeholderText}>🍽️</Text>
                </View>
              ) : (
                <Image
                  source={{
                    uri: item.menuImageUrl || 'https://via.placeholder.com/120x120?text=Food',
                  }}
                  style={styles.menuImage}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              )}
              <View style={styles.titleContainer}>
                <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
                  {item.menuName}
                </Text>
                {item.menuDescription && (
                  <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                    {item.menuDescription}
                  </Text>
                )}
              </View>
              <StatusChip
                label={item.isAvailable ? 'Available' : 'Unavailable'}
                isPositive={item.isAvailable}
              />
            </View>

            <View style={styles.footer}>
              <View style={styles.priceContainer}>
                <Text variant="titleMedium" style={styles.price}>
                  {formatPrice(item.menuBasePrice)}
                </Text>
                <Text variant="bodySmall" style={styles.priceLabel}>
                  Base Price
                </Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  !item.isAvailable && styles.disabledButton
                ]}
                onPress={handleAddToCart}
                disabled={!item.isAvailable}
              >
                <Text style={styles.addToCartIcon}>🛒</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Surface>
      </Pressable>

      <AddToCartModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        menuItemId={item.menuId}
        menuItemName={item.menuName}
        menuItemPrice={item.menuBasePrice}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: cardSpacing.horizontal,
    marginVertical: cardSpacing.vertical,
    borderRadius: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
  },
  cardContent: {
    padding: cardSpacing.horizontal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: spacing.s,
    marginRight: spacing.m,
    backgroundColor: Colors.backgroundSecondary,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  placeholderText: {
    fontSize: 32,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.m,
  },
  title: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  price: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  priceLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textMuted,
    opacity: 0.5,
  },
  addToCartIcon: {
    fontSize: 18,
  },
});

export default MenuItemListItem; 