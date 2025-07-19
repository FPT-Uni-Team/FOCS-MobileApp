import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  tableListRequest,
  setTableParams,
} from '../../store/slices/table/tableListSlice';
import TableCard from '../../components/common/Table/TableCard';
import Pagination from '../../components/common/Pagination/Pagination';
import AppHeader from '../../components/common/AppHeader/AppHeader';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Colors from '../../utils/Colors';

const TableListScreen = () => {
  const dispatch = useAppDispatch();
  
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
      <EmptyState 
        icon="table-furniture" 
        title="Không có bàn nào" 
        subtitle="Danh sách bàn trống"
      />
    );
  };
  
  const totalPages = Math.ceil(total / page_size);

  return (
    <View style={styles.screenContainer}>
      <AppHeader title="Table List" />

      <View style={styles.contentContainer}>
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

        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 8,
  },
  paginationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundPrimary,
  },
});

export default TableListScreen;
