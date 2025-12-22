import Provider from "./service_provider.model.js";

export const ProviderService = {
  // REGISTER SERVICE PROVIDER ==========================================================
  async registerProvider(data) {
    const providerData = { ...data, verification_status: "pending" };

    const isExisting = await Provider.find({
      business_name: providerData.business_name,
      service_category: providerData.service_category,
    });

    if (isExisting.length > 0) {
      throw new Error(
        "Service Provider with the same business name and service category already exists."
      );
    }

    const response = await Provider.create(providerData);

    return response;
  },
  // GET ALL SERVICE PROVIDERS ==========================================================
  async getAllProviders() {
    const providers = await Provider.find();
    return providers;
  },
};
