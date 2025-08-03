import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'System' | 'Order' | 'Promotion' | 'Product' | 'General';
  sentAt: string;
  isRead: boolean;
  isDeleted: boolean;
  targetRole?: string; // Thêm trường targetRole để xác định thông báo dành cho role nào
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasMore: true,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Thêm notification mới
    addNotification: (state, action: PayloadAction<Notification>) => {
      const existingIndex = state.notifications.findIndex(
        (n) => n.id === action.payload.id
      );
      
      if (existingIndex === -1) {
        state.notifications.unshift(action.payload);
        // Không tự tăng unreadCount ở đây nữa, sẽ để cho saga hoặc thunk xử lý
        // if (!action.payload.isRead) {
        //   state.unreadCount += 1;
        // }
      }
    },

    appendNotifications: (state, action: PayloadAction<{ notifications: Notification[], hasMore: boolean }>) => {
      // Avoid duplicates
      const newNotifications = action.payload.notifications.filter(
        (newNotif) => !state.notifications.some((existingNotif) => existingNotif.id === newNotif.id)
      );
      state.notifications.push(...newNotifications);
      state.hasMore = action.payload.hasMore;
    },

    // Đánh dấu notification đã đọc
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Đánh dấu tất cả notification đã đọc
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },

    // Xóa notification
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    // Set notifications từ API
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },

    // Set unread count
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setNotifications,
  appendNotifications,
  setUnreadCount,
  setLoading,
  setError,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer; 