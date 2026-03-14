import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addUserMessage,
  sendChatbotMessage,
  resetChatbot,
} from "../state/chatbot/Action";

import TypingDots from "./TypingDots";

import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaGlobe,
  FaTrash,
} from "react-icons/fa";

/* Quick suggestions */
const suggestions = [
  "🏨 Show available rooms",
  "💰 Today offers",
  "📍 Hotels in Chennai",
  "🛏️ Book Deluxe Room",
];

const LANGUAGES = {
  en: "English",
  hi: "हिन्दी",
};

const Chatbot = () => {
  const dispatch = useDispatch();

  const { messages, loading, error } = useSelector(
    (state) => state.chatbot
  );

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en");
  const [listening, setListening] = useState(false);

  const endRef = useRef(null);

  /* Auto scroll */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Send message */
  const handleSend = (textOverride = null) => {
    const text = textOverride || input;

    if (!text.trim()) return;

    dispatch(addUserMessage(text));
    dispatch(sendChatbotMessage(text, lang));

    setInput("");
  };

  /* Voice input */
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = lang === "hi" ? "hi-IN" : "en-US";
    recognition.interimResults = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      handleSend(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all"
      >
        {open ? <FaTimes size={22} /> : <FaRobot size={22} />}
      </button>

      {open && (
        <div className="animate-slideIn fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[400px] h-[600px] max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden bg-white flex flex-col border border-gray-200">

          {/* HEADER */}

          <div className="bg-green-600 text-white px-5 py-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">Smart Concierge</h2>

              <p className="text-[10px] flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                Online AI Assistant
              </p>
            </div>

            <div className="flex gap-3 items-center">

              {/* Language */}

              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="text-xs bg-white/10 px-2 py-1 rounded-lg flex items-center gap-1 border border-white/20"
              >
                <FaGlobe />
                {LANGUAGES[lang]}
              </button>

              {/* Reset */}

              <button
                onClick={() => dispatch(resetChatbot())}
                className="hover:text-red-200"
              >
                <FaTrash size={14} />
              </button>

            </div>
          </div>

          {/* CHAT BODY */}

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 custom-scrollbar">

            {messages?.map((msg, i) => (
              <div
                key={i}
                className={`flex animate-fadeIn ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2.5 max-w-[85%] text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white rounded-2xl rounded-tr-none"
                      : "bg-white text-gray-800 rounded-2xl rounded-tl-none border"
                  }`}
                >

                  {/* Message */}

                  <p className="whitespace-pre-line">
                    {msg.answer || msg.text}
                  </p>

                  {/* HOTEL RECOMMENDATIONS */}

                  {msg.recommendations?.length > 0 && (
                    <div className="mt-3 space-y-3">

                      {msg.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border shadow-sm p-3"
                        >

                          <h3 className="font-bold text-sm text-green-700">
                            🏨 {rec.hotelName}
                          </h3>

                          <p className="text-xs text-gray-500">
                            📍 {rec.city}
                          </p>

                          <p className="text-xs text-gray-600">
                            🛏 {rec.roomType} • 👥 {rec.guests} guests
                          </p>

                          <p className="text-sm font-bold mt-1">
                            ₹{rec.price} /night
                          </p>

                          <div className="flex gap-2 mt-3">

                            <button
                              onClick={() =>
                                (window.location.href = `/listing/${rec.hotelId}`)
                              }
                              className="flex-1 text-xs py-1 border rounded hover:bg-gray-50"
                            >
                              Details
                            </button>

                            <button
                              onClick={() =>
                                (window.location.href = `/booking/${rec.roomId}`)
                              }
                              className="flex-1 text-xs py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Book Now
                            </button>

                          </div>
                        </div>
                      ))}

                    </div>
                  )}

                  {/* Timestamp */}

                  <div className="text-[9px] mt-1 opacity-60">
                    {msg.time}
                  </div>

                </div>
              </div>
            ))}

            {/* Typing Indicator */}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 text-center">
                ⚠️ {error}
              </p>
            )}

            <div ref={endRef}></div>

          </div>

          {/* SUGGESTIONS */}

          <div className="flex gap-2 overflow-x-auto p-3 border-t bg-white custom-scrollbar-hide">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="text-xs px-3 py-1 border rounded-full hover:border-green-500 hover:text-green-600 transition whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* INPUT AREA */}

          <div className="p-4 bg-white border-t flex items-center gap-2">

            {/* Voice */}

            <button
              title="Voice input"
              onClick={startVoiceInput}
              className={`p-3 rounded-full transition-all ${
                listening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaMicrophone size={16} />
            </button>

            {/* Input */}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me something..."
              className="flex-1 bg-white text-black border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />

            {/* Send */}

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:opacity-50 transition"
            >
              <FaPaperPlane size={14} />
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default Chatbot;