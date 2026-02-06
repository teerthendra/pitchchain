import { useEffect, useRef, useState } from "react";
import { supabase } from "../config/supabase";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ShieldCheck, Terminal } from "lucide-react";

export default function ChatBox({ chat }) {
  const { address } = useAccount();
  const user = address?.toLowerCase();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chat?.id) return;
    loadMessages();

    const channel = supabase
      .channel(`chat-room-${chat.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        table: 'messages',
        schema: 'public',
        filter: `chat_request_id=eq.${chat.id}`
      }, (payload) => {
        setMessages((prev) => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chat.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase.from("messages").select("*").eq("chat_request_id", chat.id).order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const send = async () => {
    if (!text.trim()) return;
    const { error } = await supabase.from("messages").insert({
      chat_request_id: chat.id,
      sender: user,
      message: text.trim(),
    });
    if (!error) setText("");
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] font-mono border-l border-zinc-900">
      
      {/* ===== HEADER: Dynamic Title from Ads ===== */}
      <div className="border-b border-zinc-900 px-8 py-5 bg-zinc-950/50 flex justify-between items-center shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
              {/* Yahan aapka dynamic title show hoga */}
              {chat.ads?.title || "Secure Session"}
            </h2>
          </div>
          <p className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold ml-3">
            end to end encrypted
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* <span className="text-[9px] text-zinc-700 font-bold border border-zinc-900 px-2 py-1 rounded">ID: {chat.id.slice(0,8)}</span> */}
          <ShieldCheck size={16} className="text-zinc-800" />
        </div>
      </div>

      {/* ===== MESSAGES ===== */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const mine = m.sender === user;
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`px-5 py-3 text-[12px] border ${mine ? "bg-white text-black border-white rounded-2xl rounded-br-sm" : "bg-zinc-900/80 text-zinc-200 border-zinc-800 rounded-2xl rounded-bl-sm"}`}>
                  {m.message}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ===== INPUT ===== */}
      <div className="p-6 bg-zinc-950 border-t border-zinc-900 shrink-0">
        <div className="flex gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 focus-within:border-zinc-500">
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="TYPE_MESSAGE..." 
            className="flex-1 bg-transparent px-4 py-2 text-[12px] text-white outline-none placeholder:text-zinc-800" 
          />
          <button onClick={send} className="bg-white text-black p-3 rounded-xl hover:bg-blue-500 hover:text-white transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}