import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import StatusChip from '../common/StatusChip/StatusChip';
import StatusDot from '../common/StatusDot/StatusDot';
import { formatPrice } from '../../utils/formatPrice';
import { cardSpacing, spacing } from '../../utils/spacing';
import Colors from '../../utils/Colors';
import type { OrderDTO } from '../../type/order/order';
import { 
  getOrderStatusText, 
  getOrderTypeText,
  getPaymentStatusText,
  getOrderStatusColor 
} from '../../type/order/order';

interface OrderListItemProps {
  item: OrderDTO;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ item }) => {
  const navigation = useNavigation<any>();
  
  const handlePress = () => {
    navigation.navigate('OrderDetail', { orderId: item.order_code });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const isPaid = item.payment_status === 1;
  const hasDiscount = (item.discount_amount || 0) > 0;
  const hasTax = (item.tax_amount || 0) > 0;
  const hasNote = item.customer_note && item.customer_note !== 'none' && item.customer_note !== '';

  return (
    <Pressable onPress={handlePress} android_ripple={{ color: Colors.borderLight }}>
      <Surface style={styles.card} elevation={1}>
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <Text variant="titleLarge" style={styles.orderCode}>
                {item.order_code || 'N/A'}
              </Text>
              <View style={styles.statusRow}>
                <StatusDot color={getOrderStatusColor(item.order_status)} />
                <Text variant="bodyMedium" style={styles.statusText}>
                  {getOrderStatusText(item.order_status)}
                </Text>
              </View>
            </View>
            <Chip
              style={[styles.typeChip, { backgroundColor: item.order_type === 0 ? '#E3F2FD' : '#FFF3E0' }]}
              textStyle={{ color: item.order_type === 0 ? '#1976D2' : '#F57C00', fontSize: 12, fontWeight: '500' }}
            >
              {getOrderTypeText(item.order_type)}
            </Chip>
          </View>

          <View style={styles.detailsSection}>
            <Text variant="bodySmall" style={styles.dateTime}>
              {formatDateTime(item.created_at)}
            </Text>
          </View>

          <View style={styles.noteSection}>
            <Text variant="bodySmall" style={styles.noteLabel}>
              Customer Note:
            </Text>
            <Text variant="bodySmall" style={[styles.noteText, !hasNote && styles.noNoteText]}>
              {hasNote ? item.customer_note : 'No special requests'}
            </Text>
          </View>

          <View style={styles.financialSection}>
            <View style={styles.priceRow}>
              <Text variant="bodySmall" style={styles.priceLabel}>Sub Total:</Text>
                          <Text variant="bodyMedium" style={styles.priceValue}>
              {formatPrice(item.sub_total_amount || 0)}
            </Text>
            </View>
            
            {hasDiscount && (
              <View style={styles.priceRow}>
                <Text variant="bodySmall" style={styles.priceLabel}>Discount:</Text>
                <Text variant="bodyMedium" style={[styles.priceValue, styles.discountText]}>
                  -{formatPrice(item.discount_amount || 0)}
                </Text>
              </View>
            )}
            
            {hasTax && (
              <View style={styles.priceRow}>
                <Text variant="bodySmall" style={styles.priceLabel}>Tax:</Text>
                <Text variant="bodyMedium" style={styles.priceValue}>
                  {formatPrice(item.tax_amount || 0)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text variant="titleLarge" style={styles.totalPrice}>
                {formatPrice(item.total_amount || 0)}
              </Text>
              <Text variant="bodySmall" style={styles.totalLabel}>
                Total Amount
              </Text>
            </View>
            
            <View style={styles.actionContainer}>
              <StatusChip
                label={getPaymentStatusText(item.payment_status)}
                isPositive={isPaid}
              />
            </View>
          </View>
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
    fontSize: 20,
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
  typeChip: {
    height: 28,
  },
  detailsSection: {
    marginBottom: spacing.s,
  },
  dateTime: {
    color: Colors.textSecondary,
  },
  noteSection: {
    marginBottom: spacing.m,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: '#F8F9FA',
    borderRadius: spacing.s,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  noteLabel: {
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  noteText: {
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  noNoteText: {
    color: Colors.textMuted,
    fontStyle: 'normal',
  },
  financialSection: {
    marginBottom: spacing.m,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: spacing.s,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  priceLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  priceValue: {
    color: Colors.textPrimary,
    fontWeight: '500',
    fontSize: 12,
  },
  discountText: {
    color: Colors.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalContainer: {
    flex: 1,
  },
  totalPrice: {
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 18,
  },
  totalLabel: {
    color: Colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 11,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
});

export default OrderListItem; 