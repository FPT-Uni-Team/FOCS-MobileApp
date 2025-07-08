import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { TableDTO } from '../../../type/table/table';
import StatusChip from '../Status/StatusChip';

interface Props {
  item: TableDTO;
  onPress?: (item: TableDTO) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const TableCard: React.FC<Props> = ({ item, onPress }) => {

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <Card style={[styles.card, { height: cardWidth }]} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <StatusChip status={item.status} />
        <IconButton icon="dots-vertical" size={20} onPress={() => {}} style={styles.menuButton} />
      </View>
      <View style={styles.cardBody}>
        <Icon name="table-furniture" size={cardWidth * 0.35} color="#4285F4" />
        <Text style={styles.tableNumber}>{item.tableNumber}</Text>
      </View>
      {item.capacity !== undefined && (
        <View style={styles.cardFooter}>
          <Icon name="account-group-outline" size={16} color="#5f6368" />
          <Text style={styles.capacityText}>{item.capacity} people</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    padding: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    margin: -4,
  },
  cardBody: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#202124',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  capacityText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#5f6368',
  },
});

export default TableCard; 