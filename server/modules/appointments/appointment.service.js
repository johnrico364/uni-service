import Appointment from "./appointment.model.js"; // Model

export const appointmentService = {
  // CREATE APPOINTMENT ==========================================================
  async createAppointment(data) {
    // Validate required fields
    if (
      !data.service_id ||
      !data.user_id ||
      !data.provider_id ||
      !data.schedule ||
      !data.payment_id
    ) {
      throw new Error("Missing required fields");
    }

    // Validate MongoDB ObjectId format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(data.service_id)) {
      throw new Error("Invalid service_id format");
    }
    if (!objectIdRegex.test(data.user_id)) {
      throw new Error("Invalid user_id format");
    }
    if (!objectIdRegex.test(data.provider_id)) {
      throw new Error("Invalid provider_id format");
    }

    // Validate schedule format (YYYY-MM-DD HH:mm)
    const scheduleRegex = /^\d{4}-\d{2}-\d{2} ([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!scheduleRegex.test(data.schedule)) {
      throw new Error("Invalid schedule format. Use YYYY-MM-DD HH:mm");
    }

    // Parse and validate date
    const appointmentDate = new Date(data.schedule);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error("Invalid date");
    }

    // Validate appointment is not in the past
    const now = new Date();
    if (appointmentDate < now) {
      throw new Error("Appointment cannot be scheduled in the past");
    }

    // Validate payment_id is a string
    if (typeof data.payment_id !== "string" || data.payment_id.trim() === "") {
      throw new Error("Invalid payment_id");
    }

    const appointment = await Appointment.create(data);
    return appointment;
  },
  // ====
};
