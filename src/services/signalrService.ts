import * as signalR from '@microsoft/signalr';
import { addNotification } from '../store/slices/notification/notificationSlice';
import { StaffNotification } from '../type/notification/notification';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private store: any;
  private disableSignalR = true;

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

  




}

export const signalrInstance = new SignalRService(); 