import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  setNotifications,
  appendNotifications,
  setUnreadCount,
  setLoading,
  setError,
} from "@/stores/notification-slice";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/services/notification/api-services";

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, error, hasMore } =
    useAppSelector((state) => state.notificationSlice);
  const user = useAppSelector((state) => state.userSlice.user);
  const userRole = user?.roleName || "Customer";

  // Fetch notifications from API
  const fetchNotifications = useCallback(
    async ({
      pageIndex,
      pageSize,
      type,
    }: REQUEST.NotificationParamsRequest) => {
      try {
        var params = {
          pageIndex,
          pageSize,
          type,
        };

        dispatch(setLoading(true));
        dispatch(setError(null));

        console.log(
          `[useNotification] Fetching notifications for role: ${userRole}, params:`
        );

        const response = await getNotifications(params);
        if (response.isSuccess && response.value?.data?.items) {
          const newNotifications = response.value.data.items;
          const totalCount = response.value.data.totalCount;

          if (pageIndex === 0) {
            dispatch(setNotifications(newNotifications));
          } else {
            dispatch(
              appendNotifications({
                notifications: newNotifications,
                hasMore:
                  notifications.length + newNotifications.length < totalCount,
              })
            );
          }
        } else {
          console.error(
            "[useNotification] Failed to fetch notifications:",
            response.error
          );
          dispatch(
            setError(response.error?.message || "Failed to fetch notifications")
          );
        }
      } catch (error) {
        console.error("[useNotification] Error fetching notifications:", error);
        dispatch(setError("Failed to fetch notifications"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, userRole, notifications.length]
  );

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      console.log("[useNotification] Fetching unread count");
      const response = await getUnreadCount();
      if (response.isSuccess) {
        dispatch(setUnreadCount(response.value.data));
        console.log(`[useNotification] Unread count: ${response.value.data}`);
      } else {
        console.error(
          "[useNotification] Failed to fetch unread count:",
          response.error
        );
      }
    } catch (error) {
      console.error("[useNotification] Failed to fetch unread count:", error);
    }
  }, [dispatch, user]);

  // Mark notification as read
  const markNotificationAsReadAction = useCallback(
    async (notificationId: string) => {
      try {
        console.log(
          `[useNotification] Marking notification as read: ${notificationId}`
        );
        const response = await markNotificationAsRead(notificationId);
        if (response.isSuccess) {
          dispatch(markAsRead(notificationId));
          fetchUnreadCount();
          console.log(
            `[useNotification] Notification ${notificationId} marked as read successfully`
          );
        } else {
          console.error(
            "[useNotification] Failed to mark notification as read:",
            response.error
          );
        }
        return response;
      } catch (error) {
        console.error(
          "[useNotification] Failed to mark notification as read:",
          error
        );
        return {
          isSuccess: false,
          error: { message: "Failed to mark notification as read" },
        };
      }
    },
    [dispatch, fetchUnreadCount]
  );

  // Mark all notifications as read
  const markAllNotificationsAsReadAction = useCallback(async () => {
    try {
      console.log("[useNotification] Marking all notifications as read");
      const response = await markAllNotificationsAsRead();
      if (response.isSuccess) {
        dispatch(markAllAsRead());
        dispatch(setUnreadCount(0));
        console.log(
          "[useNotification] All notifications marked as read successfully"
        );
        // Fetch lại để đảm bảo đồng bộ
        fetchUnreadCount();
      } else {
        console.error(
          "[useNotification] Failed to mark all notifications as read:",
          response.error
        );
      }
      return response;
    } catch (error) {
      console.error(
        "[useNotification] Failed to mark all notifications as read:",
        error
      );
      return {
        isSuccess: false,
        error: { message: "Failed to mark all notifications as read" },
      };
    }
  }, [dispatch, fetchUnreadCount]);

  // Delete notification
  const deleteNotificationAction = useCallback(
    async (notificationId: string) => {
      try {
        console.log(
          `[useNotification] Deleting notification: ${notificationId}`
        );
        const response = await deleteNotification(notificationId);
        if (response.isSuccess) {
          dispatch(removeNotification(notificationId));
          console.log(
            `[useNotification] Notification ${notificationId} deleted successfully`
          );
          fetchUnreadCount();
        } else {
          console.error(
            "[useNotification] Failed to delete notification:",
            response.error
          );
        }
        return response;
      } catch (error) {
        console.error(
          "[useNotification] Failed to delete notification:",
          error
        );
        return {
          isSuccess: false,
          error: { message: "Failed to delete notification" },
        };
      }
    },
    [dispatch, fetchUnreadCount]
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead: markNotificationAsReadAction,
    markAllNotificationsAsRead: markAllNotificationsAsReadAction,
    deleteNotification: deleteNotificationAction,
    userRole,
  };
};
