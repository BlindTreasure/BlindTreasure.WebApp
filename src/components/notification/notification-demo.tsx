import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/hooks/use-notification';

export const NotificationDemo: React.FC = () => {
  const { fetchNotifications, markAllNotificationsAsRead } = useNotification();

  const handleTestNotification = () => {
    // Simulate receiving a notification
    const testNotification = {
      id: Date.now().toString(),
      title: 'Test Notification',
      message: 'This is a test notification from the demo component',
      type: 'System' as const,
      sentAt: new Date().toISOString(),
      isRead: false,
      isDeleted: false,
    };

    // Dispatch custom event to simulate SignalR notification
    window.dispatchEvent(new CustomEvent('notification-received', {
      detail: testNotification
    }));
  };

  const handleFetchNotifications = () => {
    fetchNotifications({ pageIndex: 0, pageSize: 10 });
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Notification Demo</h2>
      <div className="space-y-2">
        <Button onClick={handleTestNotification}>
          Send Test Notification
        </Button>
        <Button onClick={handleFetchNotifications} variant="outline">
          Fetch Notifications
        </Button>
        <Button onClick={handleMarkAllAsRead} variant="outline">
          Mark All as Read
        </Button>
      </div>
    </div>
  );
}; 