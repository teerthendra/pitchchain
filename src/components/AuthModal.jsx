import { useState } from "react";
import { supabase } from "../config/supabase";
import { motion } from "framer-motion";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function AuthModal({ type, onClose }) {
  const isLogin = type === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { connect } = useConnect();

  // ================= EMAIL AUTH =================
  const handleEmailAuth = async () => {
    setLoading(true);

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert(isLogin ? "Logged in" : "Signup successful");
      onClose();
    }
  };

  // ================= WALLET LOGIN =================
  const handleWalletLogin = async () => {
    try {
      await connect({ connector: injected() });
      onClose();
    } catch (err) {
      alert("Wallet connection failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-[360px] space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <input
          className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded text-white"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>

        <div className="text-center text-gray-400 text-sm">OR</div>

        <button
          onClick={handleWalletLogin}
          className="w-full border border-slate-700 py-2 rounded hover:bg-slate-800"
        >
          Login with Wallet
        </button>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
