import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, ActivityIndicator } from 'react-native-paper';
import Icon from '../../components/common/Icon/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ProductionOrderDetail from '../../components/production/ProductionOrderDetail';
import Colors from '../../utils/Colors';
import type { RootState } from '../../store/store';
import { fetchProductionOrderDetailStart, setRefreshing, changeProductionOrderStatusStart } from '../../store/slices/production/productionOrderDetailSlice';
import { setProductionOrderParams } from '../../store/slices/production/productionOrderSlice';
import { getNextProductionOrderStatus } from '../../type/production/production';

interface RouteParams {
  productionOrderCode: string;
}

const ProductionOrderDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { productionOrderCode } = route.params as RouteParams;
  const dispatch = useDispatch();

  const { loading, refreshing, error, productionOrder, items, changingStatus } = useSelector((state: RootState) => state.productionOrderDetail);
  const storeId = useSelector((state: RootState) => state.productionOrder.storeId);
  const listItems = useSelector((state: RootState) => state.productionOrder.items);

  useEffect(() => {
    const defaultStoreId = '550e8400-e29b-41d4-a716-446655440000';
    if (!storeId) {
      dispatch(setProductionOrderParams({ storeId: defaultStoreId }));
    }
    
    if (productionOrderCode) {
      dispatch(fetchProductionOrderDetailStart(productionOrderCode));
    }
  }, [dispatch, productionOrderCode, storeId]);

  // Listen for status changes from the list and update detail accordingly
  useEffect(() => {
    if (productionOrderCode && listItems.length > 0) {
      const listItem = listItems.find(item => item.code === productionOrderCode);
      if (listItem && listItem.status !== productionOrder.status) {
        // Update detail status to match list
        dispatch(fetchProductionOrderDetailStart(productionOrderCode));
      }
    }
  }, [listItems, productionOrderCode, productionOrder.status, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(setRefreshing(true));
    dispatch(fetchProductionOrderDetailStart(productionOrderCode));
  }, [dispatch, productionOrderCode]);

  const handleNextStatus = useCallback(() => {
    if (!items || items.length === 0) return;

    const nextStatus = getNextProductionOrderStatus(productionOrder.status);
    if (nextStatus !== null) {
      const orderWrapIds = items.map(i => i.order_wrap_id).filter(Boolean);
      if (orderWrapIds.length === 0) return;
      dispatch(changeProductionOrderStatusStart({
        orderWrapIds,
        status: nextStatus,
        orderCode: productionOrder.code
      }));
    }
  }, [dispatch, items, productionOrder.status, productionOrder.code]);

  if (loading && !productionOrder.code) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Appbar.Content
          title={productionOrder.code || 'Production Order Detail'}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ProductionOrderDetail 
        productionOrder={productionOrder}
        loading={loading}
        refreshing={refreshing}
        error={error}
        onRefresh={handleRefresh}
        items={items}
        changingStatus={changingStatus}
        onNextStatus={handleNextStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Colors.backgroundPrimary,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default ProductionOrderDetailScreen;
