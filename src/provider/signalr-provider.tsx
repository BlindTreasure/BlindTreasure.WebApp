"use client";

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/stores/store';
import { signalRService } from '@/services/signalr/signalr-service';
import { getNotifications, getUnreadCount } from '@/services/notification/api-services';
import { setNotifications, setUnreadCount, addNotification } from '@/stores/notification-slice';

interface SignalRProviderProps {
  children: React.ReactNode;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const user = useAppSelector((state) => state.userSlice.user);
  const hasConnected = useRef(false);
  const dispatch = useAppDispatch();

  // Luồng xử lý khi user login/logout
  useEffect(() => {
    if (!user) {
      // Nếu không có user (chưa đăng nhập hoặc đã đăng xuất)
      if (hasConnected.current) {
        console.log('[SignalRProvider] User logged out, disconnecting SignalR');
        signalRService.disconnect();
        hasConnected.current = false;
      }
      return;
    }

    // User đã đăng nhập, thực hiện các bước sau theo thứ tự:
    const initializeNotifications = async () => {
      try {
        // 1. Fetch danh sách thông báo
        console.log('[SignalRProvider] Fetching notification list');
        const notificationsResponse = await getNotifications({ pageIndex: 0, pageSize: 10 });
        if (notificationsResponse.isSuccess && notificationsResponse.value?.data?.items) {
          dispatch(setNotifications(notificationsResponse.value.data.items));
          console.log('[SignalRProvider] Notification list loaded:', notificationsResponse.value.data.items.length, 'items');
        } else {
          console.warn('[SignalRProvider] Failed to load notification list:', notificationsResponse.error);
        }

        // 2. Fetch unread count
        console.log('[SignalRProvider] Fetching unread count');
        const unreadResponse = await getUnreadCount();
        if (unreadResponse.isSuccess) {
          dispatch(setUnreadCount(unreadResponse.value.data));
          console.log('[SignalRProvider] Unread count loaded:', unreadResponse.value.data);
        } else {
          console.warn('[SignalRProvider] Failed to load unread count:', unreadResponse.error);
        }

        // 3. Kết nối SignalR sau khi đã tải dữ liệu ban đầu
        console.log('[SignalRProvider] Connecting to SignalR');
        await signalRService.connect();
        hasConnected.current = true;
        console.log('[SignalRProvider] SignalR connection established');

      } catch (error) {
        console.error('[SignalRProvider] Error during notification initialization:', error);
      }
    };

    // Setup event listener cho notification mới từ SignalR
    const handleNotificationReceived = (event: Event) => {
      const notification = (event as CustomEvent).detail;
      console.log('[SignalRProvider] New notification received:', notification);
      dispatch(addNotification(notification));
      
      // Cập nhật lại unread count khi có thông báo mới
      getUnreadCount().then(response => {
        if (response.isSuccess) {
          dispatch(setUnreadCount(response.value.data));
        }
      });
    };

    // Đăng ký lắng nghe sự kiện notification
    window.addEventListener('notification-received', handleNotificationReceived);

    // Khởi tạo notifications
    initializeNotifications();

    // Cleanup khi unmount
    return () => {
      window.removeEventListener('notification-received', handleNotificationReceived);
    };
  }, [user, dispatch]);

  return <>{children}</>;
}; 