import React, { useEffect, useState } from 'react';
import { X, Check, Trash2, Bell } from 'lucide-react';
import { useNotification } from '@/hooks/use-notification';
import { formatDistanceToNow } from 'date-fns';
import { useAppSelector } from '@/stores/store';
import { signalRService } from '@/services/signalr/signalr-service';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const {
    notifications,
    isLoading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useNotification();
  
  const user = useAppSelector((state) => state.userSlice.user);
  const userRole = user?.roleName || 'Customer';

  // Fetch notifications khi mở dropdown
  useEffect(() => {
    console.log(`[NotificationDropdown] Fetching notifications for role: ${userRole}`);
    fetchNotifications({ pageIndex: 0, pageSize: 10 });
  }, [fetchNotifications, userRole]);

  const handleMarkAsRead = async (notificationId: string) => {
    const response = await markNotificationAsRead(notificationId);
    if (response.isSuccess) {
      // Thông báo đã được đánh dấu đã đọc thành công
      console.log(`[NotificationDropdown] Notification ${notificationId} marked as read`);
    }
  };

  const handleMarkAllAsRead = async () => {
    const response = await markAllNotificationsAsRead();
    if (response.isSuccess) {
      // Tất cả thông báo đã được đánh dấu đã đọc thành công
      console.log('[NotificationDropdown] All notifications marked as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    const response = await deleteNotification(notificationId);
    if (response.isSuccess) {
      // Thông báo đã được xóa thành công
      console.log(`[NotificationDropdown] Notification ${notificationId} deleted`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'System':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'Order':
        return <Bell className="h-4 w-4 text-green-500" />;
      case 'Promotion':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'Product':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  // Lọc thông báo phù hợp với role của người dùng
  const filteredNotifications = notifications.filter(notification => {
    // Nếu notification có targetRole và không khớp với role hiện tại thì bỏ qua
    if (notification.targetRole && notification.targetRole !== userRole) {
      return false;
    }
    
    // Các loại thông báo khác nhau cho từng role
    switch (userRole) {
      case "Customer":
        // Customer nhận thông báo liên quan đến Order, Promotion
        return ["System", "Order", "Promotion", "General"].includes(notification.type);
      case "Seller":
        // Seller nhận thông báo liên quan đến Order, Product
        return ["System", "Order", "Product", "General"].includes(notification.type);
      case "Staff":
      case "Admin":
        // Staff và Admin nhận tất cả các loại thông báo
        return true;
      default:
        return true;
    }
  });

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
        <div className="flex items-center gap-2">
          {filteredNotifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Đánh dấu đã đọc tất cả
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Đang tải thông báo...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.sentAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Đánh dấu đã đọc"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => fetchNotifications({ pageIndex: 0, pageSize: 10 })}
            className="text-sm text-blue-600 hover:text-blue-800 w-full text-center"
          >
            Làm mới thông báo
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 