import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Card, List, Button } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/auth/authSlice';
import Colors from '../../utils/Colors';
import { spacing, LAYOUT } from '../../utils/theme';

const UserProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);  

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={LAYOUT.avatarSize.xl} 
          label={user?.username?.charAt(0).toUpperCase() || 'U'} 
          style={styles.avatar} 
        />
        <Text variant="headlineSmall" style={styles.username}>
          {user?.username || 'Unknown User'}
        </Text>
        <Text variant="bodyMedium" style={styles.role}>
          Staff Member
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Account</List.Subheader>
            <List.Item
              title="Personal Information"
              left={props => <List.Icon {...props} icon="account" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Settings"
              left={props => <List.Icon {...props} icon="cog" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Help & Support"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="About"
              left={props => <List.Icon {...props} icon="information" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <View style={styles.logoutContainer}>
        <Button 
          mode="outlined" 
          onPress={handleLogout}
          icon="logout"
          style={styles.logoutButton}
          textColor={Colors.error}
          buttonColor={Colors.backgroundMuted}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    backgroundColor: Colors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatar: {
    backgroundColor: Colors.primary,
    marginBottom: spacing.l,
  },
  username: {
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: spacing.xs,
  },
  role: {
    color: Colors.textSecondary,
  },
  card: {
    margin: spacing.l,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutContainer: {
    padding: spacing.l,
    marginTop: spacing.l,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
});

export default UserProfileScreen; 