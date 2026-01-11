import Chat from "./chat.model.js"; // Model

export const chatService = {
  // START CHAT =====================================================================
  async startChat(user_id, partner_id) {
    let chat = await Chat.findOne({ user_id, partner_id });
    if (!chat) {
      chat = await Chat.create({ user_id, partner_id });
    }

    return chat;
  },
  // GET ALL CHATS ==================================================================
  async getChats(user_id) {
    const chats = await Chat.find({
      $or: [{ user_id: user_id }, { partner_id: user_id }],
    }).sort({ last_message_at: -1 });

    return chats;
  },
  // =====
};
