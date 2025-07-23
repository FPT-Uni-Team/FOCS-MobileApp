import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Surface, Appbar } from 'react-native-paper';
import Colors from '../../../utils/Colors';
import { typography } from '../../../utils/theme';

interface AppHeaderProps {
  title: string;
  actions?: React.ReactNode[];
  onBackPress?: () => void;
  showBackButton?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  actions = [],
  onBackPress,
  showBackButton = false,
  statusBarStyle = 'dark-content',
}) => {
  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor={Colors.backgroundPrimary} />
      <Surface style={styles.surface} elevation={4}>
        <Appbar.Header style={styles.header}>
          {showBackButton && onBackPress && (
            <Appbar.BackAction onPress={onBackPress} />
          )}
          <Appbar.Content 
            title={title} 
            titleStyle={styles.title}
          />
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action}
            </React.Fragment>
          ))}
        </Appbar.Header>
      </Surface>
    </>
  );
};

const styles = StyleSheet.create({
  surface: {
    backgroundColor: Colors.backgroundPrimary,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
  },
});

export default AppHeader; 