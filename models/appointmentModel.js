const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    title: String,
    startDate: Date,
    endDate: Date,
    interviewEmail: String,
    candidateEmail: String,
    interviewInfo: String,
    user  : Object,
    roomId : String,
  });

module.exports = mongoose.model("Appointment", appointmentSchema);