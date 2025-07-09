import request from "@/services/interceptor";
import API_ENDPOINTS from "./api-path";

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: 'System' | 'Order' | 'Promotion' | 'General';
  sentAt: string;
  isRead: boolean;
  isDeleted: boolean;
}

export interface NotificationListResponse {
  items: NotificationResponse[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export const getNotifications = async (params: { pageIndex: number; pageSize: number }) => {
  const response = await request<TResponseData<NotificationListResponse>>(
    API_ENDPOINTS.NOTIFICATION,
    {
      method: "GET",
      params,
    }
  );
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await request<TResponseData<number>>(
    API_ENDPOINTS.UNREAD_COUNT,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await request<TResponseData<NotificationResponse>>(
    API_ENDPOINTS.MARK_AS_READ(notificationId),
    {
      method: "POST",
    }
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await request<TResponseData<{ message: string }>>(
    API_ENDPOINTS.MARK_ALL_AS_READ,
    {
      method: "POST",
    }
  );
  return response.data;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await request<TResponseData<{ message: string }>>(
    API_ENDPOINTS.DELETE_NOTIFICATION(notificationId),
    {
      method: "DELETE",
    }
  );
  return response.data;
}; 