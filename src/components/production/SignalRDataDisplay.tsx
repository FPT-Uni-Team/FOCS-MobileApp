import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../utils/Colors';
import { productionOrderRealtime } from '../../services/productionOrderSignalrService';

interface SignalRDataDisplayProps {
  storeId: string;
}

const SignalRDataDisplay: React.FC<SignalRDataDisplayProps> = ({ storeId }) => {
  const [lastReceivedData, setLastReceivedData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const setupSignalR = async () => {
      try {
        // Check if already connected
        if (productionOrderRealtime.isConnected()) {
          setIsConnected(true);
        } else {
          await productionOrderRealtime.connect(storeId, 'kitchen');
          setIsConnected(true);
        }

        productionOrderRealtime.on('ReceiveOrderWrapUpdate', (cart) => {
          if (isMounted) {
            setLastReceivedData(cart);
          }
        });
             } catch (error) {
         setIsConnected(false);
       }
    };

    setupSignalR();

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SignalR Real-time Data</Text>
        <View style={[styles.statusDot, { backgroundColor: isConnected ? Colors.success : Colors.error }]} />
        <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
      </View>
      
      {lastReceivedData && (
        <ScrollView style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Last Received Data:</Text>
          <Text style={styles.dataText}>
            {JSON.stringify(lastReceivedData, null, 2)}
          </Text>
        </ScrollView>
      )}
      
      {!lastReceivedData && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Waiting for SignalR data...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dataContainer: {
    maxHeight: 200,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  dataText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default SignalRDataDisplay;
