import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ProductionOrderList from '../../components/production/ProductionOrderList';
import AppHeader from '../../components/common/AppHeader/AppHeader';
import Colors from '../../utils/Colors';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchProductionOrderListStart, setProductionOrderParams } from '../../store/slices/production/productionOrderSlice';
import { productionOrderRealtime } from '../../services/productionOrderSignalrService';

const ProductionOrderListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const storeId = useAppSelector((s) => s.productionOrder.storeId) || '550e8400-e29b-41d4-a716-446655440000';

  useEffect(() => {
    
    dispatch(setProductionOrderParams({ storeId }));
    
    
    const timer = setTimeout(() => {
      dispatch(fetchProductionOrderListStart({ page: 1, page_size: 10, storeId }));
    }, 500);

    let isMounted = true;

    const setup = async () => {
      try {
        await productionOrderRealtime.connect(storeId, 'kitchen');
 
        productionOrderRealtime.on('ReceiveOrderWrapUpdate', () => {
          if (isMounted) dispatch(fetchProductionOrderListStart({ page: 1, page_size: 10, storeId }));
        });
             } catch (error) {
         // SignalR connection failed silently
       }
    };

    setup();

    return () => {
      isMounted = false;
      clearTimeout(timer);
      productionOrderRealtime.disconnect();
    };
  }, [dispatch, storeId]);

  return (
    <View style={styles.container}>
      <AppHeader title="Production Orders" />
      <ProductionOrderList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
});

export default ProductionOrderListScreen;
