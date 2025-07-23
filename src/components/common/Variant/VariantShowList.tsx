import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import StatusChip from '../StatusChip/StatusChip';
import Colors from '../../../utils/Colors';
import { spacing } from '../../../utils/spacing';
import type { VariantGroup } from '../../../type/variant/variant';
import { formatPrice } from '../../../utils/formatPrice';

interface VariantDisplayDetailProps {
  displayVariantGroups: VariantGroup[];
}

const VariantDisplayDetail: React.FC<VariantDisplayDetailProps> = ({ displayVariantGroups }) => {


  if (!displayVariantGroups || displayVariantGroups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyMedium" style={styles.emptyText}>
          No variants configured
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Variant Details
      </Text>
      <View>
        {displayVariantGroups.map((group, index) => (
          <View key={`variant-group-${group.id}-${index}-${Date.now()}`} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <Text variant="titleMedium" style={styles.groupName}>
                {group.group_name}
              </Text>
              {group.is_required && (
                <StatusChip 
                  label="Required" 
                  isPositive={true}
                  style={styles.requiredChip}
                />
              )}
            </View>

            

            {group.variants && group.variants.length > 0 ? (
              <View style={styles.variantsContainer}>
                <Text variant="titleSmall" style={styles.variantsTitle}>
                  Variants:
                </Text>
                {group.variants.map((variant, variantIndex) => (
                  <View key={`variant-${variant.id}-${variantIndex}-${index}`} style={styles.variantCard}>
                    <View style={styles.variantHeader}>
                      <View style={styles.variantNameContainer}>
                        <Text variant="bodyMedium" style={styles.variantName}>
                          {variant.name}
                        </Text>
                        {(variant.prep_per_time || variant.quantity_per_time) ? (
                          <Text variant="bodySmall" style={styles.variantDetails}>
                            {variant.prep_per_time ? `${variant.prep_per_time}min prep` : ''}
                            {variant.prep_per_time && variant.quantity_per_time ? ' • ' : ''}
                            {variant.quantity_per_time ? `Qty: ${variant.quantity_per_time}` : ''}
                          </Text>
                        ) : null}
                      </View>
                      
                      <View style={styles.variantInfo}>
                        <Text style={styles.priceText}>
                          {variant.price > 0 ? `+${formatPrice(variant.price)}` : 'Free'}
                        </Text>
                        <StatusChip 
                          label={variant.is_available ? 'Available' : 'Unavailable'}
                          isPositive={variant.is_available}
                          compact={true}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
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
  groupCard: {
    marginBottom: spacing.l,
    padding: spacing.m,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: spacing.s,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  groupName: {
    flex: 1,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  requiredChip: {
    backgroundColor: Colors.warning,
    borderRadius: 14,
  },
  variantsContainer: {
    marginTop: spacing.s,
  },
  variantsTitle: {
    marginBottom: spacing.s,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  variantCard: {
    backgroundColor: Colors.backgroundPrimary,
    padding: spacing.m,
    borderRadius: spacing.s,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  variantNameContainer: {
    flex: 1,
    paddingRight: spacing.m,
  },
  variantName: {
    fontWeight: '500',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  variantInfo: {
    alignItems: 'flex-end',
  },
  variantDetails: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  priceText: {
    color: Colors.success,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: spacing.xs,
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

export default VariantDisplayDetail; 