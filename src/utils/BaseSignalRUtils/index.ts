// src/services/signalr/base-signalr.service.ts
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getStorageItem } from '@/utils/local-storage';

export abstract class BaseSignalRService {
  protected connection: HubConnection | null = null;
  protected isConnecting = false;
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = 5;
  protected connectionUrl: string;

  constructor(connectionUrl: string) {
    this.connectionUrl = connectionUrl;
  }

  protected async createConnection(): Promise<HubConnection> {
    const accessToken = getStorageItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found');
    }

    return new HubConnectionBuilder()
      .withUrl(this.connectionUrl, {
        accessTokenFactory: () => accessToken,
        skipNegotiation: false,
        withCredentials: false
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
      .configureLogging(LogLevel.Information)
      .build();
  }

  protected setupConnectionHandlers(connection: HubConnection, type: string): void {
    connection.onclose((error) => {
      this.isConnecting = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.connect(), 5000);
      } else {
        console.warn(`[SignalR] Max reconnect attempts reached for ${type} connection`);
      }
    });

    connection.onreconnecting((error) => {
    });

    connection.onreconnected((connectionId) => {
      this.reconnectAttempts = 0;
    });
  }

  protected abstract setupEventHandlers(): void;

  async connect(): Promise<void> {
    if (this.connection?.state === 'Connected' || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      // Stop existing connection if any
      if (this.connection) {
        try {
          await this.connection.stop();
        } catch (err) {
          console.warn('[SignalR] Error stopping previous connection', err);
        }
        this.connection = null;
      }

      // Create new connection
      this.connection = await this.createConnection();
      
      // Setup event handlers
      this.setupEventHandlers();
      this.setupConnectionHandlers(this.connection, this.constructor.name);

      // Start connection
      await this.connection.start();
      
      this.isConnecting = false;
      this.reconnectAttempts = 0;

    } catch (error) {
      console.error('[SignalR] Connection failed:', error);
      this.isConnecting = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.connect(), 5000);
      } else {
        console.warn('[SignalR] Max reconnect attempts reached');
      }
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.stop();
      }
    } catch (err) {
      console.error('[SignalR] Error during disconnect:', err);
    } finally {
      this.connection = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    }
  }

  isConnected(): boolean {
    return this.connection?.state === 'Connected' || false;
  }

  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }

  protected addEventListener<T>(eventName: string, callback: (data: T) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener(eventName, handler as EventListener);
    
    return () => {
      window.removeEventListener(eventName, handler as EventListener);
    };
  }

  protected dispatchEvent<T>(eventName: string, data: T): void {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }
}