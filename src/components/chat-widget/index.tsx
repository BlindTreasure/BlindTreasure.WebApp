'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useGetAllItemInventory from '@/app/(user)/inventory/hooks/useGetItemInventory';
import { InventoryItem } from '@/services/inventory-item/typings';
import { InventoryItemStatus } from '@/const/products';
import { TooltipProvider } from '../ui/tooltip';
import { IoChatbubblesOutline } from "react-icons/io5";
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';
import InventoryPanel from './components/InventoryPanel';
import MobileInventoryModal from './components/MobileInventoryModal';

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

interface ChatConversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
}

const mockConversations: ChatConversation[] = [
  {
    id: '1',
    name: 'Topick Global',
    lastMessage: 'THÔNG BÁO KHẨN...',
    timestamp: '25/07',
    unreadCount: 0,
    avatar: 'T',
    isOnline: false,
  },
  {
    id: '2',
    name: 'yoyohome',
    lastMessage: 'Khách hàng thân mến...',
    timestamp: '22/06',
    unreadCount: 0,
    avatar: 'Y',
    isOnline: true,
  },
  {
    id: '3',
    name: 'PADO Official',
    lastMessage: 'Đơn hàng của bạn đã ...',
    timestamp: '25/05',
    unreadCount: 0,
    avatar: 'P',
    isOnline: false,
  },
  {
    id: '4',
    name: 'UNIM FASHION ...',
    lastMessage: 'Cảm ơn BẠN Y...',
    timestamp: '28/04',
    unreadCount: 4,
    avatar: 'U',
    isOnline: false,
  },
  {
    id: '5',
    name: 'giadunglion',
    lastMessage: '[Video]',
    timestamp: '27/03',
    unreadCount: 3,
    avatar: 'G',
    isOnline: false,
  },
  {
    id: '6',
    name: 'LINCONT.STORE',
    lastMessage: 'AC vui lòng chờ gi...',
    timestamp: '14/03',
    unreadCount: 2,
    avatar: 'L',
    isOnline: false,
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Người bán đang trao đổi với bạn về đơn hàng này',
    timestamp: '17 Th06',
    isFromUser: false,
  },
  {
    id: '2',
    content: 'ID Đơn hàng: 250616MHNT0D5W\nTổng đơn hàng: đ64.000',
    timestamp: '17 Th06',
    isFromUser: false,
    orderId: '250616MHNT0D5W',
    orderTotal: 'đ64.000',
    orderStatus: 'Đã hoàn thành',
  },
  {
    id: '3',
    content: 'Gói hàng của bạn đang được giao và sẽ sớm đến nơi, vui lòng chú ý nhận hàng',
    timestamp: '08:41',
    isFromUser: false,
  },
  {
    id: '4',
    content: 'Bạn ơi, đơn hàng đã được ký nhận, bạn kiểm tra và đánh giá giúp shop nhé',
    timestamp: '08:41',
    isFromUser: false,
  },
];

const CustomerSellerChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string>('2');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showInventory, setShowInventory] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inventoryFetched, setInventoryFetched] = useState(false);
  const fetchingRef = useRef(false);

  const { getAllItemInventoryApi } = useGetAllItemInventory();

  useEffect(() => {
    const fetchInventory = async () => {
      if (fetchingRef.current || inventoryFetched) return; 

      fetchingRef.current = true;
      setInventoryLoading(true);

      try {
        const response = await getAllItemInventoryApi({
          pageIndex: 1,
          pageSize: 50,
        });

        const isSuccess = response && (response.success || response.isSuccess);
        const responseData = response?.data || response?.value;
        if (isSuccess && responseData) {
          const itemsArray = responseData.result || responseData.data?.result || responseData.data?.items || responseData.data || [];
          const availableItems = itemsArray.filter(
            (item: InventoryItem) => item.status === InventoryItemStatus.Available
          );

          setInventoryItems(availableItems);
          setInventoryFetched(true); 
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setInventoryLoading(false);
        fetchingRef.current = false;
      }
    };

    if (showInventory && !inventoryFetched) {
      fetchInventory();
    }
  }, [showInventory]); 

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: messageInput.trim(),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isFromUser: true
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendImage = () => {
    if (selectedImage && imagePreview) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Đã gửi một hình ảnh',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isFromUser: true,
        imageUrl: imagePreview
      };

      setMessages(prev => [...prev, newMessage]);
      setSelectedImage(null);
      setImagePreview(null);

      const fileInput = document.getElementById('image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSendProduct = (item: InventoryItem) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: 'Đã gửi một sản phẩm',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isFromUser: true,
      productInfo: {
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrls?.[0] || '',
        quantity: item.quantity
      }
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-green-500 hover:bg-opacity-80 text-white rounded-full w-auto px-4 h-12 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <IoChatbubblesOutline className="text-4xl" />
          <span className="text-lg font-medium">Chat</span>

          {totalUnread > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-[18px] h-5 px-1 rounded-full flex items-center justify-center animate-pulse">
              {totalUnread > 99 ? '99+' : totalUnread}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`bg-white rounded-lg shadow-2xl border h-[600px] flex overflow-hidden animate-in slide-in-from-bottom-4 max-w-[95vw] max-h-[95vh] transition-all duration-300 ${showInventory ? 'w-[1200px] md:max-w-[1200px]' : 'w-[800px] md:max-w-[800px]'
          }`}>
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            searchQuery={searchQuery}
            totalUnread={totalUnread}
            onSelectConversation={setSelectedConversation}
            onSearchChange={setSearchQuery}
            onClose={() => setIsOpen(false)}
          />

          <ChatArea
            selectedConversation={selectedConversation}
            messages={messages}
            messageInput={messageInput}
            imagePreview={imagePreview}
            showInventory={showInventory}
            onBackToList={() => setSelectedConversation('')}
            onClose={() => setIsOpen(false)}
            onMessageChange={setMessageInput}
            onSendMessage={handleSendMessage}
            onImageSelect={handleImageSelect}
            onSendImage={handleSendImage}
            onClearImage={handleClearImage}
            onToggleInventory={() => setShowInventory(!showInventory)}
          />

          {showInventory && (
            <InventoryPanel
              inventoryItems={inventoryItems}
              inventoryLoading={inventoryLoading}
              onSendProduct={handleSendProduct}
              onClose={() => setShowInventory(false)}
            />
          )}

          {showInventory && (
            <MobileInventoryModal
              inventoryItems={inventoryItems}
              inventoryLoading={inventoryLoading}
              onSendProduct={handleSendProduct}
              onClose={() => setShowInventory(false)}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CustomerSellerChat;
