import { serviceService } from "./service.service.js";

export const registerService = async (req, res) => {
  try {
    const service = await serviceService.registerService(req);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await serviceService.getServices();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await serviceService.updateService(req);
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
