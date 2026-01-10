import { appointmentService } from "./appointment.service.js";

export const createAppointment = async (req, res) => {
  const appointmentData = req.body;
  console.log(appointmentData);
  try {
    const appointment = await appointmentService.createAppointment(
      appointmentData
    );
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
