import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text, Menu } from 'react-native-paper';
import Icon from '../Icon/Icon';
import type { TableDTO, TableStatus } from '../../../type/table/table';
import StatusDot from '../StatusDot/StatusDot';
import { useAppDispatch } from '../../../hooks/redux';
import { changeTableStatusRequest } from '../../../store/slices/table/tableListSlice';
import { TABLE_STATUS_COLORS, TABLE_STATUS_LABELS } from '../../../utils/tableStatusColors';

interface Props {
  item: TableDTO;
  onPress?: (item: TableDTO) => void;
  storeId?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const TableCard: React.FC<Props> = ({ item, onPress, storeId }) => {
  const dispatch = useAppDispatch();
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleStatusChange = (status: TableStatus) => {
    if (storeId) {
      dispatch(changeTableStatusRequest({
        tableId: item.tableId,
        storeId: storeId,
        status: status,
      }));
    }
    closeMenu();
  };

  const handleFinishedEating = () => {
    handleStatusChange('Available');
  };

  const statusOptions: { label: string; value: TableStatus; color: string }[] = [
    { label: TABLE_STATUS_LABELS.Available, value: 'Available', color: TABLE_STATUS_COLORS.Available },
    { label: TABLE_STATUS_LABELS.Occupied, value: 'Occupied', color: TABLE_STATUS_COLORS.Occupied },
    { label: TABLE_STATUS_LABELS.Reserved, value: 'Reserved', color: TABLE_STATUS_COLORS.Reserved },
    { label: TABLE_STATUS_LABELS.Cleaning, value: 'Cleaning', color: TABLE_STATUS_COLORS.Cleaning },
    { label: TABLE_STATUS_LABELS.OutOfService, value: 'OutOfService', color: TABLE_STATUS_COLORS.OutOfService },
  ];

  return (
    <Card style={[styles.card, { height: cardWidth }]}>
      <View style={styles.cardHeader}>
        <StatusDot status={item.status} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity 
              onPress={openMenu} 
              style={styles.menuButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="dots-vertical" size={20} color="#666" />
            </TouchableOpacity>
          }
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Thay đổi trạng thái</Text>
          </View>
          {item.status === 'Occupied' && (
            <Menu.Item
              onPress={handleFinishedEating}
              title="🍽️ Khách ăn xong"
              titleStyle={{ color: '#4CAF50', fontWeight: 'bold' }}
            />
          )}
          {statusOptions.map((option) => (
            <Menu.Item
              key={option.value}
                             onPress={() => handleStatusChange(option.value)}
              title={option.label}
              titleStyle={{ 
                color: item.status === option.value ? option.color : '#000',
                fontWeight: item.status === option.value ? 'bold' : 'normal'
              }}
              disabled={item.status === option.value}
            />
          ))}
        </Menu>
      </View>
      <TouchableOpacity style={styles.cardBody} onPress={handlePress} activeOpacity={0.7}>
        <Icon name="table-furniture" size={cardWidth * 0.35} color="#4285F4" />
        <Text style={styles.tableNumber}>{item.tableNumber}</Text>
      </TouchableOpacity>
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
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5f6368',
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