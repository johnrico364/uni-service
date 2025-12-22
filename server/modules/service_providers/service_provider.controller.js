import { ProviderService } from "./service_provider.service.js";

export const registerProvider = async (req, res) => {
  try {
    const provider = await ProviderService.registerProvider(req.body);
    res.status(201).json({ success: true, data: provider });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllProviders = async (req, res) => {
  try {
    const providers = await ProviderService.getAllProviders();
    res.status(200).json({ success: true, data: providers });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
