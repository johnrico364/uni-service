import { serviceService } from "./service.service.js";

export const registerService = async (req, res) => {
  try {
    const service = await serviceService.registerService(req);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
