import { Package } from "lucide-react";

interface ChatMessageProps {
  message: API.ChatHistoryDetail;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="space-y-2">
      {message.id === '2' && (
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {message.sentAt}
          </span>
        </div>
      )}

      <div className={`flex ${message.isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-xs">
          {message.productInfo ? (
            <div className={`${message.isCurrentUserSender ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3 animate-in slide-in-from-${message.isCurrentUserSender ? 'right' : 'left'}-2 duration-300`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {message.productInfo.imageUrl ? (
                    <img
                      src={message.productInfo.imageUrl}
                      alt={message.productInfo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{message.productInfo.name}</h4>
                  {/* <p className="text-xs mt-1 opacity-80">
                    {message.productInfo.price.toLocaleString('vi-VN')}đ
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    Số lượng: {message.productInfo.quantity}
                  </p> */}
                </div>
              </div>
            </div>
          ) : message.fileUrl ? (
            <div className={`${message.isCurrentUserSender ? 'bg-blue-500' : 'bg-gray-100'} rounded-lg p-2 animate-in slide-in-from-${message.isCurrentUserSender ? 'right' : 'left'}-2 duration-300`}>
              <img
                src={message.fileUrl}
                alt="Sent image"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '200px' }}
              />
            </div>
          ) : (
            <div className={`${message.isCurrentUserSender ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3 text-sm animate-in slide-in-from-${message.isCurrentUserSender ? 'right' : 'left'}-2 duration-300`}>
              {message.content}
            </div>
          )}
          <p className={`text-xs text-gray-500 mt-1 ${message.isCurrentUserSender ? 'text-right' : 'text-left'}`}>{message.sentAt}</p>
        </div>
      </div>
    </div>
  );
}
