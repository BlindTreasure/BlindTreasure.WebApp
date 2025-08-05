import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Trash2, Bell } from 'lucide-react';
import { useNotification } from '@/hooks/use-notification';
import { formatDistanceToNow } from 'date-fns';
import { useAppSelector } from '@/stores/store';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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
    hasMore,
  } = useNotification();
  
  const [page, setPage] = useState(0);
  const user = useAppSelector((state) => state.userSlice.user);
  const userRole = user?.roleName || 'Customer';
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNotificationElementRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications({ pageIndex: 0, pageSize: 10 });
  }, [fetchNotifications]);

  useEffect(() => {
    if (isLoading) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver);

    if (lastNotificationElementRef.current) {
      observer.current.observe(lastNotificationElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page > 0) {
      fetchNotifications({ pageIndex: page, pageSize: 10 });
    }
  }, [page, fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string, sourceUrl?: string) => {
    const response = await markNotificationAsRead(notificationId);
    if (response.isSuccess) {
      console.log(`[NotificationDropdown] Notification ${notificationId} marked as read`);
      
      // Nếu có sourceUrl thì chuyển hướng đến trang đó
      if (sourceUrl) {
        // Đóng dropdown trước khi chuyển hướng
        onClose();
        // Chuyển hướng đến sourceUrl
        router.push(sourceUrl);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    const response = await markAllNotificationsAsRead();
    if (response.isSuccess) {
      console.log('[NotificationDropdown] All notifications marked as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    const response = await deleteNotification(notificationId);
    if (response.isSuccess) {
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
      case 'Trading':
        return <Bell className="h-4 w-4 text-orange-500" />;
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
        return ["System", "Order", "Promotion", "General", "Trading"].includes(notification.type);
      case "Seller":
        // Seller nhận thông báo liên quan đến Order, Product
        return ["System", "Order", "Product", "General", "Trading"].includes(notification.type);
      case "Staff":
      case "Admin":
        // Staff và Admin nhận tất cả các loại thông báo
        return true;
      default:
        return true;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
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
      <div className="max-h-[60vh] overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
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
            {filteredNotifications.map((notification, index) => {
              const isLastElement = index === filteredNotifications.length - 1;
              const hasSourceUrl = notification.type === 'Trading' && notification.sourceUrl;
              
              return (
                <div
                  ref={isLastElement ? lastNotificationElementRef : null}
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
                              onClick={() => handleMarkAsRead(notification.id, hasSourceUrl ? notification.sourceUrl : undefined)}
                              className={`p-1 transition-colors ${
                                hasSourceUrl 
                                  ? 'text-orange-500 hover:text-orange-700' 
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                              title={hasSourceUrl ? "Đánh dấu đã đọc và xem chi tiết" : "Đánh dấu đã đọc"}
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
              );
            })}
            {isLoading && notifications.length > 0 && (
              <div className="p-4 text-center text-gray-500">
                Đang tải thêm...
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;