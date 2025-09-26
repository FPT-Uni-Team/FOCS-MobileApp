import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import OrderListItem from './OrderListItem';
import type { OrderDTO } from '../../type/order/order';
import Colors from '../../utils/Colors';
import { spacing } from '../../utils/spacing';

interface OrderListProps {
  items: OrderDTO[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const OrderList: React.FC<OrderListProps> = ({ items, loading, refreshing, loadingMore, onRefresh, onLoadMore }) => {
  const onEndReachedCalledDuringMomentumRef = useRef(false);


  const renderItem = ({ item }: { item: OrderDTO }) => <OrderListItem item={item} />;
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

  const handleEndReached = () => {
    if (onEndReachedCalledDuringMomentumRef.current) return;
    onEndReachedCalledDuringMomentumRef.current = true;
    onLoadMore();
  };

  const handleMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentumRef.current = false;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        onMomentumScrollBegin={handleMomentumScrollBegin}
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