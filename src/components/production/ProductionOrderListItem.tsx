import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Chip, Button } from 'react-native-paper';
import StatusDot from '../common/StatusDot/StatusDot';
import { cardSpacing, spacing } from '../../utils/spacing';
import Colors from '../../utils/Colors';
import type { ProductionOrder } from '../../type/production/production';
import { 
  getProductionOrderStatusText, 
  getProductionOrderStatusColor,
  getNextProductionOrderStatus,
  canAdvanceToNextStatus,
} from '../../type/production/production';

interface ProductionOrderListItemProps {
  item: ProductionOrder;
  isTablet?: boolean;
  onPress?: () => void;
  onNextStatus?: (item: ProductionOrder) => void;
  changingStatus?: boolean;
}

const ProductionOrderListItem: React.FC<ProductionOrderListItemProps> = ({ 
  item, 
  isTablet = false, 
  onPress, 
  onNextStatus, 
  changingStatus = false 
}) => {
  const statusColor = getProductionOrderStatusColor(item.status);
  const statusText = getProductionOrderStatusText(item.status);
  const totalOrders = item.orders.length;
  const totalAmount = item.orders.reduce((sum, order) => sum + order.amount, 0);

  const getStatusChipStyle = () => {
    switch (item.status) {
      case 0: // Pending
        return { backgroundColor: '#FFF3E0', textColor: '#F57C00' };
      case 1: // In Progress
        return { backgroundColor: '#E3F2FD', textColor: '#1976D2' };
      case 2: // Completed
        return { backgroundColor: '#E8F5E8', textColor: '#2E7D32' };
      case 3: // Cancelled
        return { backgroundColor: '#FFEBEE', textColor: '#D32F2F' };
      default:
        return { backgroundColor: '#F5F5F5', textColor: '#757575' };
    }
  };

  const chipStyle = getStatusChipStyle();

  return (
    <Pressable onPress={onPress} android_ripple={{ color: Colors.borderLight }}>
      <Surface style={[styles.card, isTablet && styles.tabletCard]} elevation={1}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <Text variant="titleLarge" style={styles.orderCode}>
                #{item.code}
              </Text>
              <View style={styles.statusRow}>
                <StatusDot color={statusColor} />
                <Text variant="bodyMedium" style={styles.statusText}>
                  {statusText}
                </Text>
              </View>
            </View>
            <Chip
              style={[styles.statusChip, { backgroundColor: chipStyle.backgroundColor }]}
              textStyle={{ color: chipStyle.textColor, fontSize: 12, fontWeight: '600' }}
            >
              {statusText}
            </Chip>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statNumber}>
                {totalOrders}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Orders
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="titleMedium" style={styles.statNumber}>
                {totalAmount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Items
              </Text>
            </View>
          </View>

          {item.orders.length > 0 && (
            <View style={styles.ordersSection}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Order Details
              </Text>
              <View style={styles.ordersList}>
                {item.orders.slice(0, isTablet ? 4 : 3).map((order, index) => (
                  <View key={`${order.code}-${index}`} style={styles.orderItem}>
                    <View style={styles.orderInfo}>
                      <Text variant="bodyMedium" style={styles.orderItemCode}>
                        #{order.code}
                      </Text>
                      <View style={styles.amountContainer}>
                        <Text variant="bodySmall" style={styles.amountLabel}>
                          Items:
                        </Text>
                        <Text variant="bodyMedium" style={styles.amountValue}>
                          {order.amount}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                {item.orders.length > (isTablet ? 4 : 3) && (
                  <View style={styles.moreIndicator}>
                    <Text variant="bodySmall" style={styles.moreText}>
                      +{item.orders.length - (isTablet ? 4 : 3)} more orders
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {canAdvanceToNextStatus(item.status) && onNextStatus && (
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => onNextStatus(item)}
                loading={changingStatus}
                disabled={changingStatus}
                style={styles.nextStatusButton}
                labelStyle={styles.nextStatusButtonText}
                compact
              >
                {changingStatus ? 'Updating...' : `Next: ${getProductionOrderStatusText(getNextProductionOrderStatus(item.status)!)}`}
              </Button>
            </View>
          )}
        </View>
      </Surface>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: cardSpacing.horizontal,
    marginVertical: cardSpacing.vertical,
    borderRadius: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
  },
  tabletCard: {
    flex: 1,
    marginHorizontal: spacing.s,
    maxWidth: 400,
    minHeight: 280,
  },
  cardContent: {
    padding: cardSpacing.horizontal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  leftSection: {
    flex: 1,
  },
  orderCode: {
    fontWeight: '700',
    color: Colors.textPrimary,
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: Colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  statusChip: {
    height: 28,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: spacing.s,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 20,
  },
  statLabel: {
    color: Colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 12,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: spacing.m,
  },
  ordersSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: spacing.s,
    padding: spacing.m,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  sectionTitle: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.s,
  },
  ordersList: {
    gap: spacing.s,
  },
  orderItem: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: spacing.xs,
    padding: spacing.s,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemCode: {
    fontWeight: '500',
    color: Colors.textPrimary,
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  amountLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  amountValue: {
    fontWeight: '600',
    color: Colors.primary,
    fontSize: 14,
  },
  moreIndicator: {
    alignItems: 'center',
    paddingVertical: spacing.s,
  },
  moreText: {
    color: Colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: spacing.s,
    paddingTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  nextStatusButton: {
    backgroundColor: Colors.primary,
    borderRadius: spacing.xs,
  },
  nextStatusButtonText: {
    color: Colors.backgroundPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
});

export default ProductionOrderListItem;
