import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar, Surface } from 'react-native-paper';
import Icon from '../Icon/Icon';
import Colors from '../../../utils/Colors';
import { spacing } from '../../../utils/spacing';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search...", 
  value, 
  onChangeText, 
  style 
}) => {
  return (
    <Surface style={[styles.container, style]} elevation={0}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={Colors.textSecondary} />
        <Searchbar
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          iconColor="transparent"
          placeholderTextColor={Colors.textPlaceholder}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: spacing.m,
    paddingHorizontal: spacing.m,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: 'transparent',
    flex: 1,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default SearchBar; 