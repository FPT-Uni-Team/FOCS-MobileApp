import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Surface, Text, Divider, DataTable } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../utils/Colors';
import { spacing, cardSpacing } from '../../utils/spacing';
import StatusChip from '../common/StatusChip/StatusChip';
import { 
  getOrderStatusText, 
  getOrderTypeText, 
  getPaymentStatusText,
} from '../../type/order/order';
import { formatPrice } from '../../utils/formatPrice';
import {
  fetchOrderDetailStart,
  setRefreshing,
} from '../../store/slices/order/orderDetailSlice';
import type { RootState } from '../../store/store';

interface OrderDetailProps {
  orderId: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId }) => {
  const dispatch = useDispatch();
  const { loading, order, refreshing, error } = useSelector((state: RootState) => state.orderDetail);
  
  const handleRefresh = useCallback(() => {
    dispatch(setRefreshing(true));
    dispatch(fetchOrderDetailStart(orderId));
  }, [orderId]);

  useEffect(() => {
    if (orderId && !loading && (!order.id || order.order_code !== orderId)) {
      dispatch(fetchOrderDetailStart(orderId));
    }
  }, [orderId]);

  
  if (loading || refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }


  if (!order.id) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No order data found</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={handleRefresh} />}
      contentContainerStyle={styles.content}
    >
     
      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Order Code:</Text>
            <Text style={styles.value}>{order.order_code}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <StatusChip 
              label={getOrderStatusText(order.order_status)}
              isPositive={order.order_status === 4 || order.order_status === 1}
            />
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{getOrderTypeText(order.order_type)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Payment:</Text>
            <Text style={styles.value}>{getPaymentStatusText(order.payment_status)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Created:</Text>
            <Text style={styles.value}>{new Date(order.created_at).toLocaleString()}</Text>
          </View>
          
          {order.customer_note && (
            <View style={styles.row}>
              <Text style={styles.label}>Note:</Text>
              <Text style={styles.value}>{order.customer_note}</Text>
            </View>
          )}
        </View>
      </Surface>

     
      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Item</DataTable.Title>
              <DataTable.Title numeric>Qty</DataTable.Title>
              <DataTable.Title numeric>Price</DataTable.Title>
              <DataTable.Title numeric>Total</DataTable.Title>
            </DataTable.Header>

            {order.order_details?.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell>
                  <View>
                    <Text style={styles.itemName}>{item.menu_item_name}</Text>
                    {item.variant_name && (
                      <Text style={styles.variantName}>{item.variant_name}</Text>
                    )}
                    {item.note && (
                      <Text style={styles.itemNote}>Note: {item.note}</Text>
                    )}
                  </View>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text>{item.quantity}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text>{formatPrice(item.unit_price)}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text>{formatPrice(item.total_price)}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
      </Surface>

    
      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatPrice(order.sub_total_amount)}</Text>
          </View>
          
          {order.tax_amount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax:</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.tax_amount)}</Text>
            </View>
          )}
          
          {order.discount_amount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount:</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>-{formatPrice(order.discount_amount)}</Text>
            </View>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total_amount)}</Text>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  variantName: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  itemNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  discountText: {
    color: Colors.success,
  },
  divider: {
    marginVertical: spacing.s,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  loadingText: {
    marginTop: spacing.s,
    color: Colors.textSecondary,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  retryText: {
    color: Colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default OrderDetail;