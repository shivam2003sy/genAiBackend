const express = require("express");
const router = require("./userRoutes");


const {
    getAppointments,
    addAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getSheduledAppointments 
} = require("../controllers/appointmentController");

const route = express.Router();



route.get("/", getAppointments);
route.get("/scheduled", getSheduledAppointments);
route.post("/", addAppointment);
route.get("/:id", getAppointment);
route.put("/:id", updateAppointment);
route.delete("/:id", deleteAppointment);

module.exports = route;



