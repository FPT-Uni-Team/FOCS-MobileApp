import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import OrderDetail from '../../components/order/OrderDetail';
import Colors from '../../utils/Colors';
import type { RootState } from '../../store/store';

interface RouteParams {
  orderId: string;
}

const OrderDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  const { loading, order } = useSelector((state: RootState) => state.orderDetail);

  if (loading && !order.id) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} iconColor={Colors.textPrimary} />
        <Appbar.Content
          title={order.order_code || 'Order Detail'}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <OrderDetail orderId={orderId} />
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
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.backgroundPrimary,
    elevation: 2,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default OrderDetailScreen;