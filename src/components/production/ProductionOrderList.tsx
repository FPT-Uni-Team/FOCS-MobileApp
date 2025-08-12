import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import SearchBar from '../common/SearchBar/SearchBar';
import ProductionOrderListItem from './ProductionOrderListItem';
import { fetchProductionOrderListStart } from '../../store/slices/production/productionOrderSlice';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { useAppSelector } from '../../hooks/redux';
import type { ProductionOrder } from '../../type/production/production';
import Colors from '../../utils/Colors';
import { spacing } from '../../utils/spacing';

interface ProductionOrderListProps {}

const ProductionOrderList: React.FC<ProductionOrderListProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const error = useAppSelector((state) => state.productionOrder.error);
  const storeId = useAppSelector((state) => state.productionOrder.storeId);

  const {
    data: productionOrders,
    loading,
    refreshing,
    loadingMore,
    handleRefresh,
    handleLoadMore,
    updateParams,
  } = usePaginatedList<ProductionOrder>({
    selector: (state) => ({
      loading: state.productionOrder.loading,
      items: state.productionOrder.items,
      total: state.productionOrder.total,
      error: state.productionOrder.error,
    }),
    fetchAction: fetchProductionOrderListStart,
    initialParams: { 
      page: 1, 
      page_size: 10,
      storeId: storeId || '550e8400-e29b-41d4-a716-446655440000',
    },
  });

  

  const onSearch = (value: string) => {
    setSearchQuery(value);
    updateParams((prev) => ({
      ...prev,
      page: 1,
      search_by: 'code',
      search_value: value,
    }));
  };

  const renderItem = ({ item }: { item: ProductionOrder }) => (
    <ProductionOrderListItem 
      item={item}
      onPress={() => {
        // Navigate to detail screen when implemented
      }}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={styles.loadingFooter} />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No production orders found.</Text>
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search production orders..."
        value={searchQuery}
        onChangeText={onSearch}
      />

      <FlatList
        data={productionOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
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
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: spacing.s,
  },
});

export default ProductionOrderList;
