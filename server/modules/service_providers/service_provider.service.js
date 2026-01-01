import Provider from "./service_provider.model.js"; //Model
import path from "path";
import fs from "fs";

export const ProviderService = {
  // REGISTER SERVICE PROVIDER ==========================================================
  async registerProvider(data, image) {
    let img_path;
    if (image) {
      img_path = path.join("images/providers", image);
    }

    // Validations
    const isExisting = await Provider.find({
      business_name: providerData.business_name,
      service_category: providerData.service_category,
    });
    if (isExisting.length > 0) {
      fs.unlink(img_path, (err) => {
        if (err) throw err;
        console.log("provider img delete");
      });
      throw Error(
        "Service Provider with the same business name and service category already exists."
      );
    }

    const providerData = {
      ...data,
      profile_image: image,
      verification_status: "pending",
    };

    // Create service provider
    const response = await Provider.create(providerData);
    return response;
  },
  // GET ALL SERVICE PROVIDERS ==========================================================
  async getAllProviders() {
    const providers = await Provider.find();
    return providers;
  },
  // GET SERVICE PROVIDER BY ID ==========================================================
  async getProviderById(id) {
    const provider = await Provider.findById(id);
    if (!provider) {
      throw new Error("Service Provider not found.");
    }

    return provider;
  },
  // UPDATE SERVICE PROVIDER ==========================================================
  async updateProvider(req) {
    const providerId = req.params.id;
    const newProvider = JSON.parse(req.body.data);
    const providerImg = req.file?.filename;
    const oldImg = req.body?.oldImg;

    if (providerImg) {
      const oldImagePath = path.join("images/providers", oldImg);
      fs.unlink(oldImagePath, (err) => {
        if (err) throw err;
        console.log("old img delete");
      });
    }

    // Update provider
    const provider = await Provider.findByIdAndUpdate(
      providerId,
      { ...newProvider, 
        profile_image: providerImg ? providerImg : oldImg,
      },
      {
        new: true,
      }
    );
    if (!provider) {
      throw new Error("Service Provider not found.");
    }

    return provider;
  },
  // VERIFY SERVICE PROVIDER ===========================================================
  async verifyProvider(id) {
    const provider = await Provider.findByIdAndUpdate(
      id,
      { verification_status: "approved" },
      { new: true }
    );

    return provider;
  },
  // DELETE SERVICE PROVIDER ===========================================================
  async deleteProvider(id) {
    const provider = await Provider.findByIdAndUpdate(
      id,
      {
        is_deleted: true,
        deleted_at: new Date(),
      },
      { new: true }
    );

    return provider;
  },
};
