import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Surface } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import VariantDisplayDetail from '../common/Variant/VariantShowList';
import CategoryList from '../common/Category/CategoryList';
import Colors from '../../utils/Colors';
import { spacing, cardSpacing } from '../../utils/spacing';
import {
  fetchMenuItemDetailStart,
  setRefreshing,
} from '../../store/slices/menuItem/menuItemDetailSlice';
import type { RootState } from '../../store/store';

interface MenuItemDetailProps {
  menuItemId: string;
}

const MenuItemDetail: React.FC<MenuItemDetailProps> = ({ menuItemId }) => {
  const dispatch = useDispatch();
  const { loading, menuItem, refreshing } = useSelector((state: RootState) => state.menuItemDetail);

  const handleRefresh = () => {
    dispatch(setRefreshing(true));
    dispatch(fetchMenuItemDetailStart(menuItemId));
  };

  useEffect(() => {
    if (menuItemId) {
      dispatch(fetchMenuItemDetailStart(menuItemId));
    }
  }, [dispatch, menuItemId]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={handleRefresh} />}
      contentContainerStyle={styles.content}
    >
     
      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <CategoryList categories={menuItem.categories || []} />
        </View>
      </Surface>

     
      <Surface style={styles.section} elevation={1}>
        <View style={styles.sectionContent}>
          <VariantDisplayDetail displayVariantGroups={menuItem.variant_groups || []} />
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    paddingVertical: spacing.s,
  },
  section: {
    marginHorizontal: cardSpacing.horizontal,
    marginVertical: cardSpacing.vertical,
    borderRadius: spacing.m,
    backgroundColor: Colors.backgroundPrimary,
  },
  sectionContent: {
    padding: cardSpacing.horizontal,
  },
});

export default MenuItemDetail; 