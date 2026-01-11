import { chatService } from "./chat.service.js";

export const startChat = async (req, res) => {
  const { user_id, partner_id } = req.body;
  try {
    const chat = await chatService.startChat(user_id, partner_id);
    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const user_id = req.query?.user_id;
    const chats = await chatService.getChats(user_id)
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
