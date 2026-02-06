import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { useAccount } from "wagmi";

export default function Profile() {
  const { address } = useAccount();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (address) fetchProfile();
  }, [address]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("address", address)
      .single();

    if (data) {
      setUsername(data.name || "");
      setBio(data.bio || "");
      setExists(true);
    }
  };

  const saveProfile = async () => {
    if (!username) {
      alert("Username required");
      return;
    }

    setLoading(true);

    const payload = {
      address,
      name: username.toLowerCase(),
      bio,
    };

    const { error } = exists
      ? await supabase
          .from("profiles")
          .update(payload)
          .eq("address", address)
      : await supabase.from("profiles").insert(payload);

    setLoading(false);

    if (error) {
      if (error.message.includes("unique")) {
        alert("Username already taken");
      } else {
        alert(error.message);
      }
    } else {
      alert("Profile saved");
      setExists(true);
    }
  };

  if (!address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Connect wallet to create profile
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-2xl font-bold">Your Profile</h2>

        <div>
          <p className="text-xs text-gray-400">Wallet Address</p>
          <p className="text-xs break-all text-gray-300">{address}</p>
        </div>

        <input
          className="
            w-full bg-slate-950 border border-slate-800
            p-3 rounded-lg outline-none
            focus:border-blue-500 text-white
          "
          placeholder="Unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <textarea
          rows={3}
          className="
            w-full bg-slate-950 border border-slate-800
            p-3 rounded-lg outline-none resize-none
            focus:border-blue-500 text-white
          "
          placeholder="Bio (optional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          onClick={saveProfile}
          disabled={loading}
          className="
            w-full bg-blue-600 hover:bg-blue-700
            text-white py-2 rounded-lg font-medium
            disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
