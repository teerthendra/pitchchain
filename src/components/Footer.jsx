import { motion } from "framer-motion";
import { Github,Linkedin } from "lucide-react";


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-[#09090b] relative z-10">
      <div className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* ===== BRAND ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-xl font-medium tracking-tighter text-white uppercase">
            PitchChain<span className="text-blue-500">.</span>
          </h2>

          <p className="text-[11px] font-mono text-zinc-500 leading-relaxed uppercase tracking-tight max-w-[240px]">
            A decentralized idea marketplace where founders and investors
            connect transparently on-chain.
          </p>

          <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">
            Build by @teerthendra
          </p>
        </motion.div>

        {/* ===== LINKS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Product
          </h3>

          <ul className="space-y-2 text-[11px] font-mono text-zinc-600 uppercase">
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Ideas</li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors">Messages</li>
          </ul>
        </motion.div>

        {/* ===== SOCIAL ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Connect
          </h3>

          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/in/teerthendra-singh-a940ba252"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:border-white hover:text-white transition-all duration-300"
            >
              <Linkedin size={14} />
            </a>

            <a
              href="https://github.com/teerthendra/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:border-white hover:text-white transition-all duration-300"
            >
              <Github size={16} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-zinc-900 py-6 text-center">
        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
          © {year} PitchChain — Encrypted Infrastructure
        </p>
      </div>
    </footer>
  );
}