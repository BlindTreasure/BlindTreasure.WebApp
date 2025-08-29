"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SendHorizontal, X } from "lucide-react";
import { getStorageItem } from "@/utils/local-storage";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { closeMessageUser } from "@/stores/difference-slice";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useAiChat from "@/hooks/chat/use-send-message-ai";

function TypingIndicator() {
  return (
    <div className="py-1 flex gap-x-2 items-end justify-start">
      <figure className="relative flex-shrink-0 w-8 h-8 border border-gray-200 rounded-full shadow-sm mb-1">
        <img
          src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?semt=ais_hybrid&w=740&q=80"
          width={32}
          height={32}
          alt="avatar"
          className="absolute inset-0 w-full h-full object-cover rounded-full p-1.5"
        />
      </figure>
      <div className="w-max flex items-center px-3 py-2 min-h-8 rounded-2xl rounded-bl-md bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex items-center gap-1">
          <span className="dot-wave" />
          <span className="dot-wave" style={{ animationDelay: "120ms" }} />
          <span className="dot-wave" style={{ animationDelay: "240ms" }} />
        </div>
      </div>
      <style jsx>{`
        .dot-wave {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #6b7280;
          display: inline-block;
          animation: wave 1.2s infinite ease-in-out both;
        }
        @keyframes wave {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.6;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dot-wave {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
const sanitizeContent = (raw?: string) => {
  if (!raw) return "";
  let s = raw.replace(/\r\n/g, "\n");

  s = s.replace(/\n\s*\*\s+/g, "\n* "); // Unordered lists
  s = s.replace(/\n\s*\d+\)\s+/g, "\n"); // Remove numbered list markers

  s = s.replace(/\n{3,}/g, "\n\n"); // Allow at most two consecutive newlines
  s = s.replace(/^\s+|\s+$/gm, ""); // Trim each line

  s = s.replace(/\*\*/g, "**"); // Bold markers
  s = s.replace(/\n\s+/g, "\n"); // Remove extra spaces after newlines

  return s.trim();
};

export default function Message({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const differenceState = useAppSelector((s) => s.differenceSlice);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState<
    { SenderId: string; Content: string }[]
  >([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { sendMessageToAi, message, isConnected } = useAiChat();

  const quickPromptsRef = useRef<HTMLDivElement | null>(null);

  const [isHovering, setIsHovering] = useState(false);

  const handleQuickPromptsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isHovering) return;

    if (e.shiftKey) return;

    const el = e.currentTarget;
    const isScrollable = el.scrollWidth > el.clientWidth;
    if (!isScrollable) return;

    const delta = e.deltaY;
    const scrollingRight = delta > 0;
    const scrollingLeft = delta < 0;

    const atLeft = el.scrollLeft <= 0;
    const atRight =
      Math.abs(el.scrollLeft + el.clientWidth - el.scrollWidth) < 1;

    if ((scrollingRight && atRight) || (scrollingLeft && atLeft)) {
      return;
    }

    e.preventDefault();
    const factor = 1;
    el.scrollLeft += delta * factor;
  };

  const handleCloseMessage = () => {
    dispatch(closeMessageUser());
    setMessages([]);
    setTextMessage("");
    setIsAiTyping(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  };

  const isNearBottom = () => {
    const el = scrollAreaRef.current;
    if (!el) return true;
    const diff = el.scrollHeight - el.scrollTop - el.clientHeight;
    return diff < 80;
  };

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const onScroll = () => {
      shouldAutoScrollRef.current = isNearBottom();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Incoming AI messages + typing indicator with safe timeout
  useEffect(() => {
    if (!message) return;
    if (message.senderId !== "AI") return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsAiTyping(true);

    const len = message.content?.length ?? 0;
    const typingDelay = Math.min(Math.max(len * 8, 600), 1200);

    typingTimerRef.current = setTimeout(() => {
      setIsAiTyping(false);
      setMessages((prev) => [
        ...prev,
        { SenderId: "bot", Content: sanitizeContent(message.content) },
      ]);
    }, typingDelay);

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [message]);

  useEffect(() => {
    if (shouldAutoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length, isAiTyping]);

  const handleSendMessageChatBot = async (msg: string) => {
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { SenderId: "user", Content: msg }]);

    try {
      if (!isConnected) {
        throw new Error("Chưa kết nối tới server");
      }
      // Fire-and-forget with proper error UI
      sendMessageToAi(msg).catch((error) => {
        console.error("Lỗi khi gửi tin nhắn tới AI:", error);
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            SenderId: "bot",
            Content:
              "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.",
          },
        ]);
      });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn tới AI:", error);
      setIsAiTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          SenderId: "bot",
          Content:
            "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.",
        },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!textMessage.trim()) return;
    const messageToSend = textMessage;
    setTextMessage("");
    handleSendMessageChatBot(messageToSend);
  };

  const Bubble = ({
    item,
    isFirstInGroup,
  }: {
    item: { SenderId: string; Content: string; id?: string };
    isFirstInGroup: boolean;
  }) => {
    const isUser = item.SenderId === "user";
    return (
      <div
        className={`py-1 flex gap-x-2 items-end ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {isFirstInGroup && !isUser ? (
          <figure className="relative flex-shrink-0 w-8 h-8 border border-gray-200 rounded-full shadow-sm mb-1">
            <img
              src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?semt=ais_hybrid&w=740&q=80"
              width={32}
              height={32}
              alt="avatar"
              className="absolute inset-0 w-full h-full object-cover rounded-full p-1.5"
            />
          </figure>
        ) : (
          <figure className="relative flex-shrink-0 w-8 h-8 opacity-0">
            <div className="w-8 h-8" />
          </figure>
        )}
        <div
          className={`message-bubble group w-max flex items-center px-3.5 py-2 min-h-8 max-w-[80%] hover:shadow-sm transition-shadow duration-200 ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto rounded-2xl rounded-br-md"
              : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 rounded-2xl rounded-bl-md"
          }`}
          style={{
            wordBreak: "normal",
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
            lineHeight: "1.5",
            display: "block", // <-- thay đổi ở đây để bảng render đúng
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown
            allowedElements={[
              "strong",
              "p",
              "br",
              "ul",
              "ol",
              "li",
              "h2",
              "table",
              "thead",
              "tbody",
              "tr",
              "th",
              "td",
              "code", // Allow inline code for order IDs
            ]}
            components={{
              p: (props) => (
                <p
                  className="text-[13px] font-sans leading-relaxed"
                  {...props}
                /> // Reduced font size
              ),
              strong: (props) => (
                <strong className="font-bold inline" {...props} />
              ),
              br: () => <br />,
              ul: (props) => (
                <ul
                  className="list-disc pl-4 text-[13px] font-sans leading-relaxed" // Reduced font size
                  {...props}
                />
              ),
              ol: (props) => (
                <ol
                  className="list-decimal pl-4 text-[13px] font-sans leading-relaxed" // Reduced font size
                  {...props}
                />
              ),
              li: (props) => (
                <li
                  className="mb-1 text-[13px] font-sans leading-relaxed" // Reduced font size
                  {...props}
                />
              ),
              h2: (props) => (
                <h2
                  className="text-[15px] font-semibold mt-4 text-gray-800" // Reduced font size
                  {...props}
                />
              ),
              table: (props) => (
                <div className="overflow-x-auto my-2">
                  <table
                    className="min-w-[90%] table-auto text-[13px] font-sans" // Increased table width and reduced font size
                    {...props}
                  />
                </div>
              ),
              thead: (props) => (
                <thead
                  className="bg-gray-50 text-[12px] text-gray-700" // Reduced font size
                  {...props}
                />
              ),
              tbody: (props) => <tbody {...props} />,
              tr: (props) => (
                <tr className="odd:bg-white even:bg-gray-50" {...props} />
              ),
              th: (props) => (
                <th
                  className="px-3 py-2 text-left text-[12px] font-medium" // Reduced font size
                  {...props}
                />
              ),
              td: (props) => (
                <td
                  className="px-3 py-2 text-[12px] leading-relaxed" // Reduced font size
                  {...props}
                />
              ),
              code: (props) => (
                <code
                  className="bg-gray-100 text-[12px] font-mono px-1 rounded"
                  {...props}
                /> // Reduced font size
              ),
            }}
          >
            {item.Content || "No content available"}
          </ReactMarkdown>
        </div>
        <style jsx>{`
          .message-bubble {
            animation: bubble-in 160ms ease-out;
          }
          @keyframes bubble-in {
            from {
              transform: translateY(4px) scale(0.98);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .message-bubble {
              animation: none;
            }
          }
        `}</style>
      </div>
    );
  };

  const renderMessages = (
    items: { SenderId: string; Content: string; id?: string }[]
  ) =>
    items.map((m, i) => {
      const isFirstInGroup = i === 0 || items[i - 1].SenderId !== m.SenderId;
      return (
        <Bubble
          key={`${m.SenderId}-${i}`}
          item={m}
          isFirstInGroup={isFirstInGroup}
        />
      );
    });

  const handleQuickPrompt = async (msg: string) => {
    if (msg === "Kiểm tra tình trạng đơn hàng của tôi") {
      // Push message và set typing state
      setMessages((prev) => [...prev, { SenderId: "user", Content: msg }]);
      console.log(">>> Gọi API my-orders-status (prod), KHÔNG SignalR");

      try {
        setIsAiTyping(true);
        const res = await fetch(
          "https://blindtreasureapi.fpt-devteam.fun/api/blindy/my-orders-status",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${getStorageItem("accessToken")}`,
            },
          }
        );
        const apiRes = await res.json();

        setIsAiTyping(false);

        if (apiRes?.isSuccess && apiRes?.value?.data) {
          setMessages((prev) => [
            ...prev,
            { SenderId: "bot", Content: apiRes.value.data },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              SenderId: "bot",
              Content:
                "Không thể lấy tình trạng đơn hàng. Vui lòng thử lại sau.",
            },
          ]);
        }
      } catch (err) {
        console.error("Lỗi gọi API my-orders-status:", err);
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            SenderId: "bot",
            Content: "Có lỗi xảy ra khi lấy tình trạng đơn hàng.",
          },
        ]);
      }

      return;
    }

    handleSendMessageChatBot(msg);
  };

  const quickPrompts: string[] = Array.from(
    new Set([
      "Hướng dẫn cách mua BlindBox",
      "Kiểm tra tình trạng đơn hàng của tôi",
      "Làm sao để đăng sản phẩm lên Marketplace?",
      "Tôi muốn biết chính sách khuyến mãi hiện tại",
    ])
  );

  const isOpen = differenceState.message.openMessageUser;

  return (
    <div>
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 md:bottom-5 md:right-5 z-50 w-full md:w-[30vw] h-[90vh] md:h-[75vh] flex items-end justify-end"
          aria-label="AI Chat Window"
        >
          <div
            className="chat-shell w-full md:w-[30vw] h-full md:h-[75vh] bg-white rounded-t-lg md:rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            data-state={isOpen ? "open" : "closed"}
          >
            <header className="h-[10%] px-3 py-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <div
                className="select-none flex items-center px-2 py-1 rounded-lg"
                aria-label="Chat Header"
              >
                <figure className="relative border w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  <img
                    src={
                      "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    width={40}
                    height={40}
                    alt="AI Bot avatar"
                    className="absolute inset-0 w-full h-full object-cover rounded-full p-2"
                  />
                </figure>
                <h4 className="text-base font-bold ml-2">Blindy AI</h4>
                {isAiTyping && (
                  <span className="text-xs text-blue-600 ml-2 animate-pulse">
                    đang soạn tin...
                  </span>
                )}
                {!isConnected && (
                  <span className="text-xs text-red-500 ml-2">
                    (Mất kết nối)
                  </span>
                )}
              </div>
              <div>
                <button
                  onClick={handleCloseMessage}
                  type="button"
                  aria-label="Đóng chat"
                  className="py-2 px-2 rounded-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-[0.98] transition"
                >
                  <span>
                    <X className="w-6 h-6" />
                  </span>
                </button>
              </div>
            </header>

            <main
              ref={scrollAreaRef}
              className="flex-1 px-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 bg-gradient-to-b from-white to-blue-50"
              tabIndex={0}
              aria-label="Chat messages"
              style={{
                scrollBehavior: "smooth",
                scrollbarGutter: "stable", 
              }}
            >
              <div className="space-y-0.5 pt-2">
                {renderMessages(messages)}
                {isAiTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </main>

            {/* Quick prompts: horizontal scroll, compact buttons */}
            <div className="relative px-2 bg-white border-t border-b isolate">
              {/* Gradient overlays for scroll indication */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

              <div
                ref={quickPromptsRef}
                onWheel={handleQuickPromptsWheel}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="flex gap-2 overflow-x-auto py-2 px-2 scroll-smooth no-scrollbar hover:cursor-ew-resize touch-pan-x"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  overscrollBehaviorY: "contain",
                  overscrollBehaviorX: "contain",
                }}
              >
                <div className="flex gap-2 px-6 min-w-max">
                  {quickPrompts.map((sample, i) => (
                    <button
                      key={sample}
                      onClick={() => handleQuickPrompt(sample)}
                      disabled={isAiTyping || !isConnected}
                      className={`shrink-0 px-3 py-1 whitespace-nowrap font-medium bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 active:scale-[0.98] text-xs rounded-xl text-blue-800 transition-all duration-200 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-100 ${
                        isAiTyping || !isConnected
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      style={{ height: "32px" }}
                    >
                      {isAiTyping && quickPrompts[i] === sample ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="animate-spin w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                          Đang xử lý...
                        </span>
                      ) : (
                        sample
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <footer className="sticky bottom-0 px-2 pt-2 pb-3 bg-white border-t flex flex-col gap-y-2 shadow-md">
              <div className="relative flex items-center">
                <Input
                  placeholder={
                    isConnected
                      ? "Nhập nội dung chat..."
                      : "Mất kết nối — vui lòng thử lại"
                  }
                  type="text"
                  value={textMessage}
                  aria-label="Nhập tin nhắn"
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="border border-gray-400 rounded-3xl pr-14 py-4 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-700 text-[15px]"
                  disabled={!isConnected}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!isConnected || !textMessage.trim()}
                  aria-label="Gửi tin nhắn"
                  className={`absolute top-1/2 right-2 -translate-y-1/2 rounded-full py-2 px-2 bg-blue-600 transition-all duration-150 shadow-lg ${
                    textMessage !== "" && isConnected
                      ? "opacity-100 scale-100"
                      : "opacity-30 scale-95"
                  } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95`}
                >
                  <span>
                    <SendHorizontal className="text-white" />
                  </span>
                </button>
              </div>
              <h3 className="text-center text-[13px] text-gray-500 select-none">
                Thông tin do AI cung cấp chỉ mang tính tham khảo
              </h3>
            </footer>
          </div>
        </div>
      )}

      <main>{children}</main>

      <style jsx>{`
        .chat-shell {
          transform: translateY(8px);
          opacity: 0;
          transition: transform 180ms ease-out, opacity 180ms ease-out;
        }
        .chat-shell[data-state="open"] {
          transform: translateY(0);
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-shell {
            transition: none;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
