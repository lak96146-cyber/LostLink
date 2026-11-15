import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Compass
} from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  intent?: string;
  suggestions?: string[];
  actionLink?: string;
  actionText?: string;
}

export const LinkBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello! I'm LinkBot, your CGC Jhanjeri campus recovery assistant. How can I guide you today?",
      suggestions: [
        'How to report a lost item?',
        'What is Item DNA?',
        'Explore CampusVerse 3D',
        'SafeReturn QR process',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithLinkBot(query);
      const botMsg: Message = {
        sender: 'bot',
        text: res.reply,
        intent: res.intent,
        suggestions: res.suggestions,
        actionLink: res.actionLink,
        actionText: res.actionText,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I am temporarily unable to connect to the recovery engine. Please try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (link: string) => {
    navigate(link);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#167D78] hover:bg-[#126863] text-[#F5F1E8] shadow-2xl shadow-[#167D78]/40 hover:scale-105 transition-all duration-200 border border-[#8FE0BE]/40"
        >
          <div className="w-6 h-6 rounded-full bg-[#142B38] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#8FE0BE]" />
          </div>
          <span className="text-xs font-bold tracking-wide">LinkBot Guide</span>
          <span className="w-2 h-2 rounded-full bg-[#8FE0BE] animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-3xl bg-[#142B38] border border-[#EDE5D6]/20 shadow-2xl flex flex-col h-[520px] overflow-hidden text-[#F5F1E8] animate-in fade-in duration-200">
          {/* Header */}
          <div className="p-4 bg-[#1C414B] border-b border-[#EDE5D6]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#167D78] flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-[#8FE0BE]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F5F1E8] flex items-center gap-1.5">
                  <span>LinkBot Assistant</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#8FE0BE]/15 text-[#8FE0BE] font-bold">
                    Local Engine
                  </span>
                </h4>
                <div className="text-[10px] text-[#EDE5D6]/70">CGC Jhanjeri Campus Intelligence</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#EDE5D6]/70 hover:text-white hover:bg-[#142B38]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#142B38]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#167D78] text-[#F5F1E8] rounded-br-none shadow-md shadow-[#167D78]/20'
                      : 'bg-[#1C414B] text-[#F5F1E8] rounded-bl-none border border-[#EDE5D6]/10'
                  }`}
                >
                  {m.text}
                </div>

                {m.actionLink && m.actionText && (
                  <button
                    onClick={() => handleActionClick(m.actionLink!)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9B65A] text-[#142B38] text-[11px] font-bold shadow-md hover:brightness-105 transition"
                  >
                    <span>{m.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.suggestions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(s)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#1C414B] border border-[#EDE5D6]/15 hover:border-[#8FE0BE]/60 text-[#EDE5D6] hover:text-[#8FE0BE] transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#EDE5D6]/60 italic bg-[#1C414B]/60 p-2.5 rounded-2xl w-fit">
                <div className="w-3.5 h-3.5 border-2 border-[#8FE0BE] border-t-transparent rounded-full animate-spin" />
                <span>LinkBot is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#1C414B] border-t border-[#EDE5D6]/15 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about campus recovery..."
              className="flex-1 bg-[#142B38] border border-[#EDE5D6]/15 rounded-xl px-3 py-2 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-[#167D78] hover:bg-[#126863] text-[#F5F1E8] transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
