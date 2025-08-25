"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SendHorizontal, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { closeMessageUser } from "@/stores/difference-slice";
import ReactMarkdown from 'react-markdown';
import useAiChat from "@/hooks/chat/use-send-message-ai";

export default function Message({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const differenceState = useAppSelector((state) => state.differenceSlice);
  const userState = useAppSelector((state) => state.userSlice);
  const [textMessage, setTextMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ SenderId: string; Content: string }[]>([]);
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use AI chat hook
  const { sendMessageToAi, message, isConnected } = useAiChat();

  const handleCloseMessage = () => {
    dispatch(closeMessageUser());
    setMessages([]);
    setTextMessage("");
  };

  // Listen for incoming messages from SignalR
  useEffect(() => {
    if (message) {
      // Add all messages from SignalR to the chat
      if (message.senderId === "AI") {
        setMessages((prev) => [...prev, { 
          SenderId: "bot", 
          Content: message.content 
        }]);
      } else {
        // User message from SignalR
        setMessages((prev) => [...prev, { 
          SenderId: "user", 
          Content: message.content 
        }]);
      }
    }
  }, [message]);

  const handleSendMessageChatBot = async (message: string) => {
    if (!message.trim()) return;

    // Send to AI via SignalR
    // Don't add user message here - it will come from SignalR
    try {
      if (!isConnected) {
        throw new Error("Chưa kết nối tới server");
      }
      
      await sendMessageToAi(message);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn tới AI:", error);
      setMessages((prev) => [
        ...prev,
        { SenderId: "user", Content: message },
        { SenderId: "bot", Content: "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau." },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (textMessage.trim() === "") {
      alert("Please enter a message");
      return;
    }

    await handleSendMessageChatBot(textMessage);
    setTextMessage("");
  };

  const messageYourBox = (
    item: { SenderId: string; Content: string },
    isLastInGroup: boolean,
    isFirstInGroup: boolean,
    index: number
  ) => {
    const isCurrentUserMessage = item.SenderId === "user";

    return (
      <div
        key={index}
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

  const renderMessages = (messages: { SenderId: string; Content: string }[]) => {
    return messages.map((message, index) => {
      const isFirstInGroup =
        index === 0 || messages[index - 1].SenderId !== message.SenderId;

      return messageYourBox(message, false, isFirstInGroup, index);
    });
  };

  const handleClickFirstMessageBot = (message: string) => {
    handleSendMessageChatBot(message);
  };

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      {differenceState.message.openMessageUser && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="w-[30vw] h-[75vh] bg-white rounded-lg shadow-box-shadown flex flex-col overflow-hidden">
            <header className="h-[10%] px-3 py-5 border-b flex justify-between items-center">
              <div className="select-none flex items-center px-2 py-1 rounded-lg">
                <figure className="border w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center p-2">
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
                      width={170}
                      height={170}
                      alt="avatar"
                    />
                  </div>
                </figure>
                <h4 className="text-base font-bold ml-2">AI Bot</h4>
              </div>
              <div>
                <button
                  onClick={handleCloseMessage}
                  type="button"
                  className="py-2 px-2 rounded-sm hover:bg-gray-300"
                >
                  <span>
                    <X className="w-6 h-6" />
                  </span>
                </button>
              </div>
            </header>
            <main className="h-[80%] px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {renderMessages(messages)}
              <div ref={messagesEndRef} />
            </main>
            <footer className="h-[25%] px-2 pt-4 flex flex-col gap-y-2 border">
              <div className="relative">
                <Input
                  placeholder="Enter the chat content"
                  type="text"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="border border-gray-400 rounded-3xl pr-14 py-6 focus-visible:ring-0 focus-visible:border-gray-700"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!isConnected || !textMessage.trim()}
                  className={`absolute top-1/2 right-2 -translate-y-1/2 rounded-full py-2 px-2 bg-blue-600 ${
                    textMessage !== "" && isConnected ? "opacity-1" : "opacity-30"
                  } disabled:cursor-not-allowed`}
                >
                  <span>
                    <SendHorizontal className="text-white" />
                  </span>
                </button>
              </div>
              <h3 className="text-center text-[15px]">
                AI-generated information is for reference only {!isConnected ? "(Disconnected)" : ""}
              </h3>
            </footer>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}