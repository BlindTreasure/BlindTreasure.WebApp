import request from "@/services/interceptor";
import API_ENDPOINTS from "./api-path";

export const getNotifications = async ({
  pageIndex,
  pageSize,
  type
}: REQUEST.NotificationParamsRequest) => {
  const response = await request<TResponseData<API.NotificationListResponse>>(
    API_ENDPOINTS.NOTIFICATION,
    {
      method: "GET",
      params:{
        pageIndex,
        pageSize,
        type
      },
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
  const response = await request<TResponseData<API.NotificationResponse>>(
    API_ENDPOINTS.MARK_AS_READ(notificationId),
    {
      method: "POST",
    }
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await request<TResponseData<API.MessageNotification>>(
    API_ENDPOINTS.MARK_ALL_AS_READ,
    {
      method: "POST",
    }
  );
  return response.data;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await request<TResponseData<API.MessageNotification>>(
    API_ENDPOINTS.DELETE_NOTIFICATION(notificationId),
    {
      method: "DELETE",
    }
  );
  return response.data;
}; 