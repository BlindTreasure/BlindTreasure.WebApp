import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

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

interface ChatAreaProps {
  selectedConversation: string;
  messages: ChatMessage[];
  messageInput: string;
  imagePreview: string | null;
  showInventory: boolean;
  onBackToList: () => void;
  onClose: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendImage: () => void;
  onClearImage: () => void;
  onToggleInventory: () => void;
}

export default function ChatArea({
  selectedConversation,
  messages,
  messageInput,
  imagePreview,
  showInventory,
  onBackToList,
  onClose,
  onMessageChange,
  onSendMessage,
  onImageSelect,
  onSendImage,
  onClearImage,
  onToggleInventory
}: ChatAreaProps) {
  return (
    <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToList}
              className="md:hidden p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              Y
            </div>
            <div>
              <h4 className="font-medium">yoyohome</h4>
              <p className="text-xs text-gray-500">Đang hoạt động</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hidden md:flex p-1 h-auto rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Tin nhắn chưa đọc
          </span>
        </div>

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        <div className="text-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            22 Th06
          </span>
        </div>
      </div>

      <MessageInput
        messageInput={messageInput}
        imagePreview={imagePreview}
        showInventory={showInventory}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onImageSelect={onImageSelect}
        onSendImage={onSendImage}
        onClearImage={onClearImage}
        onToggleInventory={onToggleInventory}
      />
    </div>
  );
}
