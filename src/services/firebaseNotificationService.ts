/* eslint-disable react-native/split-platform-components */
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { getPlatform } from './firebaseNotificationService.android';
import { API_ENDPOINTS } from '../api/endpoint';
import axiosClient from '../api/axiosClient';
import { store } from '../store/store';
import { addNotification } from '../store/slices/notification/notificationSlice';
import soundService from './soundService';
import { StaffNotification } from '../type/notification/notification';

export interface NotificationPayload {
  title: string;
  message: string;
  target_groups: string[];
  store_id: string;
  table_id: string;
}

export interface DeviceTokenData {
  token: string;
  deviceId: string;
  platform: string;
  createdAt: string;
  lastUsedAt: string;
  actorId: string;
}

export interface NotificationData {
  id?: string;
  title?: string;
  message?: string;
  action_type?: 'New Ordered' | 'New Notify';
  table_id?: string;
  store_id?: string;
  order_id?: string;
}

export interface NavigationParams {
  tableId?: string;
  storeId?: string;
  orderId?: string;
}

class FirebaseNotificationService {
  private static instance: FirebaseNotificationService;
  private deviceToken: string | null = null;
  private navigationRef: React.RefObject<NavigationContainerRef<any>> | null = null;
  private isBackgroundHandlerRegistered: boolean = false;
  private actorIdCache: string | null = null;

  private constructor() {}

  public static getInstance(): FirebaseNotificationService {
    if (!FirebaseNotificationService.instance) {
      FirebaseNotificationService.instance = new FirebaseNotificationService();
    }
    return FirebaseNotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return;
      }

