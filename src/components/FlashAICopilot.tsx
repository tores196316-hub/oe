import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X, Send, Bot, User, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  latencyMs?: number;
}

export const FlashAICopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Merhaba! Ben Gemini 3.1 Flash-Lite ile güçlendirilmiş ultra hızlı AI asistanıyım. Resim optimizasyonu, SEO etiketleri veya platform kullanımı hakkında sorularını saliseler içinde yanıtlayabilirim! ⚡',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || prompt.trim();
    if (!textToSend || loading) return;

    const userMsgId = 'usr-' + Date.now();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setPrompt('');
    setLoading(true);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await res.json();
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: data.answer,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            latencyMs,
          },
        ]);
      } else {
        showToast(data.error || 'Yapay zeka yanıt oluşturamadı', 'error');
      }
    } catch (err: any) {
      showToast('Bağlantı hatası oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Metin panoya kopyalandı!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickQuestions = [
    'Resimleri WebP formatına çevirmenin avantajı nedir?',
    'Sitede maksimum resim boyutu sınırı kaç MB?',
    'Resimlerimi nasıl silerim?',
    'Görsellerim Google aramalarda nasıl üst sıraya çıkar?',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 text-white rounded-full shadow-xl shadow-indigo-500/25 border border-white/20 cursor-pointer hover:brightness-110 transition-all"
        title="Flash AI Low-Latency Copilot"
      >
        <div className="relative">
          <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
        </div>
        <span className="text-xs font-black tracking-wide hidden sm:inline">Flash AI</span>
        <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono font-bold uppercase backdrop-blur-xs">
          gemini-3.1-flash-lite
        </span>
      </motion.button>

      {/* Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-start sm:justify-start sm:p-6 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-md h-[560px] max-h-[90vh] bg-white dark:bg-[#0f1017] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                    <Zap className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                      Flash AI Copilot
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-extrabold">
                        ⚡ Low-Latency
                      </span>
                    </h3>
                    <p className="text-[11px] text-indigo-200/80">Powered by Gemini 3.1 Flash-Lite</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-[#0b0c10]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white'
                      }`}
                    >
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`max-w-[82%] space-y-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed relative group ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-xs'
                            : 'bg-white dark:bg-[#151722] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {msg.sender === 'ai' && (
                          <button
                            onClick={() => copyMessage(msg.text, msg.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
                            title="Kopyala"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 font-mono">
                        <span>{msg.time}</span>
                        {msg.latencyMs && (
                          <span className="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> {msg.latencyMs}ms
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="px-4 py-2.5 bg-white dark:bg-[#151722] border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Gemini 3.1 Flash-Lite yanıt üretiyor...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Pills */}
              {messages.length <= 2 && (
                <div className="p-2.5 bg-white dark:bg-[#0f1017] border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="p-3 bg-white dark:bg-[#0f1017] border-t border-slate-100 dark:border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Flash AI'a bir şey sor (ultra hızlı)..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <button
                    type="submit"
                    disabled={!prompt.trim() || loading}
                    className="p-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
