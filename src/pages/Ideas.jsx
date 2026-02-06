import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Trash2, Send, Lightbulb, Plus, Globe, ArrowRight } from "lucide-react";

export default function Ideas() {
  const { address } = useAccount();
  const user = address?.toLowerCase();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false });
    setAds(data || []);
  };

  const publishAd = async () => {
    if (!user) return alert("Connect wallet");
    if (!title || !description) return;
    await supabase.from("ads").insert({ owner: user, title, description });
    setTitle("");
    setDescription("");
    fetchAds();
  };

  const deleteAd = async (id) => {
    const ok = confirm("Archive this entry?");
    if (!ok) return;
    await supabase.from("ads").delete().eq("id", id);
    fetchAds();
  };

  const connectAd = async (ad) => {
    if (!user) return;
    if (user === ad.owner) return;
    const { data } = await supabase.from("chat_requests").select("id").eq("ad_id", ad.id).eq("from_address", user).single();
    if (data) return alert("Connection pending");
    await supabase.from("chat_requests").insert({ ad_id: ad.id, from_address: user, to_address: ad.owner });
    alert("Connection request broadcasted.");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-blue-500/30">
      
      {/* Background Decor Removed */}
      
      <div className="max-w-7xl mx-auto px-8 py-20 relative z-10">
        
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-8">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border border-blue-500/20">
              Open Protocol
            </span>
            <h1 className="text-7xl font-medium tracking-tighter leading-none">
              Pitch<span className="text-zinc-500">Chain.</span>
            </h1>
          </div>
          <div className="max-w-sm text-zinc-400 text-sm leading-relaxed border-l border-zinc-800 pl-6 uppercase tracking-wider">
            A decentralized idea marketplace where founders and investors connect transparently on-chain.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT: Input Form */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl sticky top-24 shadow-2xl shadow-black/50"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Publish your Idea</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Title</p>
                  <input
                    placeholder="Project Name"
                    className="w-full bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl outline-none focus:border-blue-500/50 transition-all text-sm uppercase font-mono"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Description</p>
                  <textarea
                    placeholder="Briefly explain the vision..."
                    rows={6}
                    className="w-full bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl outline-none focus:border-blue-500/50 resize-none transition-all text-sm uppercase font-mono"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  onClick={publishAd}
                  className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-blue-400 transition-all flex items-center justify-center gap-2 group"
                >
                  Publish <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Grid */}
          <div className="lg:col-span-7 space-y-8">
             <div className="flex items-center gap-4 mb-6">
                <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Live Feed</h3>
                <div className="h-[1px] flex-grow bg-zinc-800" />
             </div>

             <div className="grid grid-cols-1 gap-6">
               <AnimatePresence mode="popLayout">
                 {ads.map((ad, i) => {
                   const isOwner = user === ad.owner;
                   return (
                     <motion.div
                       key={ad.id}
                       layout
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className="group bg-zinc-900/20 border border-zinc-800 p-8 rounded-3xl hover:bg-zinc-900/40 transition-all border-dashed hover:border-solid hover:border-zinc-700 shadow-lg shadow-black/20"
                     >
                       <div className="flex justify-between items-start mb-6">
                         <div className="space-y-1">
                           <h3 className="text-2xl font-medium tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                             {ad.title}
                           </h3>
                           <div className="flex items-center gap-3 text-zinc-600 font-mono text-[10px]">
                              <span className="flex items-center gap-1"><Globe size={10}/> Public</span>
                              <span>•</span>
                              <span>{ad.owner.slice(0, 6)}...{ad.owner.slice(-4)}</span>
                           </div>
                         </div>
                         {isOwner && (
                           <button onClick={() => deleteAd(ad.id)} className="text-zinc-700 hover:text-red-400 p-2 transition-colors">
                             <Trash2 size={18} />
                           </button>
                         )}
                       </div>

                       <p className="text-zinc-400 text-sm leading-relaxed mb-8  font-mono tracking-tighter opacity-80">
                         {ad.description}
                       </p>

                       <div className="flex items-center justify-end">
                         {!isOwner && (
                           <button
                             onClick={() => connectAd(ad)}
                             className="bg-zinc-800 text-zinc-300 hover:bg-white hover:text-black px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5 shadow-inner"
                           >
                             <Plus size={14} /> Connect
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
    </div>
  );
}