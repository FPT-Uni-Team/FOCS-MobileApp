import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import StatusChip from '../common/StatusChip/StatusChip';
import { formatPrice } from '../../utils/formatPrice';
import type { MenuListDataType } from '../../type/menu/menu';
import Colors from '../../utils/Colors';
import { cardSpacing, spacing } from '../../utils/spacing';

interface MenuItemListItemProps {
  item: MenuListDataType;
}

const MenuItemListItem: React.FC<MenuItemListItemProps> = ({ item }) => {
  return (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
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
        </View>
      </View>
    </Surface>
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
    justifyContent: 'flex-start',
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
});

export default MenuItemListItem; 