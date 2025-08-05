import React, { useState, useRef, useEffect } from 'react';
import { PiBellSimpleLight } from 'react-icons/pi';
import { useNotification } from '@/hooks/use-notification';
import NotificationDropdown from './notification-dropdown';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const { unreadCount } = useNotification();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <PiBellSimpleLight className="text-2xl cursor-pointer" onClick={toggleDropdown} />
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {isDropdownOpen && (
        <NotificationDropdown onClose={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
}; 