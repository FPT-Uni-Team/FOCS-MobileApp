import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import StatusChip from '../StatusChip/StatusChip';
import Colors from '../../../utils/Colors';
import { spacing } from '../../../utils/spacing';
import type { CategoryListDataType } from '../../../type/category/category';

interface CategoryListProps {
  categories: CategoryListDataType[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {

  if (!categories || categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" style={styles.emptyText}>
          No categories assigned
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Categories ({categories.length})
      </Text>
      <View>
        {categories.map((item, index) => (
          <View key={`category-${item.id}-${index}`} style={styles.categoryCard}>
            <View style={styles.categoryContent}>
              <View style={styles.categoryInfo}>
                <Text variant="bodyMedium" style={styles.categoryName}>
                  {item.name}
                </Text>
                <StatusChip 
                  label={item.is_active ? 'Active' : 'Inactive'}
                  isPositive={item.is_active}
                />
              </View>
              {item.description ? (
                <Text variant="bodySmall" style={styles.description}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: spacing.l,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryCard: {
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: spacing.s,
    backgroundColor: Colors.backgroundSecondary,
  },
  categoryContent: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    flex: 1,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  description: {
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  emptyContainer: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default CategoryList; 