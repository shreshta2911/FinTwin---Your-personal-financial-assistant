
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Settings2, BarChart3, Target, Lightbulb, Wallet } from 'lucide-react';
import { UserProfile, Message } from '../types.ts';
import { getFinAdvice } from '../services/geminiService.ts';

interface ChatInterfaceProps {
  profile: UserProfile;
  optimizeTrigger?: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profile, optimizeTrigger }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Hi ${profile.name}! I'm here to help you manage your money. \n\n• Your savings are on track.\n• Want to see a plan to reach your goal faster?`, 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (optimizeTrigger && optimizeTrigger > 0) {
      handleSend("Give me a simple plan to reach my goal based on my current spending.");
    }
  }, [optimizeTrigger]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getFinAdvice(profile, messages, textToSend);
      const assistantMsg: Message = { role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Summarize Spending', icon: <BarChart3 className="w-3.5 h-3.5" />, prompt: "Summarize my total spending across all categories for this month." },
    { label: 'Goal Status', icon: <Target className="w-3.5 h-3.5" />, prompt: "How am I doing on my laptop goal?" },
    { label: 'Saving Tips', icon: <Lightbulb className="w-3.5 h-3.5" />, prompt: "Give me 3 quick tips to save more this month." },
  ];

  return (
    <div className="glass-card rounded-[3rem] custom-shadow flex flex-col h-[700px] overflow-hidden relative border border-emerald-100/50">
      <div className="bg-white/60 p-6 flex items-center justify-between border-b border-emerald-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative bg-emerald-800 p-3 rounded-2xl shadow-xl">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-emerald-950 text-base leading-none">FinTwin</h3>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1.5 block">Advisor Online</span>
          </div>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-3 bg-white rounded-2xl border border-emerald-50 hover:bg-emerald-50 transition-colors"><Settings2 className="w-5 h-5" /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-emerald-50 shrink-0 shadow-sm">
                {m.role === 'user' ? <User className="w-5 h-5 text-emerald-700" /> : <Bot className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className={`px-6 py-4 rounded-[2rem] text-[14px] font-bold leading-relaxed ${m.role === 'user' ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/10' : 'bg-white text-emerald-950 shadow-sm border border-emerald-50'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-emerald-50 shrink-0">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              </div>
              <div className="px-6 py-4 bg-emerald-50/50 text-emerald-800/50 text-xs font-black italic rounded-[2rem]">Processing request...</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white/60 border-t border-emerald-50 space-y-6">
        {/* Quick Actions Bar */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleSend(action.prompt)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-emerald-100 rounded-full text-[11px] font-black text-emerald-900 whitespace-nowrap hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
            >
              <span className="text-emerald-600">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your twin..."
            className="flex-1 bg-white border border-emerald-100 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-inner"
          />
          <button 
            onClick={() => handleSend()} 
            disabled={isLoading || !input.trim()} 
            className="bg-emerald-800 text-white px-6 py-4 rounded-2xl hover:bg-emerald-900 transition-all active:scale-95 disabled:bg-slate-300 shadow-lg shadow-emerald-950/20"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
