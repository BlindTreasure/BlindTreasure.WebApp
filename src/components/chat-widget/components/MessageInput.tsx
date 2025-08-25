import { Image, Package, Send, Loader2, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef, useCallback, useEffect } from "react";
import { useAppSelector } from '@/stores/store';

interface MessageInputProps {
  messageInput: string;
  imagePreview: string | null;
  showInventory: boolean;
  isSendingImage?: boolean;
  isConnected?: boolean;
  isChatWithSeller?: boolean;
  onMessageChange: (message: string) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendImage: () => void;
  onClearImage: () => void;
  onToggleInventory: () => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

export default function MessageInput({
  messageInput,
  imagePreview,
  showInventory,
  isSendingImage = false,
  isConnected = true,
  isChatWithSeller = false,
  onMessageChange,
  onKeyPress,
  onSendMessage,
  onImageSelect,
  onSendImage,
  onClearImage,
  onToggleInventory,
  onStartTyping,
  onStopTyping
}: MessageInputProps) {
  
  // Typing state management
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isCurrentlyTyping = useRef(false);
  const lastTypingTime = useRef<number>(0);

  const currentUserRole = useAppSelector(state => state.userSlice?.user?.roleName);
  const isSeller = currentUserRole == "Seller"

  // Cleanup typing on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isCurrentlyTyping.current && onStopTyping) {
        onStopTyping();
      }
    };
  }, [onStopTyping]);

  const handleSend = useCallback(() => {
    if (!isConnected) return;
    
    // Stop typing when sending message
    if (isCurrentlyTyping.current && onStopTyping) {
      onStopTyping();
      isCurrentlyTyping.current = false;
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (imagePreview) {
      onSendImage();
    } else {
      onSendMessage();
    }
  }, [isConnected, imagePreview, onSendImage, onSendMessage, onStopTyping]);

  const handleStartTypingDebounced = useCallback(() => {
    if (!isConnected || !onStartTyping || !onStopTyping) return;

    const now = Date.now();
    lastTypingTime.current = now;

    // Only start typing if not already typing
    if (!isCurrentlyTyping.current) {
      onStartTyping();
      isCurrentlyTyping.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isCurrentlyTyping.current && onStopTyping) {
        onStopTyping();
        isCurrentlyTyping.current = false;
      }
    }, 2000);
  }, [isConnected, onStartTyping, onStopTyping]);

  const handleInputChange = useCallback((value: string) => {
    // Update message first
    onMessageChange(value);
    
    // Handle typing indicators
    if (value.trim() && isConnected) {
      // User is typing
      handleStartTypingDebounced();
    } else if (!value.trim() && isCurrentlyTyping.current && onStopTyping) {
      // User cleared input, stop typing immediately
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onStopTyping();
      isCurrentlyTyping.current = false;
    }
  }, [onMessageChange, isConnected, handleStartTypingDebounced, onStopTyping]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // Call parent handler first if provided
    if (onKeyPress) {
      onKeyPress(event);
    }

    // Handle Enter key
    if (event.key === 'Enter' && !event.shiftKey && !isSendingImage && isConnected) {
      event.preventDefault();
      handleSend();
    }
    
    // Handle other keys for typing detection
    if (event.key !== 'Enter' && event.key !== 'Tab' && isConnected) {
      handleStartTypingDebounced();
    }
  }, [onKeyPress, isSendingImage, isConnected, handleSend, handleStartTypingDebounced]);

  const handleInputBlur = useCallback(() => {
    // Stop typing when input loses focus
    if (isCurrentlyTyping.current && onStopTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onStopTyping();
      isCurrentlyTyping.current = false;
    }
  }, [onStopTyping]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Định dạng file không được hỗ trợ. Vui lòng chọn ảnh (jpg, png, gif, webp).');
        return;
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Kích thước file không được vượt quá 10MB.');
        return;
      }

      onImageSelect(event);
    }
  };

  const isDisabled = isSendingImage || !isConnected;
  const canSend = (messageInput.trim() || imagePreview) && !isDisabled;

  return (
    <div className="p-4 border-t bg-white">
      {/* Connection status bar */}
      {!isConnected && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-600">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Mất kết nối - Không thể gửi tin nhắn</span>
          </div>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Ảnh đã chọn</p>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={onSendImage}
                  size="sm"
                  disabled={isDisabled}
                  className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi ảnh'
                  )}
                </Button>
                <Button
                  onClick={onClearImage}
                  size="sm"
                  variant="outline"
                  disabled={isSendingImage}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {/* Hidden file input */}
        <input
          id="image-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Image button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              disabled={isDisabled}
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <Image className={`w-4 h-4 ${isDisabled ? 'text-gray-300' : 'text-gray-500'}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{isConnected ? 'Gửi ảnh (tối đa 10MB)' : 'Không thể gửi ảnh - Mất kết nối'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Inventory/Product button - Ẩn nếu chat với seller */}
        {(!isChatWithSeller && !isSeller) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                disabled={isDisabled}
                onClick={onToggleInventory}
              >
                <Package className={`w-4 h-4 ${isDisabled ? 'text-gray-300' : 'text-gray-500'} ${showInventory ? 'text-blue-500' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isConnected ? 'Gửi sản phẩm' : 'Không thể gửi sản phẩm - Mất kết nối'}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            placeholder={isConnected ? "Nhập nội dung tin nhắn" : "Mất kết nối..."}
            value={messageInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleInputBlur}
            disabled={isDisabled}
            className="border-orange-200 focus:border-orange-400 focus:ring-orange-200 pr-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          {/* Connection indicator inside input */}
          {!isConnected && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <WifiOff className="w-4 h-4 text-red-400" />
            </div>
          )}
        </div>
        
        {/* Send button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSend}
              disabled={!canSend}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingImage && imagePreview ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isConnected ? (
                <Send className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>
              {!isConnected 
                ? 'Không thể gửi - Mất kết nối'
                : !canSend 
                  ? 'Nhập tin nhắn hoặc chọn ảnh để gửi' 
                  : 'Gửi tin nhắn (Enter)'
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}