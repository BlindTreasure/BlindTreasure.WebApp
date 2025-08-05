import { useState } from "react";
import { Image, Package, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageInputProps {
  messageInput: string;
  imagePreview: string | null;
  showInventory: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendImage: () => void;
  onClearImage: () => void;
  onToggleInventory: () => void;
}

export default function MessageInput({
  messageInput,
  imagePreview,
  showInventory,
  onMessageChange,
  onSendMessage,
  onImageSelect,
  onSendImage,
  onClearImage,
  onToggleInventory
}: MessageInputProps) {
  const handleSend = () => {
    if (imagePreview) {
      onSendImage();
    } else {
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-white">
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
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Gửi ảnh
                </Button>
                <Button
                  onClick={onClearImage}
                  size="sm"
                  variant="outline"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={onImageSelect}
          className="hidden"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <Image className="w-4 h-4 text-gray-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Gửi ảnh</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={onToggleInventory}
            >
              <Package className="w-4 h-4 text-gray-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Gửi sản phẩm</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="flex-1 relative">
          <Input
            placeholder="Nhập nội dung tin nhắn"
            value={messageInput}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="border-orange-200 focus:border-orange-400 focus:ring-orange-200 pr-10"
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!messageInput.trim() && !imagePreview}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
