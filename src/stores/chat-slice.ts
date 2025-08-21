// store/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '@/services/inventory-item/typings';

export interface ChatState {
  conversations: API.ChatConversation[];
  messages: API.ChatHistoryDetail[];
  selectedConversation: string;
  searchQuery: string;
  messageInput: string;
  showInventory: boolean;
  inventoryItems: InventoryItem[];
  selectedImage: File | null;
  imagePreview: string | null;
  totalUnreadCount: number;
  loading: {
    conversations: boolean;
    messages: boolean;
    inventory: boolean;
  };
  fetched: {
    conversations: boolean;
    inventory: boolean;
    chatHistory: Record<string, boolean>;
  };
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  selectedConversation: '',
  searchQuery: '',
  messageInput: '',
  showInventory: false,
  inventoryItems: [],
  selectedImage: null,
  imagePreview: null,
  totalUnreadCount: 0,
  loading: {
    conversations: false,
    messages: false,
    inventory: false,
  },
  fetched: {
    conversations: false,
    inventory: false,
    chatHistory: {},
  },
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Conversations
    setConversations: (state, action: PayloadAction<API.ChatConversation[]>) => {
      state.conversations = action.payload;
      state.fetched.conversations = true;
    },
    
    updateConversation: (state, action: PayloadAction<Partial<API.ChatConversation> & { otherUserId: string }>) => {
      const index = state.conversations.findIndex(conv => conv.otherUserId === action.payload.otherUserId);
      if (index !== -1) {
        state.conversations[index] = { ...state.conversations[index], ...action.payload };
      }
    },
    
    addConversation: (state, action: PayloadAction<API.ChatConversation>) => {
      state.conversations.unshift(action.payload);
    },

    updateConversationOnlineStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      const conversation = state.conversations.find(conv => conv.otherUserId === action.payload.userId);
      if (conversation) {
        conversation.isOnline = action.payload.isOnline;
      }
    },

    // Messages
    setMessages: (state, action: PayloadAction<API.ChatHistoryDetail[]>) => {
      state.messages = action.payload;
    },
    
    addMessage: (state, action: PayloadAction<API.ChatHistoryDetail>) => {
      const isDuplicate = state.messages.some(msg =>
        msg.id === action.payload.id ||
        (msg.content === action.payload.content &&
         msg.sentAt === action.payload.sentAt &&
         msg.senderId === action.payload.senderId)
      );
      if (!isDuplicate) {
        state.messages.push(action.payload);
      }
    },
    
    clearMessages: (state) => {
      state.messages = [];
    },

    // UI State
    setSelectedConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversation = action.payload;
      if (action.payload && !state.fetched.chatHistory[action.payload]) {
        state.messages = [];
      }
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setMessageInput: (state, action: PayloadAction<string>) => {
      state.messageInput = action.payload;
    },
    
    setShowInventory: (state, action: PayloadAction<boolean>) => {
      state.showInventory = action.payload;
    },

    // Image handling
    setSelectedImage: (state, action: PayloadAction<{ file: File | null; preview: string | null }>) => {
      state.selectedImage = action.payload.file;
      state.imagePreview = action.payload.preview;
    },

    // Inventory
    setInventoryItems: (state, action: PayloadAction<InventoryItem[]>) => {
      state.inventoryItems = action.payload;
      state.fetched.inventory = true;
    },

    // Unread count
    setTotalUnreadCount: (state, action: PayloadAction<number>) => {
      state.totalUnreadCount = action.payload;
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(conv => conv.otherUserId === action.payload);
      if (conversation) {
        state.totalUnreadCount = Math.max(0, state.totalUnreadCount - conversation.unreadCount);
        conversation.unreadCount = 0;
      }
    },

    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(conv => conv.otherUserId === action.payload);
      if (conversation) {
        conversation.unreadCount += 1;
        state.totalUnreadCount += 1;
      }
    },

    // Loading states
    setLoading: (state, action: PayloadAction<{ type: keyof ChatState['loading']; loading: boolean }>) => {
      state.loading[action.payload.type] = action.payload.loading;
    },
    
    // Fetched states
    setChatHistoryFetched: (state, action: PayloadAction<{ conversationId: string; fetched: boolean }>) => {
      state.fetched.chatHistory[action.payload.conversationId] = action.payload.fetched;
    },

    setConversationsFetched: (state, action: PayloadAction<boolean>) => {
      state.fetched.conversations = action.payload;
    },

    setInventoryFetched: (state, action: PayloadAction<boolean>) => {
      state.fetched.inventory = action.payload;
    },

    // Reset state
    resetChatState: () => initialState,
  },
});

export const {
  // Conversations
  setConversations,
  updateConversation,
  addConversation,
  updateConversationOnlineStatus,
  
  // Messages
  setMessages,
  addMessage,
  clearMessages,
  
  // UI State
  setSelectedConversation,
  setSearchQuery,
  setMessageInput,
  setShowInventory,
  
  // Image
  setSelectedImage,
  
  // Inventory
  setInventoryItems,
  
  // Unread
  setTotalUnreadCount,
  markAsRead,
  incrementUnreadCount,
  
  // Loading
  setLoading,
  
  // Fetched
  setChatHistoryFetched,
  setConversationsFetched,
  setInventoryFetched,
  
  // Reset
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;