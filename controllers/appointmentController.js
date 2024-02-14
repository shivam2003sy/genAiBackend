const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");


const getAppointments = asyncHandler(async (req, res) => {
    const userEmail = req.query.userEmail; 
    console.log("User email:", userEmail);
    const appointments = await Appointment.find({
        "user.email": userEmail}
    )
    console.log(appointments);
    res.status(200).json(appointments);
});

const addAppointment = asyncHandler(async (req, res) => {
  const { title, startDate, endDate, interviewEmail, candidateEmail, interviewInfo, user ,roomId } = req.body;
  console.log(req.body);
  if (!title || !startDate || !endDate || !interviewEmail || !candidateEmail || !interviewInfo || !user || !roomId) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const appointment = await Appointment.create({
    title,
    startDate,
    endDate,
    interviewEmail,
    candidateEmail,
    interviewInfo,
    user,
    roomId
  });
  res.status(201).json(appointment);
});
const getAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }
    res.status(200).json(appointment);
    }
);
const updateAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }
    if (appointment.appointmentCreator.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user appointments");
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    res.status(200).json(updatedAppointment);
});

const deleteAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }
    if (appointment.appointmentCreator.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete other user appointments");
    }
    await appointment.remove();
    res.status(200).json({ message: "Appointment removed" });
});

module.exports = { getAppointments, addAppointment, getAppointment, updateAppointment, deleteAppointment };




