"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SendHorizontal, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { closeMessageUser } from "@/stores/difference-slice";
import ReactMarkdown from 'react-markdown';
import useAiChat from "@/hooks/chat/use-send-message-ai";

// Typing indicator component similar to ChatArea
const TypingIndicator = () => {
  return (
    <div className="py-2 flex gap-x-3 items-start justify-start">
      <figure className="flex-shrink-0 rounded-full overflow-hidden w-10 h-10 border border-gray-300">
        <img
          src="/images/ai-bot.png"
          width={100}
          height={100}
          alt="avatar"
        />
      </figure>
      <div className="w-max flex items-center px-4 py-3 min-h-8 rounded-xl bg-slate-200">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default function Message({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const differenceState = useAppSelector((state) => state.differenceSlice);
  const userState = useAppSelector((state) => state.userSlice);
  const [textMessage, setTextMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ SenderId: string; Content: string }[]>([]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use AI chat hook
  const { sendMessageToAi, message, isConnected } = useAiChat();

  const handleCloseMessage = () => {
    dispatch(closeMessageUser());
    setMessages([]);
    setTextMessage("");
    setIsAiTyping(false);
  };

  // Listen for incoming messages from SignalR
  useEffect(() => {
    if (message) {
      if (message.senderId === "AI") {
        // Show typing indicator first, then show AI message after delay
        setIsAiTyping(true);
        
        // Simulate typing delay (1-2 seconds based on message length)
        const typingDelay = Math.min(Math.max(message.content.length * 20, 1000), 2000);
        
        setTimeout(() => {
          setIsAiTyping(false);
          setMessages((prev) => [...prev, { 
            SenderId: "bot", 
            Content: message.content 
          }]);
        }, typingDelay);
      }
      // Remove handling for user messages from SignalR since we add them immediately
    }
  }, [message]);

  const handleSendMessageChatBot = async (message: string) => {
    if (!message.trim()) return;

    // Immediately add user message to UI for better UX
    setMessages((prev) => [...prev, { 
      SenderId: "user", 
      Content: message 
    }]);

    // Send to AI via SignalR
    try {
      if (!isConnected) {
        throw new Error("Chưa kết nối tới server");
      }
      
      // Don't await this - let it run in background
      sendMessageToAi(message).catch((error) => {
        console.error("Lỗi khi gửi tin nhắn tới AI:", error);
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          { SenderId: "bot", Content: "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau." },
        ]);
      });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn tới AI:", error);
      setIsAiTyping(false);
      setMessages((prev) => [
        ...prev,
        { SenderId: "bot", Content: "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau." },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (textMessage.trim() === "") {
      return; // Remove alert for better UX
    }

    const messageToSend = textMessage;
    setTextMessage(""); // Clear input immediately
    
    // Send message without awaiting
    handleSendMessageChatBot(messageToSend);
  };

  const messageYourBox = (
    item: { SenderId: string; Content: string; id?: string },
    isLastInGroup: boolean,
    isFirstInGroup: boolean,
    key: string | number
  ) => {
    const isCurrentUserMessage = item.SenderId === "user";

    return (
      <div
        key={key}
        className={`py-2 flex gap-x-3 items-start ${isCurrentUserMessage ? "justify-end" : "justify-start"
          }`}
      >
        {isFirstInGroup && !isCurrentUserMessage ? (
          <figure className="flex-shrink-0 rounded-full overflow-hidden w-10 h-10 border border-gray-300">
            <img
              src="/images/ai-bot.png"
              width={100}
              height={100}
              alt="avatar"
            />
          </figure>
        ) : (
          <figure className="flex-shrink-0 rounded-full overflow-hidden w-10 h-10 opacity-0 border border-gray-300">
            <img
              src="/images/ai-bot.png"
              width={100}
              height={100}
              alt="avatar"
            />
          </figure>
        )}
        <div
          className={`w-max flex items-center px-2 py-1 min-h-8 rounded-xl max-w-[80%] ${isCurrentUserMessage ? "bg-blue-200" : "bg-slate-200"
            }`}
          style={{
            wordBreak: "normal", 
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap", 
            lineHeight: "1.5",
            display: "inline",
          }}
        >
          <ReactMarkdown
            allowedElements={["strong", "p", "br", "ul", "ol", "li", "h2"]} 
            components={{
              p: ({ node, ...props }) => <p className="text-[14px] font-sans leading-relaxed" {...props} />, 
              strong: ({ node, ...props }) => <strong className="font-bold inline" {...props} />,
              br: () => <br />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-4 text-[14px] font-sans leading-relaxed" {...props} />, 
              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 text-[14px] font-sans leading-relaxed" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1 text-[14px] font-sans leading-relaxed" {...props} />, 
              h2: ({ node, ...props }) => <h2 className="text-[16px] font-semibold mt-4 text-gray-800" {...props} />, 
            }}
          >
            {item.Content || "No content available"}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  const renderMessages = (messages: { SenderId: string; Content: string; id?: string }[]) => {
    return messages.map((message, index) => {
      const isFirstInGroup =
        index === 0 || messages[index - 1].SenderId !== message.SenderId;

      return messageYourBox(message, false, isFirstInGroup, `${message.SenderId}-${index}`);
    });
  };

  const handleClickFirstMessageBot = (message: string) => {
    handleSendMessageChatBot(message);
  };

  // Auto scroll to bottom when new messages or typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isAiTyping]);

  return (
    <div>
      {differenceState.message.openMessageUser && (
        <div
          className="fixed bottom-0 right-0 md:bottom-5 md:right-5 z-50 w-full md:w-[30vw] h-[90vh] md:h-[75vh] flex items-end justify-end"
          aria-label="AI Chat Window"
        >
          <div className="w-full md:w-[30vw] h-full md:h-[75vh] bg-white rounded-t-lg md:rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            <header className="h-[10%] px-3 py-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <div className="select-none flex items-center px-2 py-1 rounded-lg" aria-label="Chat Header">
                <figure className="border w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center p-2 shadow-sm">
                  <div
                    style={{
                      borderRadius: "50%",
                      overflow: "hidden",
                      width: "40px",
                      height: "40px",
                    }}
                    className="flex items-center justify-between"
                  >
                    <img
                      src={"/images/ai-bot.png"}
                      width={40}
                      height={40}
                      alt="AI Bot avatar"
                    />
                  </div>
                </figure>
                <h4 className="text-base font-bold ml-2">AI Bot</h4>
                {isAiTyping && (
                  <span className="text-xs text-blue-600 ml-2 animate-pulse">đang soạn tin...</span>
                )}
                {!isConnected && (
                  <span className="text-xs text-red-500 ml-2">(Mất kết nối)</span>
                )}
              </div>
              <div>
                <button
                  onClick={handleCloseMessage}
                  type="button"
                  aria-label="Đóng chat"
                  className="py-2 px-2 rounded-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <span>
                    <X className="w-6 h-6" />
                  </span>
                </button>
              </div>
            </header>
            <main
              className="flex-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 bg-gradient-to-b from-white to-blue-50"
              tabIndex={0}
              aria-label="Chat messages"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* Group messages visually */}
              <div className="space-y-1">
                {renderMessages(messages)}
                {isAiTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </main>
            {/* Sticky input area for better UX */}
            <footer className="sticky bottom-0 px-2 pt-2 pb-3 bg-white border-t flex flex-col gap-y-2 shadow-md">
              <div className="relative flex items-center">
                <Input
                  placeholder="Nhập nội dung chat..."
                  type="text"
                  value={textMessage}
                  aria-label="Nhập tin nhắn"
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="border border-gray-400 rounded-3xl pr-14 py-4 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-700 text-[15px]"
                  disabled={!isConnected || isAiTyping}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!isConnected || !textMessage.trim() || isAiTyping}
                  aria-label="Gửi tin nhắn"
                  className={`absolute top-1/2 right-2 -translate-y-1/2 rounded-full py-2 px-2 bg-blue-600 transition-opacity duration-200 shadow-lg ${
                    textMessage !== "" && isConnected && !isAiTyping ? "opacity-100" : "opacity-30"
                  } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400`}
                >
                  <span>
                    <SendHorizontal className="text-white" />
                  </span>
                </button>
              </div>
              <h3 className="text-center text-[14px] text-gray-500 select-none">
                Thông tin do AI cung cấp chỉ mang tính tham khảo
              </h3>
            </footer>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}