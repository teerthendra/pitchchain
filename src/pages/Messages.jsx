import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { useAccount } from "wagmi";
import ChatBox from "../components/ChatBox";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, MessageSquare, ArrowRight, Zap, Trash2 } from "lucide-react";

const short = (a) => a.slice(0, 6) + "..." + a.slice(-4);

export default function Messages() {
  const { address } = useAccount();
  const user = address?.toLowerCase();

  const [pending, setPending] = useState([]);
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadPending();
    loadChats();
  }, [user]);

  const loadPending = async () => {
    const { data } = await supabase
      .from("chat_requests")
      .select("*, ads(title)")
      .eq("to_address", user)
      .eq("status", "pending");
    setPending(data || []);
  };

  const loadChats = async () => {
    const { data } = await supabase
      .from("chat_requests")
      .select("*, ads(title)")
      .eq("status", "accepted")
      .or(`from_address.eq.${user},to_address.eq.${user}`);
    setChats(data || []);
  };

  const accept = async (id) => {
    await supabase.from("chat_requests").update({ status: "accepted" }).eq("id", id);
    loadPending();
    loadChats();
  };

  const reject = async (id) => {
    await supabase.from("chat_requests").update({ status: "rejected" }).eq("id", id);
    loadPending();
  };

  // ================= DELETE LOGIC (Receiver Only) =================
  const deleteChat = async (e, id) => {
    e.stopPropagation(); 
    const confirmDelete = window.confirm("Terminate this chat? This will remove it for both parties.");
    if (!confirmDelete) return;

    const { error } = await supabase.from("chat_requests").delete().eq("id", id);
    
    if (!error) {
      if (active?.id === id) setActive(null);
      loadChats();
    }
  };

  return (
    <div className="flex h-[calc(100vh-73px)] bg-[#09090b] text-[#fafafa] font-mono overflow-hidden relative">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

      {/* ===== SIDEBAR ===== */}
      <div className="w-1/3 max-w-sm border-r border-zinc-900 flex flex-col relative z-10 bg-[#0c0c0e]/50 backdrop-blur-2xl shrink-0">
        <div className="p-8 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-blue-500 fill-blue-500" />
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Connection requests</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
          {/* PENDING REQUESTS */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">No requests yet!</h3>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {pending.map((r) => (
                  <motion.div key={r.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 transition-all">
                    <p className="text-[11px] font-bold uppercase tracking-tight text-zinc-200 truncate">{r.ads?.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 mb-4">{short(r.from_address)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => accept(r.id)} className="flex-1 bg-white text-black text-[9px] font-black uppercase py-2.5 rounded-xl hover:bg-blue-400 transition-all">
                        Establish
                      </button>
                      <button onClick={() => reject(r.id)} className="px-4 bg-zinc-800/50 text-zinc-500 hover:text-red-500 rounded-xl">
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ACTIVE CHATS */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Chats</h3>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {chats.map((c) => {
                  const other = c.from_address === user ? c.to_address : c.from_address;
                  const isActive = active?.id === c.id;
                  
                  // LOGIC: Sirf wo delete kar sakta hai jise request aayi thi (to_address)
                  const canDelete = c.to_address === user;

                  return (
                    <motion.div
                      key={c.id}
                      layout
                      onClick={() => setActive(c)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 group relative
                        ${isActive ? "bg-white border-white shadow-xl" : "bg-zinc-900/20 border-zinc-900 hover:border-zinc-700"}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mr-8">
                          <p className={`text-[11px] font-bold uppercase tracking-tight truncate ${isActive ? "text-black" : "text-zinc-200"}`}>
                            {c.ads?.title}
                          </p>
                          <p className={`text-[10px] mt-1.5 ${isActive ? "text-zinc-600" : "text-zinc-500"}`}>
                            {short(other)}
                          </p>
                        </div>
                        
                        {/* Conditional Delete Button */}
                        {canDelete && (
                          <button
                            onClick={(e) => deleteChat(e, c.id)}
                            className={`p-2 rounded-lg transition-all
                              ${isActive 
                                ? "text-zinc-400 hover:text-red-600 hover:bg-red-50" 
                                : "text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10"}
                            `}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 relative z-10 bg-[#09090b]/40 backdrop-blur-sm h-full flex flex-col">
        {active ? <ChatBox chat={active} /> : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale scale-90">
            <MessageSquare size={64} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-[0.8em] mt-6">Select Chat</p>
          </div>
        )}
      </div>
    </div>
  );
}