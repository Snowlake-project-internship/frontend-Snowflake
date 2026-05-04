import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Message = {
  id: number;
  role: 'bot' | 'user';
  content: string;
};

const AIChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', content: "Hi! I'm SnowBot. I can help you format your Excel files, understand errors, or query your import history. How can I help?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = { id: Date.now(), role: 'user', content: inputText };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'bot',
          content: "I've searched the logs. The last import failed because column 'Revenue' contained string values instead of numbers on row 42. Would you like me to show you how to fix it?"
        }
      ]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          clsx(
            "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center",
            isOpen 
              ? "bg-slate-800 text-slate-400 hover:text-white" 
              : "bg-snowflake text-white hover:bg-snowflake-light hover:scale-105"
          )
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="h-16 border-b border-slate-800 bg-slate-800/50 p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-snowflake/20 flex items-center justify-center text-snowflake">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">SnowBot AI</h3>
              <p className="text-xs text-slate-400 inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Online Status
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "flex",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "max-w-[80%] rounded-2xl p-3 text-sm shadow-sm",
                    msg.role === 'user' 
                      ? "bg-snowflake text-white rounded-br-sm" 
                      : "bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-sm"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-sm p-4 text-slate-400 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-800/30">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your data..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake placeholder-slate-500"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-snowflake text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-snowflake-light transition-colors"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default AIChatbotBubble;
