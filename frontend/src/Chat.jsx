import { useState, useRef, useEffect } from "react";

// Inline CSS for the specific animations and custom effects
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

  /* Scanlines Animation */
  @keyframes scrollScanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 100%; }
  }

  .scanlines {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0.2)
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 50;
    animation: scrollScanlines 0.5s linear infinite;
  }

  /* Neon Text Shadow */
  .neon-text {
    text-shadow: 0 0 5px #0f0;
  }
  
  /* Hacker Input Styling */
  .hacker-input {
    color: #0f0 !important; /* Force Neon Green */
    caret-color: #0f0; /* Green Cursor */
    text-shadow: 0 0 2px rgba(0, 255, 0, 0.5);
  }
  
  .hacker-input:focus {
    box-shadow: none;
    outline: none;
  }
  
  /* Placeholder Styling */
  .hacker-input::placeholder {
    color: rgba(0, 255, 0, 0.3);
  }

  /* Scrollbar Hiding */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "SYSTEM ONLINE. AWAITING INPUT..." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // ---------------- SEND MESSAGE LOGIC ----------------
  const handleSend = async (endpoint) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      const reply = endpoint === "chat" ? data.reply : data.analysis;
      const finalReply = reply || data.error || "NO DATA RECEIVED FROM MAINFRAME.";

      setMessages((prev) => [...prev, { role: "assistant", content: finalReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "CRITICAL ERROR: CONNECTION FAILED." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend("chat");
    }
  };

  // Helper to format messages (Code vs Text)
  const renderMessageContent = (content) => {
    // Split by code blocks (```)
    const parts = content.split(/```/g);
    
    return parts.map((part, i) => {
      // Even indices are text, Odd indices are code (assuming valid markdown)
      if (i % 2 === 1) {
        return (
          <div key={i} className="my-4 overflow-hidden rounded-md border border-gray-700 bg-[#1e1e1e] shadow-lg">
             <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-1 text-xs text-gray-400 font-sans">
               <span>CODE_BLOCK</span>
               <span className="text-[10px] opacity-70">JS/TEXT</span>
             </div>
            <div className="p-4 overflow-x-auto bg-[#0d0d0d] text-gray-300 font-mono text-sm">
                <pre style={{ margin: 0 }}>
                    <code>{part.trim()}</code>
                </pre>
            </div>
          </div>
        );
      } else {
        // Normal text
        return part.trim() ? (
          <div key={i} className="whitespace-pre-wrap leading-relaxed tracking-wide mb-2 text-green-400">
            {part}
          </div>
        ) : null;
      }
    });
  };

  // ---------------- RENDER UI ----------------
  return (
    <div className="relative flex flex-col w-full h-screen bg-black p-4 md:p-8 font-mono overflow-hidden text-green-500 font-['Fira_Code']">
      <style>{customStyles}</style>
      
      {/* CRT Overlay */}
      <div className="scanlines"></div>

      {/* Header */}
      <div className="z-10 mb-4 flex items-center justify-between border-b border-green-900 pb-2">
        <h1 className="text-2xl font-bold text-green-500 neon-text tracking-widest">
          TERMINAL_V1.0
        </h1>
        <div className="text-xs text-green-800 animate-pulse">
          STATUS: CONNECTED
        </div>
      </div>

      {/* Chat Window */}
      <div className="z-10 flex-1 overflow-y-auto bg-black/50 p-4 scrollbar-hide">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={index}
              className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] md:max-w-[75%] p-4 rounded-xl border backdrop-blur-sm ${
                  isUser
                    ? "border-green-600/50 bg-green-900/10 text-white"
                    : "border-gray-800 bg-gray-900/40 text-green-400"
                }`}
              >
                {/* Label */}
                <div className="text-[10px] uppercase opacity-50 mb-2 font-bold tracking-wider">
                  {isUser ? "> USER_01" : "> AI_CORE"}
                </div>

                {/* Content */}
                <div className="text-sm md:text-base">
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="text-green-500 text-sm animate-pulse ml-2">
            {'>'} PROCESSING DATA STREAM...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Redesigned to match image */}
      <div className="z-10 mt-4 w-full max-w-4xl mx-auto border border-green-900/60 rounded-3xl bg-black/90 p-5 shadow-[0_0_20px_rgba(0,50,0,0.2)]">
        
        {/* Top: Input Field (Seamless) */}
        <div className="flex items-start gap-3 w-full mb-4">
            <span className="text-green-500 text-xl font-bold pt-1 leading-none">{'>'}</span>
            <textarea
              ref={textareaRef}
              className="hacker-input w-full bg-transparent text-lg focus:outline-none placeholder-gray-700 resize-none overflow-hidden min-h-[28px] max-h-[200px] leading-relaxed tracking-wide font-medium"
              placeholder="ENTER_COMMAND..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              spellCheck="false"
            />
        </div>

        {/* Bottom: Buttons (Right Aligned) */}
        <div className="flex justify-end gap-3 pt-2 border-t border-green-900/30">
          <button
            className="px-8 py-2 rounded-full text-sm font-bold tracking-widest border border-red-800 text-red-500 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300"
            onClick={() => handleSend("chat")}
          >
            EXECUTE
          </button>
          
          <button
            className="px-8 py-2 rounded-full text-sm font-bold tracking-widest border border-red-800 text-red-500 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300"
            onClick={() => handleSend("analyze")}
          >
            ANALYZE
          </button>
        </div>
      </div>
    </div>
  );
}