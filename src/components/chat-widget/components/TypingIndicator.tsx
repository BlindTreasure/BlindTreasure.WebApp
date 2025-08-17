import React from 'react';

interface TypingIndicatorProps {
  userName?: string;
  userAvatar?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  userName = "Người dùng", 
  userAvatar 
}) => {
  return (
    <div className="flex justify-start mb-2">
      <div className="flex items-end gap-2 max-w-[70%] flex-row">
        {/* Avatar */}
        <div className="relative w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0 overflow-hidden">
          {userAvatar && userAvatar.startsWith('http') ? (
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span>{userName.charAt(0).toUpperCase()}</span>
          )}
          {/* Online dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
        </div>

        {/* Typing bubble */}
        <div className="relative px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-sm">
          <div className="flex items-center gap-1">
            {/* Animated dots */}
            <div className="flex gap-1">
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
              />
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '160ms', animationDuration: '1.4s' }}
              />
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '320ms', animationDuration: '1.4s' }}
              />
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="text-xs mt-1 opacity-70 flex items-center gap-1 justify-start">
            <span>
              {new Date().toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;