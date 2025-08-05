import { Package } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
  orderId?: string;
  orderTotal?: string;
  orderStatus?: string;
  imageUrl?: string;
  productInfo?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  };
}

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="space-y-2">
      {message.id === '2' && (
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {message.timestamp}
          </span>
        </div>
      )}

      <div className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-xs">
          {message.orderId ? (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-3 animate-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg flex items-center justify-center text-sm">
                  📦
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">ID Đơn hàng: {message.orderId}</p>
                  <p className="text-sm text-gray-600">Tổng đơn hàng: {message.orderTotal}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {message.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          ) : message.productInfo ? (
            <div className={`${message.isFromUser ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3 animate-in slide-in-from-${message.isFromUser ? 'right' : 'left'}-2 duration-300`}>
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
                  <p className="text-xs mt-1 opacity-80">
                    {message.productInfo.price.toLocaleString('vi-VN')}đ
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    Số lượng: {message.productInfo.quantity}
                  </p>
                </div>
              </div>
            </div>
          ) : message.imageUrl ? (
            <div className={`${message.isFromUser ? 'bg-blue-500' : 'bg-gray-100'} rounded-lg p-2 animate-in slide-in-from-${message.isFromUser ? 'right' : 'left'}-2 duration-300`}>
              <img
                src={message.imageUrl}
                alt="Sent image"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '200px' }}
              />
            </div>
          ) : (
            <div className={`${message.isFromUser ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3 text-sm animate-in slide-in-from-${message.isFromUser ? 'right' : 'left'}-2 duration-300`}>
              {message.content}
            </div>
          )}
          <p className={`text-xs text-gray-500 mt-1 ${message.isFromUser ? 'text-right' : 'text-left'}`}>{message.timestamp}</p>
        </div>
      </div>
    </div>
  );
}
