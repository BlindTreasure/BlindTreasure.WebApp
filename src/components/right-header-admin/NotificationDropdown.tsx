"use client";
import React, { useState, useEffect } from "react";
import { useNotification } from '@/hooks/use-notification';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useAppSelector } from '@/stores/store';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    userRole
  } = useNotification();

  // Fetch notifications khi mở dropdown
  useEffect(() => {
    if (isOpen) {
      console.log(`[AdminNotificationDropdown] Fetching notifications for role: ${userRole}`);
      fetchNotifications({ pageIndex: 0, pageSize: 10 });
    }
  }, [isOpen, fetchNotifications, userRole]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleMarkAsRead = async (notificationId: string) => {
    const response = await markNotificationAsRead(notificationId);
    if (response.isSuccess) {
      console.log(`[AdminNotificationDropdown] Notification ${notificationId} marked as read`);
    }
  };

  const handleMarkAllAsRead = async () => {
    const response = await markAllNotificationsAsRead();
    if (response.isSuccess) {
      console.log('[AdminNotificationDropdown] All notifications marked as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    const response = await deleteNotification(notificationId);
    if (response.isSuccess) {
      console.log(`[AdminNotificationDropdown] Notification ${notificationId} deleted`);
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
    <div className="relative">
      <button
        className="relative flex dropdown-toggle items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      
      {isOpen && (
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
                onClick={closeDropdown}
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
      )}
    </div>
  );
}
