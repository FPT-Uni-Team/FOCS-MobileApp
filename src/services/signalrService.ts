import * as signalR from '@microsoft/signalr';
import { addNotification } from '../store/slices/notification/notificationSlice';
import { StaffNotification } from '../type/notification/notification';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private store: any;
  private disableSignalR = false;

  public setStore(store: any) {
    this.store = store;
  }

  public connect(token: string) {
    if (this.disableSignalR) {
      return;
    }

    if (this.connection) {
      return;
    }

    if (!this.store) {
      return;
    }

    if (!token) {
      return;
    }
    
    const signalrUrl = 'https://focs.site/notification';

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(signalrUrl, {
        transport: signalR.HttpTransportType.LongPolling,
        accessTokenFactory: () => {
          return token;
        },
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    this.connection.on('ReceiveNotification', (notification: StaffNotification) => {
      this.store.dispatch(addNotification(notification));
    });

    this.connection.on('KitchenReady', (data: any) => {
      const notification: StaffNotification = {
        id: data.id || this.generateGuid(),
        title: data.title || 'Kitchen Ready',
        message: data.message || 'Food is ready for pickup',
        type: 'KITCHEN_READY',
        priority: 'HIGH',
        isRead: false,
        timestamp: new Date().toISOString(),
        tableNumber: data.table_id ? parseInt(data.table_id) : undefined,
      };
      this.store.dispatch(addNotification(notification));
    });

    this.connection.on('KitchenCallStaff', (data: any) => {
      const notification: StaffNotification = {
        id: data.id || this.generateGuid(),
        title: data.title || 'Kitchen Call Staff',
        message: data.message || 'Kitchen needs staff assistance',
        type: 'CUSTOMER_REQUEST',
        priority: 'URGENT',
        isRead: false,
        timestamp: new Date().toISOString(),
        tableNumber: data.table_id ? parseInt(data.table_id) : undefined,
      };
      this.store.dispatch(addNotification(notification));
    });

    this.connection.on('CustomerCallStaff', (data: any) => {
      const notification: StaffNotification = {
        id: data.id || this.generateGuid(),
        title: data.title || 'Customer Call Staff',
        message: data.message || 'Customer is calling for staff',
        type: 'CUSTOMER_REQUEST',
        priority: 'HIGH',
        isRead: false,
        timestamp: new Date().toISOString(),
        tableNumber: data.table_id ? parseInt(data.table_id) : undefined,
      };
      this.store.dispatch(addNotification(notification));
    });

    this.connection.on('NewOrder', (data: any) => {
      const notification: StaffNotification = {
        id: data.id || this.generateGuid(),
        title: data.title || 'New Order',
        message: data.message || 'You have a new order',
        type: 'NEW_ORDER',
        priority: 'HIGH',
        isRead: false,
        timestamp: new Date().toISOString(),
        tableNumber: data.table_id ? parseInt(data.table_id) : undefined,
      };
      this.store.dispatch(addNotification(notification));
    });

    this.connection.onreconnecting(() => {
    });

    this.connection.onreconnected(() => {
    });

    this.connection.onclose(() => {
    });

    this.connection
      .start()
      .then(() => {
      })
      .catch(() => {
      });
  }

  public disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }

  public getConnectionState(): string {
    return this.connection?.state?.toString() || 'Not Connected';
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export const signalrInstance = new SignalRService(); 