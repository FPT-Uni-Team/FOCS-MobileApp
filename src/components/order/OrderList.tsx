import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import OrderListItem from './OrderListItem';
import { fetchOrderListStart } from '../../store/slices/order/orderSlice';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import type { OrderDTO } from '../../type/order/order';
import Colors from '../../utils/Colors';
import { spacing } from '../../utils/spacing';

interface OrderListProps {}

const OrderList: React.FC<OrderListProps> = () => {
  const {
    data: orders,
    loading,
    refreshing,
    loadingMore,
    handleRefresh,
    handleLoadMore,
  } = usePaginatedList<OrderDTO>({
    selector: (state) => ({
      loading: state.order.loading,
      items: state.order.items,
      total: state.order.total,
    }),
    fetchAction: fetchOrderListStart,
    initialParams: { page: 1, page_size: 10 },
  });

  const renderItem = ({ item }: { item: OrderDTO }) => (
    <OrderListItem item={item} onOrderUpdated={handleRefresh} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={styles.loadingFooter} />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No orders found.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  loadingFooter: {
    marginVertical: spacing.l,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default OrderList; 