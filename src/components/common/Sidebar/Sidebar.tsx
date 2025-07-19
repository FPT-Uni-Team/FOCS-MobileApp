import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MenuItem {
  key: string;
  label: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  { key: 'table', label: 'Table', icon: 'table-furniture' },
  // future items...
];

interface Props {
  selected: string;
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<Props> = ({ selected, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={[styles.container, collapsed && styles.collapsed]}>
      {MENU_ITEMS.map((m) => {
        const active = m.key === selected;
        return (
          <TouchableOpacity
            key={m.key}
            style={[styles.item, active && styles.activeItem]}
            onPress={() => onSelect(m.key)}
          >
            <Icon name={m.icon} size={24} color={active ? '#0d6efd' : '#555'} />
            {!collapsed && (
              <Text style={[styles.label, active && styles.activeLabel]}>{m.label}</Text>
            )}
          </TouchableOpacity>
        );
      })}
      <View style={{ flex: 1 }} />
      <IconButton
        icon={collapsed ? 'chevron-right' : 'chevron-left'}
        size={28}
        onPress={() => setCollapsed(!collapsed)}
        style={styles.toggleBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingVertical: 16,
  },
  collapsed: {
    width: 56,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  activeItem: {
    backgroundColor: '#e8f1ff',
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  activeLabel: {
    color: '#0d6efd',
    fontWeight: '600',
  },
  toggleBtn: {
    alignSelf: 'center',
    marginBottom: 16,
  },
});

export default Sidebar; 