import { useState, useEffect, useRef } from "react";
import axios from "axios";

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await axios.post("/api/chat", {
        message: input,
        language: language || null,
      });

      const botMessage = { type: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);

      if (
        !language &&
        (res.data.reply.toLowerCase().includes("english") ||
          res.data.reply.toLowerCase().includes("हिंदी"))
      ) {
        // user will manually pick, but you can auto-detect
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Error fetching response" },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md h-[80vh] flex flex-col ">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-center w-full">
          YojansForU Chatbot
        </h2>
      </div>
      <div className="">
        <button
          onClick={() => {
            setMessages([]);
            setLanguage("");
          }}
          className=" text-sm bg-red-500  text-white px-2 py-1 rounded ml-2"
        >
          New Chat
        </button>
      </div>

      {!language && (
        <div className="mb-2">
          <p className="font-medium">Select Language:</p>
          <div className="flex gap-3 mt-1">
            <button
              onClick={() => setLanguage("English")}
              className="px-4 py-1 bg-blue-500 text-white rounded"
            >
              English
            </button>
            <button
              onClick={() => setLanguage("Hindi")}
              className="px-4 py-1 bg-green-500 text-white rounded"
            >
              हिंदी
            </button>
          </div>
        </div>
      )}

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded mb-2"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 text-sm animate-pulse">Typing...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-1"
          value={input}
          placeholder="Type your question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
