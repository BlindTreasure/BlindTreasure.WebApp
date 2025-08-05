"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/stores/store";
import { signalRService } from "@/services/signalr/signalr-service";
import { getNotifications, getUnreadCount } from "@/services/notification/api-services";
import { setNotifications, setUnreadCount, addNotification } from "@/stores/notification-slice";

export const useSignalRNotification = (user: any) => {
  const dispatch = useAppDispatch();
  const hasConnected = useRef(false);

  useEffect(() => {
    if (!user) {
      if (hasConnected.current) {
        signalRService.disconnect();
        hasConnected.current = false;
      }
      return;
    }


    const initializeNotifications = async () => {
      try {
        const notificationsResponse = await getNotifications({ pageIndex: 0, pageSize: 10 });

        if (notificationsResponse.isSuccess && notificationsResponse.value?.data?.items) {
          const notifications = notificationsResponse.value.data.items;
          dispatch(setNotifications(notifications));
        } else {
          console.warn('[SignalRProvider] Failed to load notification list:', notificationsResponse.error);
        }

        const unreadResponse = await getUnreadCount();
        if (unreadResponse.isSuccess) {
          dispatch(setUnreadCount(unreadResponse.value.data));
        } else {
          console.warn('[SignalRProvider] Failed to load unread count:', unreadResponse.error);
        }

        await signalRService.connect();
        hasConnected.current = true;
      } catch (error) {
        console.error('[SignalRProvider] Error during notification initialization:', error);
      }
    };

    const handleNotificationReceived = (event: Event) => {
      const notification = (event as CustomEvent).detail;

      if (shouldProcessNotification(notification, user.roleName)) {
        dispatch(addNotification(notification));

        getUnreadCount().then(response => {
          if (response.isSuccess) {
            dispatch(setUnreadCount(response.value.data));
          }
        });
      }
    };

    const shouldProcessNotification = (notification: any, userRole: string): boolean => {
      if (notification.targetRole && notification.targetRole !== userRole) {
        return false;
      }

      if (notification.type === "System") {
        return true;
      }

      switch (userRole) {
        case "Customer":
          return ["Order", "Promotion", "General", "Trading"].includes(notification.type);
        case "Seller":
          return ["Order", "Product", "General"].includes(notification.type);
        case "Staff":
        case "Admin":
          return true;
        default:
          return true;
      }
    };

    window.addEventListener('notification-received', handleNotificationReceived);
    initializeNotifications();

    return () => {
      window.removeEventListener('notification-received', handleNotificationReceived);
    };
  }, [user, dispatch]);
};
