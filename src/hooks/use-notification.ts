import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  setNotifications,
  setUnreadCount,
  setLoading,
  setError,
} from '@/stores/notification-slice';
import { getNotifications, getUnreadCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '@/services/notification/api-services';

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, error } = useAppSelector((state) => state.notificationSlice);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (params: { pageIndex: number; pageSize: number }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await getNotifications(params);
      if (response.isSuccess) {
        dispatch(setNotifications(response.value.data.items));
      } else {
        dispatch(setError(response.error?.message || 'Failed to fetch notifications'));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      dispatch(setError('Failed to fetch notifications'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      if (response.isSuccess) {
        dispatch(setUnreadCount(response.value.data));
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [dispatch]);

  // Mark notification as read
  const markNotificationAsReadAction = useCallback(async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.isSuccess) {
        dispatch(markAsRead(notificationId));
        // Luôn fetch lại unreadCount để đảm bảo UI đồng bộ với server
        fetchUnreadCount();
      }
      return response;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return {
        isSuccess: false,
        error: { message: 'Failed to mark notification as read' }
      };
    }
  }, [dispatch, fetchUnreadCount]);

  // Mark all notifications as read
  const markAllNotificationsAsReadAction = useCallback(async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.isSuccess) {
        dispatch(markAllAsRead());
        dispatch(setUnreadCount(0));
        // Fetch lại để đảm bảo đồng bộ
        fetchUnreadCount();
      }
      return response;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return {
        isSuccess: false,
        error: { message: 'Failed to mark all notifications as read' }
      };
    }
  }, [dispatch, fetchUnreadCount]);

  // Delete notification
  const deleteNotificationAction = useCallback(async (notificationId: string) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.isSuccess) {
        dispatch(removeNotification(notificationId));
        // Luôn fetch lại unreadCount
        fetchUnreadCount();
      }
      return response;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return {
        isSuccess: false,
        error: { message: 'Failed to delete notification' }
      };
    }
  }, [dispatch, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead: markNotificationAsReadAction,
    markAllNotificationsAsRead: markAllNotificationsAsReadAction,
    deleteNotification: deleteNotificationAction,
  };
}; 