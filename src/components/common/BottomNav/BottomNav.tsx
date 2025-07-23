import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '../../../hooks/redux';
import Colors from '../../../utils/Colors';
import { spacing, ICON_SIZES, LAYOUT } from '../../../utils/theme';

interface MenuItem {
  key: string;
  icon: string;
}
const MENU: MenuItem[] = [
  { key: 'table', icon: 'table-furniture' },
  { key: 'menu', icon: 'silverware-fork-knife' },
  { key: 'notification', icon: 'bell' },
  { key: 'profile', icon: 'account' },
];

interface Props {
  selected: string;
  onSelect: (k: string) => void;
}

const BottomNav: React.FC<Props> = ({ selected, onSelect }) => {
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  return (
    <View style={styles.container}>
      {MENU.map(m => {
        const active = m.key === selected;
        return (
          <TouchableOpacity key={m.key} style={styles.item} onPress={() => onSelect(m.key)}>
            <View style={styles.iconContainer}>
              <Icon 
                name={m.icon} 
                size={ICON_SIZES.xl} 
                color={active ? Colors.primary : Colors.textMuted} 
              />
              {m.key === 'notification' && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.backgroundPrimary,
    height: LAYOUT.bottomNavHeight,
  },
  item: { 
    padding: spacing.s 
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundPrimary,
  },
  badgeText: {
    color: Colors.backgroundPrimary,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default BottomNav; 