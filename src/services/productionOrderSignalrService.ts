import * as signalR from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EventHandler = (...args: any[]) => void;

class ProductionOrderSignalRService {
  private connection: signalR.HubConnection | null = null;
  private subscribedEvents: Map<string, EventHandler> = new Map();

  public async connect(storeId: string, dept: string = 'kitchen'): Promise<void> {
    if (this.connection) {
      return;
    }

    const hubUrl = `https://focs.site/hubs/order?dept=${dept}&storeId=${storeId}`;

    const accessToken = (await AsyncStorage.getItem('accessToken')) || '';

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        transport: signalR.HttpTransportType.LongPolling,
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

                   await this.connection.start();
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        this.subscribedEvents.forEach((handler, event) => {
          this.connection?.off(event, handler);
        });
        this.subscribedEvents.clear();
        await this.connection.stop();
      } finally {
        this.connection = null;
      }
    }
  }

  public on(eventName: string, handler: EventHandler): void {
    if (!this.connection) return;
    this.connection.on(eventName, handler);
    this.subscribedEvents.set(eventName, handler);
  }

  public off(eventName: string): void {
    const handler = this.subscribedEvents.get(eventName);
    if (!this.connection || !handler) return;
    this.connection.off(eventName, handler);
    this.subscribedEvents.delete(eventName);
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const productionOrderRealtime = new ProductionOrderSignalRService();



