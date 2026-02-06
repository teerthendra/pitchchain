import { supabase } from "../config/supabase";

export function useChat() {
  const sendChatRequest = async (adId, from, to) => {
    const { data, error } = await supabase
      .from("chat_requests")
      .insert({
        ad_id: adId,
        from_address: from,
        to_address: to,
      });

    if (error) {
      console.error("CHAT REQUEST ERROR:", error);
      alert("Request failed (check console)");
      return null;
    }

    return data;
  };

  const getMyRequests = async (address) => {
    const { data, error } = await supabase
      .from("chat_requests")
      .select(
        `
        *,
        ads (
          id,
          title,
          description,
          owner
        )
      `
      )
      .or(
        `from_address.eq.${address},to_address.eq.${address}`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return data;
  };

  const updateStatus = async (id, status) => {
    return await supabase
      .from("chat_requests")
      .update({ status })
      .eq("id", id);
  };

  return {
    sendChatRequest,
    getMyRequests,
    updateStatus,
  };
}
