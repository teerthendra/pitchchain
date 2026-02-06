import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export function useProfile(address) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!address) return;

    const run = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("address", address)
        .single();

      if (!data) {
        const { data: created } = await supabase
          .from("profiles")
          .insert({ address })
          .select()
          .single();

        setProfile(created);
      } else setProfile(data);
    };

    run();
  }, [address]);

  return { profile };
}
