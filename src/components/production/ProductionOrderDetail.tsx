import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Surface, Text, DataTable, Button } from 'react-native-paper';
import Colors from '../../utils/Colors';
import { spacing, cardSpacing } from '../../utils/spacing';
import StatusChip from '../common/StatusChip/StatusChip';
import { 
  getProductionOrderStatusText,
  getNextProductionOrderStatus,
  canAdvanceToNextStatus,
} from '../../type/production/production';
import type { ProductionOrder, KitchenOrderDetailItem } from '../../type/production/production';

interface ProductionOrderDetailProps {
  productionOrder: ProductionOrder;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  items?: KitchenOrderDetailItem[];
  changingStatus?: boolean;
  onNextStatus?: () => void;
}

const ProductionOrderDetail: React.FC<ProductionOrderDetailProps> = ({ 
  productionOrder, 
  loading, 
  refreshing, 
  error, 
  onRefresh, 
  items = [], 
  changingStatus = false, 
  onNextStatus 
}) => {

  if (loading || refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading production order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={onRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (!productionOrder.code) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>No production order data found</Text>
        <Text style={styles.retryText} onPress={onRefresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} />}
      contentContainerStyle={styles.content}
    >
      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Production Order Information</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Order Code:</Text>
            <Text style={styles.value}>{productionOrder.code}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <StatusChip 
              label={getProductionOrderStatusText(productionOrder.status)}
              isPositive={productionOrder.status === 2 || productionOrder.status === 1}
            />
          </View>

          {canAdvanceToNextStatus(productionOrder.status) && onNextStatus && (
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={onNextStatus}
                loading={changingStatus}
                disabled={changingStatus}
                style={styles.nextStatusButton}
                labelStyle={styles.nextStatusButtonText}
              >
                {changingStatus ? 'Updating...' : `Next Status: ${getProductionOrderStatusText(getNextProductionOrderStatus(productionOrder.status)!)}`}
              </Button>
            </View>
          )}
        </View>
      </Surface>

      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Menu Item</DataTable.Title>
              <DataTable.Title>Variants</DataTable.Title>
            </DataTable.Header>

            {items.map((row, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{row.menu_item_name}</DataTable.Cell>
                <DataTable.Cell>
                  {row.variants?.map(v => v.variant_name).join(', ')}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
      </Surface>

      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items:</Text>
            <Text style={styles.summaryValue}>{items.length}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Variants:</Text>
            <Text style={styles.summaryValue}>
              {items.reduce((acc, it) => acc + (it.variants?.length || 0), 0)}
            </Text>
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
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  retryText: {
    color: Colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: spacing.m,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  nextStatusButton: {
    backgroundColor: Colors.primary,
    borderRadius: spacing.s,
  },
  nextStatusButtonText: {
    color: Colors.backgroundPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ProductionOrderDetail;
