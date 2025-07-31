import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000' }) => {
  const getIconSymbol = (iconName: string): string => {
    const iconMap: Record<string, string> = {
      // Table & Navigation
      'table-furniture': '⬜',
      'account-group-outline': '👥',
      'receipt': '🧾',
      'silverware-fork-knife': '🍴',
      'bell': '🔔',
      'account': '👤',
      'dots-vertical': '⋮',

      // Arrows & Navigation
      'chevron-right': '›',
      'chevron-left': '‹',
      'arrow-left': '←',

      // Actions & UI
      'star': '⭐',
      'close': '✕',
      'cog': '⚙️',
      'help-circle': '❓',
      'information': 'ℹ️',
      'logout': '🚪',
      'magnify': '🔍',

      // Notifications
      'email-open': '📧',
      'bell-off': '🔕',

      // Password visibility
      'eye-outline': '👁️',
      'eye-off-outline': '👁️‍🗨️',

      // Social login
      'facebook': 'f',
      'google': 'G',
      'apple': 'A',

      // Notification types
      'food': '🍽️',
      'hand-back-left': '🖐️',
      'chef-hat': '👨‍🍳',
      'cash': '💵',
    };

    return iconMap[iconName] || '?';
  };

  return (
    <Text style={[styles.icon, { fontSize: size, color }]}>
      {getIconSymbol(name)}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

export default Icon;