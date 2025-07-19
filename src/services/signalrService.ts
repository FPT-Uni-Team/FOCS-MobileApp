import * as signalR from '@microsoft/signalr';
import { addNotification } from '../store/slices/notification/notificationSlice';
import { StaffNotification } from '../type/notification/notification';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private store: any;
  private useMockData = true; // Set to false to use real SignalR connection
  private mockTimer: ReturnType<typeof setInterval> | null = null;

  public setStore(store: any) {
    this.store = store;
  }

  public connect(token: string) {
    if (this.useMockData) {
      this.connectMock();
      return;
    }

    if (this.connection || !this.store) {
      return;
    }
    
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL ?? 'https://focs.site';

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/notification`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveNotification', (notification: StaffNotification) => {
      this.store.dispatch(addNotification(notification));
    });

    this.connection
      .start()
      .then(() => console.log('SignalR Connected.'))
      .catch((err) => console.error('SignalR Connection Error: ', err));
  }

  public disconnect() {
    if (this.useMockData) {
      this.disconnectMock();
      return;
    }
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }

  private connectMock() {
    console.log('Starting mock SignalR connection. Notifications will be generated every 10 seconds.');
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
    }
    this.mockTimer = setInterval(() => {
      const mockNotification = this.generateMockNotification();
      console.log('Generated mock notification:', mockNotification);
      if (this.store) {
        this.store.dispatch(addNotification(mockNotification));
      }
    }, 10000);
  }

  private disconnectMock() {
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
      console.log('Stopped mock SignalR connection.');
    }
  }

  private generateMockNotification(): StaffNotification {
    const types: StaffNotification['type'][] = [
      'NEW_ORDER',
      'CUSTOMER_REQUEST',
      'TABLE_STATUS',
      'KITCHEN_READY',
      'PAYMENT',
      'SYSTEM',
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const priorities: StaffNotification['priority'][] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const randomId = Math.floor(Math.random() * 1000);
    return {
      id: `mock-${Date.now()}`,
      title: `Mock Notification ${randomId}`,
      message: `This is a mock message of type: ${type}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type,
      priority,
      tableNumber: Math.floor(Math.random() * 20) + 1,
    };
  }
}

export const signalrInstance = new SignalRService(); 