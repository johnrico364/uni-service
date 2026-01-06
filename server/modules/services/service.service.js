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
  },
  // UPDATE SERVICE ===============================================================
  async updateService(req) {
    const serviceData = JSON.parse(req.body.data);
    const serviceImages = req?.files?.map((file) => file.filename);
    const serviceId = req?.params.id;
    const currentService = await Service.findById(serviceId);

    // Validations
    if (
      currentService?.images.length + serviceImages?.length > 6 &&
      serviceImages?.length > 0
    ) {
      // Delete the newly uploaded images asynchronously
      await Promise.all(
        serviceImages.map((filename) => {
          const filePath = path.join("./images/services", filename);
          return fs.promises
            .unlink(filePath)
            .catch((err) =>
              console.error(`Failed to delete ${filename}:`, err)
            );
        })
      );

      throw Error("You can only upload 6 images per service");
    }

    // Update new service
    const newService = await Service.findByIdAndUpdate(
      serviceId,
      { ...serviceData, images: [...currentService.images, ...serviceImages] },
      { new: true }
    );
    return newService;
  },
  // DELETE SERVICE IMAGES ========================================================
  async deleteServiceImage(id, image) {
    const img_path = path.join("images/services", image);
    fs.unlink(img_path, (err) => {
      if (err) throw err;
      console.log("Service img deleted");
    });

    const service = await Service.findByIdAndUpdate(
      id,
      {
        $pull: { images: image },
      },
      { new: true }
    );

    return service;
  },
  // UPDATE SERVICE STATUS ========================================================
  async updateServiceStatus(id) {
    const service = await Service.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true }
    );

    return service;
  },
  // DELETE SERVICE ================================================================
  async deleteService(id) {
    const service = await Service.findByIdAndUpdate(id, {is_deleted: true, deleted_at: new Date()}, {new: true})
    return service;
  },
};
