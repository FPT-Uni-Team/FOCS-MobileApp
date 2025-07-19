import React from 'react';
import { View, StyleSheet } from 'react-native';
import MenuItemList from '../../components/menu/MenuItemList';
import AppHeader from '../../components/common/AppHeader/AppHeader';
import Colors from '../../utils/Colors';

const MenuItemListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="Menu Items" />
      <MenuItemList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
});

export default MenuItemListScreen; 