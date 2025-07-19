import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import {  Menu, IconButton, Text, Surface } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  tableListRequest,
  setTableParams,
} from '../../store/slices/table/tableListSlice';
import TableCard from '../../components/common/Table/TableCard';
import BottomNav from '../../components/common/BottomNav/BottomNav';
import useAuth from '../../hooks/useAuth';
import Pagination from '../../components/common/Pagination/Pagination';
import NotificationBell from '../../components/notification/NotificationBell/NotificationBell';
import NotificationScreen from '../notification/NotificationScreen';

const TableListScreen = () => {
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const {
    items,
    page,
    page_size,
    total,
    loading,
    storeId,
  } = useAppSelector((s) => s.tableList);

  const STORE_ID = '550e8400-e29b-41d4-a716-446655440000';

  useEffect(() => {
    if (!storeId) {
      dispatch(setTableParams({ storeId: STORE_ID }));
    } else {
      dispatch(tableListRequest());
    }
  }, [dispatch, storeId]);

  const handleRefresh = useCallback(() => {
    dispatch(tableListRequest());
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(setTableParams({ page: newPage }));
  };

  const renderEmpty = () => {
    if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
    return (
      <View style={styles.emptyContainer}>
        <Text>Không có bàn nào.</Text>
      </View>
    );
  };
  
  const totalPages = Math.ceil(total / page_size);

  return (
    <View style={styles.screenContainer}>
      <Modal
        visible={showNotifications}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <NotificationScreen onBackPress={() => setShowNotifications(false)} />
      </Modal>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Table List
          </Text>
          <View style={styles.headerActions}>
            <NotificationBell 
              onPress={() => setShowNotifications(true)}
            />
            <Menu
              visible={userMenuVisible}
              onDismiss={() => setUserMenuVisible(false)}
              anchor={
                <IconButton
                  icon="account-circle"
                  size={32}
                  onPress={() => setUserMenuVisible(true)}
                  style={styles.userButton}
                />
              }
              anchorPosition="bottom"
            >
              <Menu.Item 
                key="user"
                onPress={() => {}} 
                title="User" 
                leadingIcon="account" 
              />
              <Menu.Item 
                key="logout"
                onPress={() => {
                  logout();
                  setUserMenuVisible(false);
                }} 
                title="Logout" 
                leadingIcon="logout" 
              />
            </Menu>
          </View>
        </View>

        <Surface style={styles.contentArea}>
            <FlatList
              data={items}
              renderItem={({ item }) => <TableCard item={item} />}
              keyExtractor={(item) => item.tableId}
              numColumns={2}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              ListEmptyComponent={renderEmpty}
              refreshControl={
                <RefreshControl refreshing={loading && page === 1} onRefresh={handleRefresh} />
              }
            />
        </Surface>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </View>
      <BottomNav selected="table" onSelect={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F2F4F5',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userButton: {
    backgroundColor: '#f0f0f0',
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});

export default TableListScreen;
