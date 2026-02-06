import { NavLink } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import { motion } from "framer-motion";

export default function Navbar() {
  // ================= UI: ORIGINAL LABELS + INDUSTRIAL THEME =================
  const linkClass = ({ isActive }) =>
    `relative px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300
     ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200"}`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="
        sticky top-0 z-50
        flex justify-between items-center
        px-10 py-5
        bg-[#09090b]/80 backdrop-blur-xl
        border-b border-zinc-900/50
      "
    >
      {/* ===== LEFT: LOGO ===== */}
      <div className="flex flex-col">
        <h1 className="text-xl font-medium tracking-tighter leading-none text-white uppercase">
          PitchChain
        </h1>
        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1">
          Pitch • Connect • Invest
        </span>
      </div>

      {/* ===== RIGHT: NAV LINKS & WALLET (ALIGNED RIGHT) ===== */}
      <div className="flex items-center gap-6 ml-auto">
        <div className="flex items-center gap-2">
          {[
            { to: "/", label: "Ideas" },
            { to: "/messages", label: "Messages" },
          ].map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{l.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-3 right-3 h-[1px] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Vertical Separator */}
        <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

        {/* ===== WALLET CONNECT ===== */}
        <div className="scale-90 origin-right">
          <WalletConnect />
        </div>
      </div>
    </motion.nav>
  );
}