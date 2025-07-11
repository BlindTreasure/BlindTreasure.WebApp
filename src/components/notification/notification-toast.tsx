import React, { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationToastProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: 'System' | 'Order' | 'Promotion' | 'General';
    sentAt: string;
  };
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'System':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'Order':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'Promotion':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Now';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {formatTime(notification.sentAt)}
                </p>
              </div>
              
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook để hiển thị notification toast
export const useNotificationToast = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleNotificationReceived = (event: CustomEvent) => {
      const notification = event.detail;
      
      // Add notification to list
      setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
      
      // Show toast
      toast.custom(
        (t) => (
          <NotificationToast
            notification={notification}
            onClose={() => {
              toast.dismiss(t);
              setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }}
          />
        ),
        {
          duration: 5000,
        }
      );
    };

    window.addEventListener('notification-received', handleNotificationReceived as EventListener);

    return () => {
      window.removeEventListener('notification-received', handleNotificationReceived as EventListener);
    };
  }, []);

  return { notifications };
}; 