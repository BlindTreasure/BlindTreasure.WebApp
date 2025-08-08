const CHAT = "/chat";
const CHAT_CONVERSATIONS = CHAT + "/conversations"
const CHAT_UNREAD_COUNT = CHAT + "/unread-count"
const CHAT_HISTORY = (receiverId : string) => `${CHAT}/history/${receiverId}`
const MARK_AS_READ = (fromUserId : string) => `${CHAT}/mark-as-read/${fromUserId}`
const SEND_IMAGE = CHAT + "/send-image"

export default {
    CHAT_CONVERSATIONS,
    CHAT_UNREAD_COUNT,
    CHAT_HISTORY,
    MARK_AS_READ,
    SEND_IMAGE
};
  