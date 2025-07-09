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
        console.log(`[SignalRProvider] Initializing notifications for role: ${user.roleName}`);
        
        // 1. Fetch danh sách thông báo
        console.log('[SignalRProvider] Fetching notification list');
        const notificationsResponse = await getNotifications({ pageIndex: 0, pageSize: 10 });
        
        if (notificationsResponse.isSuccess && notificationsResponse.value?.data?.items) {
          // Lọc thông báo phù hợp với role của user
          const notifications = notificationsResponse.value.data.items;
          console.log(`[SignalRProvider] Received ${notifications.length} notifications`);
          
          // Cập nhật store với danh sách thông báo đã lọc
          dispatch(setNotifications(notifications));
          console.log('[SignalRProvider] Notification list loaded:', notifications.length, 'items');
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
      
      // Kiểm tra xem thông báo có phù hợp với role của user không
      if (shouldProcessNotification(notification, user.roleName)) {
        dispatch(addNotification(notification));
        
        // Cập nhật lại unread count khi có thông báo mới
        getUnreadCount().then(response => {
          if (response.isSuccess) {
            dispatch(setUnreadCount(response.value.data));
          }
        });
      } else {
        console.log(`[SignalRProvider] Notification filtered out for role ${user.roleName}`);
      }
    };

    // Kiểm tra xem thông báo có phù hợp với role của user không
    const shouldProcessNotification = (notification: any, userRole: string): boolean => {
      // Nếu thông báo có trường targetRole, kiểm tra xem có phù hợp với role của user không
      if (notification.targetRole && notification.targetRole !== userRole) {
        return false;
      }
      
      // Kiểm tra thông báo có phải là thông báo hệ thống và có phù hợp với role không
      if (notification.type === "System") {
        // Thông báo hệ thống cho tất cả các role
        return true;
      }
      
      // Các loại thông báo khác nhau cho từng role
      switch (userRole) {
        case "Customer":
          // Customer nhận thông báo liên quan đến Order, Promotion
          return ["Order", "Promotion", "General"].includes(notification.type);
        case "Seller":
          // Seller nhận thông báo liên quan đến Order, Product
          return ["Order", "Product", "General"].includes(notification.type);
        case "Staff":
        case "Admin":
          // Staff và Admin nhận tất cả các loại thông báo
          return true;
        default:
          return true;
      }
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