import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/chat/api-path";

export const getConversation = async ({
    pageIndex,
    pageSize
} : REQUEST.GetChatConversation): Promise<TResponseData<API.ResponseChatConversation>> => {
  const response = await request<TResponseData<API.ResponseChatConversation>>(
    API_ENDPOINTS.CHAT_CONVERSATIONS,
    {
      method: "GET",
      params: {
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const getUnreadCount = async (): Promise<TResponseData<number>> => {
  const response = await request<TResponseData<number>>(
    API_ENDPOINTS.CHAT_UNREAD_COUNT,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getHistoryConversationDetail = async ({
  receiverId,
  pageIndex,
  pageSize
}: REQUEST.GetChatHistoryDetail): Promise<TResponseData<API.ResponseChatHistoryDetail>> => {
  const response = await request<TResponseData<API.ResponseChatHistoryDetail>>(
    API_ENDPOINTS.CHAT_HISTORY(receiverId),
    {
      method: "GET",
      params:{
        pageIndex,
        pageSize
      }
    }
  );
  return response.data;
};

export const markAsRead = async (fromUserId: string): Promise<TResponseData> => {
  const response = await request<TResponseData>(
    API_ENDPOINTS.MARK_AS_READ(fromUserId),
    {
      method: "POST",
    }
  );
  return response.data;
};

export const sendImage = async (
  data: REQUEST.SendImageToUser
): Promise<TResponseData> => {
  const formData = new FormData();
  formData.append("receiverId", data.receiverId);

  if (data.imageFile instanceof File) {
    formData.append("imageFile", data.imageFile);
  }

  const response = await request<TResponseData>(
    API_ENDPOINTS.SEND_IMAGE,
    {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const sendInventoryItem = async (
  data: REQUEST.SendInventoryItemToUser
): Promise<TResponseData> => {
  const formData = new FormData();
  formData.append("receiverId", data.receiverId);
  formData.append("inventoryItemId", data.inventoryItemId);
  formData.append("customMessage", data.customMessage != undefined ? data.customMessage : "");

  const response = await request<TResponseData>(
    API_ENDPOINTS.SEND_INVENTORY_ITEM,
    {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getNewConversation = async (receiverId: string): Promise<TResponseData<API.ChatConversation>> => {
  const response = await request<TResponseData<API.ChatConversation>>(
    API_ENDPOINTS.CHAT_NEW_CONVERSATIONS(receiverId),
    {
      method: "GET",
    }
  );
  return response.data;
};