      await this.getDeviceToken();
      await this.registerDeviceToken();
      this.setupMessageHandlers();
    } catch (error) {
    }
  }

  private async requestPermission(): Promise<boolean> {
    try {
      const { Platform } = require('react-native');
      const platform = getPlatform();
      if (platform === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            return false;
          }
        }
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    } catch (error) {
      return false;
    }
  }

  private async getDeviceToken(): Promise<string | null> {
    try {
      if (!this.deviceToken) {
        this.deviceToken = await messaging().getToken();
        
        if (this.deviceToken) {
          await AsyncStorage.setItem('firebase_device_token', this.deviceToken);
        }
      }
      
      return this.deviceToken;
    } catch (error) {
      return null;
    }
  }

  /**
   * Register device token with backend API
   */
  private async registerDeviceToken(): Promise<void> {
    try {
      const token = await this.getDeviceToken();
      if (!token) {
        return;
      }

      let actorId = await this.getActorId();
      if (!actorId) {
        actorId = this.generateGuid();
        await AsyncStorage.setItem('actor_id', actorId);
      }

      const now = new Date().toISOString();
      const platform = getPlatform();
      const deviceTokenData: DeviceTokenData = {
        token: token,
        deviceId: await this.getDeviceId(),
        platform: platform,
        createdAt: now,
        lastUsedAt: now,
        actorId: actorId,
      };

      const response = await axiosClient.post(API_ENDPOINTS.AUTH.MOBILE_TOKEN, deviceTokenData);
      
      if (response.data) {
        await AsyncStorage.setItem('token_registered', 'true');
      }
    } catch (error) {
    }
  }

  private setupMessageHandlers(): void {
    messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      this.handleNotificationReceived(remoteMessage);
    });

    if (!this.isBackgroundHandlerRegistered) {
      messaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        this.handleNotificationReceived(remoteMessage);
      });
      this.isBackgroundHandlerRegistered = true;
    }

    messaging().getInitialNotification().then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (remoteMessage) {
        this.handleNotificationOpened(remoteMessage);
      }
    });

    messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      this.handleNotificationOpened(remoteMessage);
    });
  }

  private handleNotificationReceived(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    try {
      const { notification, data } = remoteMessage;
      
      if (data && Object.keys(data).length > 0) {
        const notificationData = data as NotificationData;
        const actionType = notificationData.action_type;
        
        switch (actionType) {
          case 'New Ordered':
            this.handleNewOrderNotification(notificationData);
            break;
          case 'New Notify':
            this.handleNewNotifyNotification(notificationData);
            break;
          default:
            this.createDefaultNotification(notificationData, notification);
        }
      } else {
        this.createDefaultNotification(data, notification);
      }

      this.playNotificationSound();
    } catch (error) {
    }
  }

  private handleNotificationOpened(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    try {
      const { data } = remoteMessage;
      
      if (data) {
        const notificationData = data as NotificationData;
        const actionType = notificationData.action_type;
        switch (actionType) {
          case 'New Ordered':
            this.navigateToOrders(notificationData);
            break;
          case 'New Notify':
            this.navigateToNotifications(notificationData);
            break;
        }
      }
    } catch (error) {
    }
  }

  private handleNewOrderNotification(data: NotificationData): void {
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

    store.dispatch(addNotification(notification));
  }

  private handleNewNotifyNotification(data: NotificationData): void {
    const notification: StaffNotification = {
      id: data.id || this.generateGuid(),
      title: data.title || 'New Notification',
      message: data.message || 'You have a new notification',
      type: 'SYSTEM',
      priority: 'MEDIUM',
      isRead: false,
      timestamp: new Date().toISOString(),
      tableNumber: data.table_id ? parseInt(data.table_id) : undefined,
    };

    store.dispatch(addNotification(notification));
  }

  private createDefaultNotification(data: any, firebaseNotification?: any): void {
    const notification: StaffNotification = {
      id: data?.id || this.generateGuid(),
      title: data?.title || firebaseNotification?.title || 'New Order',
      message: data?.message || data?.body || firebaseNotification?.body || 'You have a new order notification',
      type: 'NEW_ORDER',
      priority: 'HIGH',
      isRead: false,
      timestamp: new Date().toISOString(),
      tableNumber: data?.table_id ? parseInt(data.table_id) : undefined,
    };

    store.dispatch(addNotification(notification));
  }

  private navigateToOrders(data: NotificationData): void {
    try {
      if (this.navigationRef?.current?.isReady()) {
        const params: NavigationParams = {
          tableId: data.table_id,
          storeId: data.store_id,
          orderId: data.order_id,
        };

        this.navigationRef.current.navigate('MainApp', {
          screen: 'Orders',
          params: params,
        });
      }
    } catch (error) {
    }
  }

  private navigateToNotifications(data: NotificationData): void {
    try {
      if (this.navigationRef?.current?.isReady()) {
        const params: NavigationParams = {
          tableId: data.table_id,
          storeId: data.store_id,
        };

        this.navigationRef.current.navigate('MainApp', {
          screen: 'Notifications',
          params: params,
        });
      }
    } catch (error) {
    }
  }

  private async playNotificationSound(): Promise<void> {
    try {
      await soundService.playSound();
    } catch (error) {
    }
  }

  private async getActorId(): Promise<string | null> {
    try {
      if (this.actorIdCache) {
        return this.actorIdCache;
      }

      let actorId = await AsyncStorage.getItem('actor_id');
      
      if (!actorId) {
        const state = store.getState();
        if (state.auth?.user?.username) {
          actorId = state.auth.user.username;
          await AsyncStorage.setItem('actor_id', actorId);
        }
      }

      this.actorIdCache = actorId;
      return actorId;
    } catch (error) {
      return null;
    }
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public async getCurrentToken(): Promise<string | null> {
    return await this.getDeviceToken();
  }

  public async refreshToken(): Promise<void> {
    try {
      this.deviceToken = null;
      await this.getDeviceToken();
      await this.registerDeviceToken();
    } catch (error) {
    }
  }

  public async unregisterToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('firebase_device_token');
      await AsyncStorage.removeItem('token_registered');
      await AsyncStorage.removeItem('actor_id');
      this.deviceToken = null;
      this.actorIdCache = null;
    } catch (error) {
    }
  }

  private async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = this.generateGuid();
        await AsyncStorage.setItem('device_id', deviceId);
      }
      return deviceId;
    } catch (error) {
      return this.generateGuid();
    }
  }

  public setNavigationRef(navigationRef: React.RefObject<NavigationContainerRef<any>>): void {
    this.navigationRef = navigationRef;
  }
}

export default FirebaseNotificationService; 