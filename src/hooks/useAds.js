import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export function useAds() {
  const [ads, setAds] = useState([]);

  const fetchAds = async () => {
    const { data } = await supabase
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false });

    setAds(data || []);
  };

  useEffect(() => {
    fetchAds();

    const channel = supabase
      .channel("ads-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ads" },
        fetchAds
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const createAd = async (ad) => {
    await supabase.from("ads").insert(ad);
  };

  return { ads, createAd };
}
