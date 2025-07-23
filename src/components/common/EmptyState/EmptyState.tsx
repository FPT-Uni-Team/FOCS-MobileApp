import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import Colors from '../../../utils/Colors';
import { typography } from '../../../utils/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  iconSize?: number;
  iconColor?: string;
  style?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  iconSize = 48,
  iconColor = Colors.textMuted,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <IconButton 
        icon={icon} 
        size={iconSize} 
        iconColor={iconColor}
        style={styles.icon}
      />
      <Text style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState; 