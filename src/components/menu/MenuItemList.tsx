import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import MenuItemListItem from './MenuItemListItem';
import { fetchMenuItemsStart } from '../../store/slices/menuItem/menuItemSlice';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import type { MenuListDataType } from '../../type/menu/menu';
import Colors from '../../utils/Colors';
import { spacing } from '../../utils/spacing';

interface MenuItemListProps {}

const MenuItemList: React.FC<MenuItemListProps> = () => {
  const {
    data: menuItems,
    loading,
    refreshing,
    loadingMore,
    handleRefresh,
    handleLoadMore,
  } = usePaginatedList<MenuListDataType>({
    selector: (state) => ({
      loading: state.menuItem.loading,
      items: state.menuItem.items,
      total: state.menuItem.total,
    }),
    fetchAction: fetchMenuItemsStart,
  });

  const renderItem = ({ item }: { item: MenuListDataType }) => (
    <MenuItemListItem item={item} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={styles.loadingFooter} />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No menu items found.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.menuId}
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
    backgroundColor: Colors.backgroundSecondary,
  },
  listContent: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.s,
    flexGrow: 1,
  },
  loadingFooter: {
    marginVertical: spacing.xl,
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

export default MenuItemList; 