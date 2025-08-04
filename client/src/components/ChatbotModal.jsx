import { useState } from "react";
import Chatbot from "./Chatbot";

const ChatbotModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-10 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Open Chatbot"
      >
        💬
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-4xl"
            >
              &times;
            </button>

            {/* Chatbot Component */}
            <Chatbot />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotModal;
