import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import CategoryList from '../common/Category/CategoryList';
import { formatPrice } from '../../utils/formatPrice';
import Colors from '../../utils/Colors';
import { spacing, cardSpacing } from '../../utils/spacing';
import {
  fetchMenuItemDetailStart,
  setRefreshing,
} from '../../store/slices/menuItem/menuItemDetailSlice';
import type { RootState } from '../../store/store';

interface MenuItemDetailProps {
  menuItemId: string;
}

const MenuItemDetail: React.FC<MenuItemDetailProps> = ({ menuItemId }) => {
  const dispatch = useDispatch();

  const { loading, menuItem, refreshing } = useSelector((state: RootState) => state.menuItemDetail);
  




  const handleRefresh = () => {
    dispatch(setRefreshing(true));
    dispatch(fetchMenuItemDetailStart(menuItemId));
  };

  useEffect(() => {
    if (menuItemId) {
      dispatch(fetchMenuItemDetailStart(menuItemId));
    }
  }, [dispatch, menuItemId]);





  const renderVariantGroups = () => {
    return menuItem?.variant_groups?.map((group, groupIndex) => (
      <View key={groupIndex} style={styles.variantGroup}>
        <Text variant="titleMedium" style={styles.variantGroupTitle}>
          {group.group_name}
        </Text>
        <Text variant="bodySmall" style={styles.variantGroupSubtitle}>
          {group.is_required ? 'Required' : 'Not required'}, Max {group.max_select}
        </Text>
        
        {group.variants?.map((variant, variantIndex) => (
          <View key={variantIndex} style={styles.variantItem}>
            <View style={styles.variantInfo}>
              <Text style={styles.variantName}>{variant.name}</Text>
              <Text style={styles.variantPrice}>+{formatPrice(variant.price || 0)}</Text>
            </View>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.content}
      >
        {/* Header Info */}
        <Surface style={styles.section} elevation={1}>
          <View style={styles.sectionContent}>
            <Text variant="headlineSmall" style={styles.itemName}>
              {menuItem?.name}
            </Text>
            <Text variant="bodyMedium" style={styles.itemDescription}>
              {menuItem?.description}
            </Text>
            <Text variant="titleLarge" style={styles.basePrice}>
              {formatPrice(menuItem?.base_price || 0)}
            </Text>
            <Text variant="bodySmall" style={styles.basePriceLabel}>
              Base Price
            </Text>
          </View>
        </Surface>

        {/* Categories */}
        <Surface style={styles.section} elevation={1}>
          <View style={styles.sectionContent}>
            <CategoryList categories={menuItem?.categories || []} />
          </View>
        </Surface>

        {/* Variant Selection */}
        {menuItem?.variant_groups && menuItem.variant_groups.length > 0 && (
          <Surface style={styles.section} elevation={1}>
            <View style={styles.sectionContent}>
              {renderVariantGroups()}
            </View>
          </Surface>
        )}

             </ScrollView>
     </View>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingVertical: spacing.s,
  },
  section: {
    marginHorizontal: cardSpacing.horizontal,
    marginVertical: cardSpacing.vertical,
    borderRadius: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
  },
  sectionContent: {
    padding: cardSpacing.horizontal,
  },
  itemName: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    color: Colors.textSecondary,
    marginBottom: spacing.m,
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

  variantGroup: {
    marginBottom: spacing.l,
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

});

export default MenuItemDetail; 