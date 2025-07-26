import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderList from '../../components/order/OrderList';
import AppHeader from '../../components/common/AppHeader/AppHeader';
import Colors from '../../utils/Colors';

const OrderListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="Orders" />
      <OrderList />
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