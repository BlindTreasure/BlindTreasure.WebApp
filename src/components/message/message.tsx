"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, SendHorizontal, X } from "lucide-react";
import TippyHeadless from "@tippyjs/react/headless";
import stringSimilarity from "string-similarity";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { closeMessageUser } from "@/stores/difference-slice";
import ReactMarkdown from 'react-markdown';
import { sampleQuestions } from "@/const/user";

export default function Message({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [receive, setReceive] = useState<boolean>(false);
  const differenceState = useAppSelector((state) => state.differenceSlice);
  const userState = useAppSelector((state) => state.userSlice);
  const [switchChat, setSwitchChat] = useState<boolean>(false);
  const [textMessage, setTextMessage] = useState<string>("");
  const [messagesBot, setMessagesBot] = useState<{ SenderId: string; Content: string }[]>([]);
  const [messagesStaff, setMessagesStaff] = useState<{ SenderId: string; Content: string }[]>([]);
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const handleCloseMessage = () => {
    dispatch(closeMessageUser());
    setMessagesBot([]);
    setMessagesStaff([]);
    setTextMessage("");
  };

  const handleSendMessageChatBot = async (message: string) => {
    if (!message.trim()) return;

    setMessagesBot((prev) => [...prev, { SenderId: "user", Content: message }]);

    const questions = sampleQuestions.map(q => q.question);
    const matches = stringSimilarity.findBestMatch(message.toLowerCase(), questions);
    const bestMatch = matches.bestMatch;

    if (bestMatch.rating > 0.4) {
      const matchedQuestion = sampleQuestions.find(q => q.question === bestMatch.target);
      if (matchedQuestion) {
        setMessagesBot((prev) => [...prev, { SenderId: "bot", Content: matchedQuestion.answer }]);
        return;
      }
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${data.error?.message || "Không rõ lỗi"}`);
      }

      setMessagesBot((prev) => [
        ...prev,
        { SenderId: "bot", Content: data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi" },
      ]);
    } catch (error) {
      console.error("Lỗi khi gọi API Gemini:", error);
      setMessagesBot((prev) => [
        ...prev,
        { SenderId: "bot", Content: "Xin lỗi, tôi không thể trả lời ngay bây giờ." },
      ]);
    }

    setTextMessage("");
  };

  const handleSendMessageChatStaff = async () => {
    setMessagesStaff((prev) => [
      ...prev,
      {
        SenderId: "user",
        Content: textMessage,
      },
    ]);

    setTextMessage("");
  };

  const handleSendMessage = async () => {
    if (textMessage.trim() === "") {
      alert("Please enter a message");
      return;
    }

    if (receive === false) await handleSendMessageChatBot(textMessage);
    if (receive === true) await handleSendMessageChatStaff();

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
              src={`/images/${receive === false ? "ai-bot.png" : "employee-chat.png"
                }`}
              width={100}
              height={100}
              alt="avatar"
            />
          </figure>
        ) : (
          <figure className="flex-shrink-0 rounded-full overflow-hidden w-10 h-10 opacity-0 border border-gray-300">
            <img
              src={`/images/${receive === false ? "ai-bot.png" : "employee-chat.png"
                }`}
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

  const handleToggleSwitchat = () => {
    setSwitchChat((prev) => !prev);
  };

  const handleCloseSwitchat = () => {
    setSwitchChat(false);
  };

  const handleChangeReceive = (status: boolean) => {
    setReceive(status);
    handleCloseSwitchat();
  };

  const handleClickFirstMessageBot = (message: string) => {
    handleSendMessageChatBot(message);
  };

  const renderListFirstMessageBot = () => {
    return (
      <div className="py-2">
        <div className="inline-block min-w-1/2 min-h-[100px] shadow-box-shadown rounded-lg overflow-hidden">
          {sampleQuestions?.map((item, index) => {
            return (
              <div
                key={index}
                className="py-2 px-4 border-b-2 hover:bg-[#0000001a] cursor-pointer"
                onClick={() => handleClickFirstMessageBot(item.question)}
              >
                <span className="text-base font-sans font-normal">
                  {item.question}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesBot, messagesStaff]);

  return (
    <div>
      {differenceState.message.openMessageUser && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="w-[30vw] h-[75vh] bg-white rounded-lg shadow-box-shadown flex flex-col overflow-hidden">
            <header className="h-[10%] px-3 py-5 border-b flex justify-between items-center">
              <TippyHeadless
                interactive
                placement="bottom-end"
                offset={[-5, 2]}
                visible={switchChat}
                render={(attrs) => (
                  <div
                    {...attrs}
                    className="w-[300px] max-h-[calc(min((100vh-96px)-60px),734px)] min-h-[30px] py-2 px-2 rounded-md shadow-box bg-white z-[999999] flex flex-col gap-y-2"
                  >
                    <div
                      className="py-1 px-5 flex items-center gap-x-3 hover:bg-[#0000001a] rounded-lg cursor-pointer"
                      onClick={() => handleChangeReceive(false)}
                    >
                      <figure className="border w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center p-2 cursor-pointer">
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
                      <span className="text-[15px] whitespace-nowrap">
                        Chat với AI
                      </span>
                    </div>
                    <div
                      className="py-1 px-5 flex items-center gap-x-3 hover:bg-[#0000001a] rounded-lg cursor-pointer"
                      onClick={() => handleChangeReceive(true)}
                    >
                      <figure className="border w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center p-2 cursor-pointer">
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
                            src={"/images/employee-chat.png"}
                            width={170}
                            height={170}
                            alt="avatar"
                          />
                        </div>
                      </figure>
                      <span className="text-[15px]">Chat với nhân viên</span>
                    </div>
                  </div>
                )}
                onClickOutside={handleCloseSwitchat}
              >
                <div
                  className="select-none flex items-center px-2 py-1 rounded-lg cursor-pointer hover:bg-[#0000001a]"
                  onClick={handleToggleSwitchat}
                >
                  {receive === false ? (
                    <Fragment>
                      <figure className="border w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center p-2 cursor-pointer">
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
                      <div>
                        <ChevronDown />
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <figure className="border w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center p-2 cursor-pointer">
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
                            src={"/images/employee-chat.png"}
                            width={170}
                            height={170}
                            alt="avatar"
                          />
                        </div>
                      </figure>
                      <h4 className="text-base font-bold ml-2">Staff</h4>
                      <div>
                        <ChevronDown />
                      </div>
                    </Fragment>
                  )}
                </div>
              </TippyHeadless>
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
              {renderMessages(receive === false ? messagesBot : messagesStaff)}
              {receive === false &&
                messagesBot?.length === 0 &&
                renderListFirstMessageBot()}
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
                  className={`absolute top-1/2 right-2 -translate-y-1/2 rounded-full py-2 px-2 bg-blue-600 ${textMessage !== "" ? "opacity-1 " : "opacity-30"
                    } `}
                >
                  <span>
                    <SendHorizontal className="text-white" />
                  </span>
                </button>
              </div>
              <h3 className="text-center text-[15px]">
                {receive === false
                  ? "AI-generated information is for reference only"
                  : "Messaging with assistant"}
              </h3>
            </footer>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}