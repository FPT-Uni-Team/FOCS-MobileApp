import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import OrderList from '../../components/order/OrderList';
import AppHeader from '../../components/common/AppHeader/AppHeader';
import Colors from '../../utils/Colors';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchOrderListStart } from '../../store/slices/order/orderSlice';
import type { OrderListParams } from '../../type/order/order';

const OrderListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, total } = useAppSelector((s) => s.order);
  const notifications = useAppSelector((s) => s.notification.notifications);

  const [params, setParams] = useState<OrderListParams>({ page: 1, page_size: 10 });
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  
  const lastNotificationCountRef = useRef(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback((next: OrderListParams) => {
    dispatch(fetchOrderListStart(next));
  }, [dispatch]);

  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  useEffect(() => {
    if (!loading) {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [loading]);

  // Lắng nghe notification NEW_ORDER để tự refresh
  useEffect(() => {
    const newOrderNotifications = notifications.filter(n => n.type === 'NEW_ORDER');
    const currentCount = newOrderNotifications.length;
    
    if (currentCount > lastNotificationCountRef.current) {
      // Có notification NEW_ORDER mới
      lastNotificationCountRef.current = currentCount;
      
      // Debounce để tránh spam refresh
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        if (!loading && !refreshing) {
          setHasNewOrder(true);
          // Refresh ngay nếu đang ở trang này
          const refreshParams = { ...params, page: 1 };
          setParams(refreshParams);
        }
      }, 2000); // Debounce 2s
    }
  }, [notifications, loading, refreshing, params]);

  // Focus-aware refresh - khi quay lại màn hình và có đơn mới
  useFocusEffect(
    useCallback(() => {
      if (hasNewOrder && !loading) {
        setHasNewOrder(false);
        const refreshParams = { ...params, page: 1 };
        setParams(refreshParams);
      }
    }, [hasNewOrder, loading, params])
  );

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleRefresh = useCallback(() => {
    if (loading) return;
    setRefreshing(true);
    const next = { ...params, page: 1 };
    setParams(next);
  }, [loading, params]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore) return;
    if (items.length >= total) return;
    setLoadingMore(true);
    const next = { ...params, page: params.page + 1 };
    setParams(next);
  }, [loading, loadingMore, items.length, total, params]);

  return (
    <View style={styles.container}>
      <AppHeader title="Orders" />
      <OrderList
        items={items}
        loading={loading}
        refreshing={refreshing}
        loadingMore={loadingMore}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
});

export default OrderListScreen; 