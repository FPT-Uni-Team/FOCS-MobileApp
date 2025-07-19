import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar, Surface } from 'react-native-paper';
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
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor={Colors.textSecondary}
        placeholderTextColor={Colors.textPlaceholder}
      />
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
  searchbar: {
    elevation: 0,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: spacing.m,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default SearchBar; 