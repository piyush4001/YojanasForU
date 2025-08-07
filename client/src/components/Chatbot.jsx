import { useState, useEffect, useRef } from "react";
import api from "@/api";

const Chatbot = () => {
  const [language, setLanguage] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const getTimeStamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: "user",
      text: input,
      time: getTimeStamp(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await api.post("/chats/chat", {
        message: input,
        language: language || null,
      });

      const botMessage = {
        type: "bot",
        text: res.data.reply,
        time: getTimeStamp(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "❌ Error fetching response",
          time: getTimeStamp(),
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-xl mx-auto h-[85vh] p-5 bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center w-full">
          🤖 YojanasForU Chatbot
        </h2>
      </div>

      {/* New Chat */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            setMessages([]);
            setLanguage("");
          }}
          className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
        >
          🔄 New Chat
        </button>
      </div>

      {/* Language Selection */}
      {!language && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Select Language:</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setLanguage("English")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              English
            </button>
            <button
              onClick={() => setLanguage("Hindi")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              हिंदी
            </button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg mb-3 space-y-4 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            {msg.type === "bot" && (
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png"
                alt="bot"
                className="w-8 h-8 rounded-full"
              />
            )}

            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm leading-relaxed shadow-md relative ${
                msg.type === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white border text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
              <div className="absolute bottom-0 right-2 text-[10px] text-gray-400 mt-1">
                {msg.time}
              </div>
            </div>

            {msg.type === "user" && (
              <img
                src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
                alt="user"
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce delay-150">•</span>
            <span className="animate-bounce delay-300">•</span>
            <span className="ml-1">Bot is typing...</span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={input}
          placeholder="Type your question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
