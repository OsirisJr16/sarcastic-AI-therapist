import { useState, useEffect, useRef } from "react";
import { Send, MoreHorizontal, Smile, Settings, MessageCircle } from "lucide-react";
import Markdown from "react-markdown";
import axios from "axios";
import { useTranslation } from 'react-i18next';

export default function SarcasticTherapist() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: t('initialMessage'),
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Environment variables for API configuration
  const API_URL = import.meta.env.VITE_OPENROUTER_API_URL;
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const AI_MODEL = import.meta.env.VITE_AI_MODEL;
  const AI_TEMPERATURE = parseFloat(import.meta.env.VITE_AI_TEMPERATURE);
  const AI_MAX_TOKENS = parseInt(import.meta.env.VITE_AI_MAX_TOKENS);
  const AI_TIMEOUT = parseInt(import.meta.env.VITE_AI_TIMEOUT);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Update initial message when language changes
  useEffect(() => {
    setMessages([{
      from: "bot",
      text: t('initialMessage'),
      timestamp: new Date()
    }]);
  }, [i18n.language, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real API call to OpenRouter
  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { 
      from: "user", 
      text: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          model: AI_MODEL,
          messages: 
            [{ role: "user", 
                content: t('systemPrompt') + input
            }],
          temperature: AI_TEMPERATURE,
          max_tokens: AI_MAX_TOKENS,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: AI_TIMEOUT,
        }
      );
      const botReply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { 
        from: "bot", 
        text: botReply,
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { 
          from: "bot", 
          text: t('errorMessage'),
          timestamp: new Date()
        },
      ]);
    }
    setLoading(false);
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  }

  // Quick actions with icons
  const quickActions = [
    { text: t('quickActions.terribleDay'), icon: "😫" },
    { text: t('quickActions.brutalHonesty'), icon: "💯" },
    { text: t('quickActions.workCrazy'), icon: "🏢" },
    { text: t('quickActions.overthinking'), icon: "🧠" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 py-3 md:px-6 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div 
                  className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl shadow-lg border-2 border-white"
                  style={{ backgroundColor: '#F5A623' }}
                >
                  🤖
                </div>
                
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight truncate" style={{ color: '#2D2D2D' }}>
                  {t('title')}
                </h1>
                <p className="text-xs md:text-sm text-gray-600 flex items-center mt-1 truncate">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse flex-shrink-0"></div>
                  <span className="truncate">{t('subtitle')}</span>
                </p>
                <div className="hidden md:flex items-center mt-1 space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <MessageCircle size={12} className="mr-1" />
                    {messages.filter(m => m.from === "user").length} {t('sessions')}
                  </span>
                  <span>Since 2024</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                style={{ color: '#2D2D2D' }}
              >
                <option value="en">🇺🇸 EN</option>
                <option value="fr">🇫🇷 FR</option>
              </select>
              <button 
                className="p-2 md:p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                style={{ color: '#2D2D2D' }}
              >
                <Settings size={16} className="md:hidden" />
                <Settings size={20} className="hidden md:block" />
              </button>
              <button 
                className="hidden md:block p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                style={{ color: '#2D2D2D' }}
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 70px)' }}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 space-y-4 md:space-y-8" style={{ 
          background: 'linear-gradient(180deg, #FDF6F0 0%, #FBF2EA 100%)',
          paddingBottom: '160px'
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              {/* AI Avatar */}
              {msg.from === "bot" && (
                <div className="flex flex-col items-center mr-2 md:mr-4 flex-shrink-0">
                  <div 
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-xl shadow-lg border-2 border-white"
                    style={{ backgroundColor: '#F5A623' }}
                  >
                    🤖
                  </div>
                </div>
              )}
              
              <div className="flex flex-col flex-1 max-w-[calc(100vw-100px)] md:max-w-xs lg:max-w-md xl:max-w-2xl">
                <div
                  className={`px-3 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl shadow-md relative backdrop-blur-sm ${
                    msg.from === "user"
                      ? "rounded-br-lg"
                      : "rounded-bl-lg"
                  }`}
                  style={{ 
                    backgroundColor: msg.from === "user" ? '#6A0DAD' : '#F5A623',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="text-sm md:text-base leading-relaxed font-medium break-words">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                  
                  {/* Enhanced Message tail */}
                  <div 
                    className={`absolute top-3 md:top-4 w-0 h-0 ${
                      msg.from === "user" 
                        ? "right-0 border-l-[8px] md:border-l-[12px] border-t-[8px] md:border-t-[12px] border-t-transparent"
                        : "left-0 border-r-[8px] md:border-r-[12px] border-t-[8px] md:border-t-[12px] border-t-transparent"
                    }`}
                    style={{ 
                      borderLeftColor: msg.from === "user" ? '#6A0DAD' : 'transparent',
                      borderRightColor: msg.from === "bot" ? '#F5A623' : 'transparent'
                    }}
                  ></div>
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 md:mt-2 px-2 md:px-3 font-medium ${
                  msg.from === "user" ? "text-right" : "text-left"
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* User Avatar */}
              {msg.from === "user" && (
                <div className="flex flex-col items-center ml-2 md:ml-4 flex-shrink-0">
                  <div 
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-xl shadow-lg border-2 border-white"
                    style={{ backgroundColor: '#6A0DAD' }}
                  >
                    😅
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Enhanced Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex flex-col items-center mr-2 md:mr-4 flex-shrink-0">
                <div 
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-xl shadow-lg border-2 border-white animate-pulse"
                  style={{ backgroundColor: '#F5A623' }}
                >
                  🤖
                </div>
              </div>
              <div 
                className="px-3 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl rounded-bl-lg shadow-md backdrop-blur-sm"
                style={{ 
                  backgroundColor: '#F5A623',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs md:text-sm text-white font-medium">{t('typing')}</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl">
          <div className="max-w-4xl mx-auto p-3 md:p-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4 justify-center">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInput(action.text)}
                  className="px-2 py-1 md:px-3 md:py-2 text-xs rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 flex items-center space-x-1"
                  style={{ 
                    borderColor: '#FF5E5B',
                    color: '#2D2D2D',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = '#FF5E5B';
                    btn.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#2D2D2D';
                  }}
                  disabled={loading}
                >
                  <span className="text-sm">{action.icon}</span>
                  <span className="hidden md:inline text-xs">{action.text}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-end space-x-2 md:space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('placeholder')}
                  className="w-full px-4 py-3 md:px-6 md:py-4 pr-12 md:pr-14 text-sm md:text-base border-2 rounded-full focus:outline-none transition-all duration-300 placeholder-gray-400 shadow-sm"
                  style={{ 
                    borderColor: '#FF5E5B',
                    color: '#2D2D2D'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 94, 91, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                  disabled={loading}
                />
                <button className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile size={18} className="md:hidden" />
                  <Smile size={20} className="hidden md:block" />
                </button>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full font-bold transition-all duration-300 transform shadow-lg flex items-center justify-center ${
                  loading || !input.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-110 active:scale-95 shadow-xl"
                }`}
                style={{ 
                  backgroundColor: '#FF5E5B',
                  color: 'white'
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={18} className="md:hidden" />
                    <Send size={20} className="hidden md:block" />
                  </>
                )}
              </button>
            </div>
            
            {/* Footer */}
            <div className="text-center mt-2 md:mt-3">
              <p className="text-xs text-gray-500">
                {t('footer')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}