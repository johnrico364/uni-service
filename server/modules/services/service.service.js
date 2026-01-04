import fs from "fs";
import path from "path";

import Service from "./service.model.js"; // Model

export const serviceService = {
  // REGISTER SERVICE ==============================================================
  async registerService(req) {
    const serviceData = JSON.parse(req.body.data);
    const serviceImages = req?.files?.map((file) => file.filename);

    // Validations
    if (!req?.files || req?.files?.length === 0) {
      throw Error("At least one image is required");
    }

    const createService = await Service.create({
      ...serviceData,
      images: serviceImages,
    });

    return createService;
  },
  // GET ALL SERVICES =============================================================
  async getServices() {
    const services = await Service.find().sort({ createdAt: -1 });
    return services;
  },
  // GET SERVICE BY ID ============================================================
  async getServiceById(serviceId) {
    const service = await Service.findById(serviceId);
    return service;
  }
};
