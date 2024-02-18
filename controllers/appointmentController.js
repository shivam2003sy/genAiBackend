const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const transporter = require('../config/mailConfig').transporter;
const Mailgen = require('mailgen');
const { get } = require("mongoose");

const getAppointments = asyncHandler(async (req, res) => {
    const userEmail = req.query.userEmail; 
    const appointments = await Appointment.find({
        "user.email": userEmail}
    )
    res.status(200).json(appointments);
});
const getSheduledAppointments = asyncHandler(async (req, res) => {
    const userEmail = req.query.userEmail; 
    const appointments = await Appointment.find({
        $or :[
        {interviewEmail: userEmail},
        {candidateEmail: userEmail}
        ]
    }
    )
    res.status(200).json(appointments);
}
);
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
const addAppointment = asyncHandler(async (req, res) => {
    const { title, startDate, endDate, interviewEmail, candidateEmail, interviewInfo, Role, user, roomId } = req.body;
   
    if (!title || !startDate || !endDate || !interviewEmail || !candidateEmail || !interviewInfo || !user || !roomId || !Role) {
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
      role: {
        Role,
        Subroles
      },
      user,
      roomId
    });
    console.log(appointment);
  
    // Create a Mailgen instance
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'InterviewBlitz',
        link: 'https://www.interviewblitz.live/',
        logo: 'https://www.interviewblitz.live/images/logo.svg'
      }
    });

    const interviewEmailContent = {
      body: {
        name: 'Interviewer',
        intro: 'You have an interview allocated with the following details :',
        table: {
          data: [
            {
              key: 'Post',
              value: title
            },
            {
              key: 'Interviewer Email',
              value: interviewEmail
            },
            {
              key: 'Candidate Email',
              value: candidateEmail
            },
            {
              key: 'Date/Time',
              value: startDate
            },
            {
              key: 'Informaton',
              value: interviewInfo
            },
            {
              key: 'Role',
              value: Role 
          },
          {
              key: 'Subroles',
              value: Subroles.join(', ') 
          },
            {
                key: 'Join Room',
                value: `https://www.interviewblitz.live/room/${roomId}`
            }
          ],

          columns: {
            
            customWidth: {
              key: '20%',
              value: '80%'
            }
          }
        },
        outro: 'Thank you for your commitment and participation in  recruitment process through InterviewBlitz.'
      }
    };
    const candidateEmailContent = {
      body: {
        name: 'Candidate',
        intro: 'You have been scheduled for an interview with the following details joining link is provided below 5 minutes before the scheduled time:',
        table: {
          data: [
            {
              key: 'Post',
              value: title
            },
            {

              key: 'Interviewer Email',
              value: interviewEmail
            },
            {
              key: 'Date / Time',
              value: startDate
            },
            {
              key: 'Informaton',
              value: interviewInfo
            },
            {
              key: 'Role',
              value: Role 
          },
          {
              key: 'Subroles',
              value: Subroles.join(', ') 
          },
            {
                key: 'Join Room',
                value: `https://www.interviewblitz.live/room/${roomId}`
            }
          ],
          columns: {
            customWidth: {
              key: '20%',
              value: '80%'
            }
          }
        },
        outro: 'We look forward to meeting with you and discussing your qualifications further through InterviewBlitz.'
      }
    };
  
    // Generate the HTML for interview email
    const interviewEmailHtml = mailGenerator.generate(interviewEmailContent);
  
    // Generate the HTML for candidate email
    const candidateEmailHtml = mailGenerator.generate(candidateEmailContent);
  
    // Generate the plaintext versions of the emails
    const interviewEmailText = mailGenerator.generatePlaintext(interviewEmailContent);
    const candidateEmailText = mailGenerator.generatePlaintext(candidateEmailContent);
    // Send the emails using transporter.sendMail

    const interviewEmailOptions = {
        from: 'shivam2003sy@gmail.com',
        to: interviewEmail,
        subject: 'Interview Scheduled',
        text: interviewEmailText,
        html: interviewEmailHtml
    };
    const candidateEmailOptions = {
        from: 'shivam2003sy@gmail.com',
        to: candidateEmail,
        subject: 'Interview Scheduled',
        text: candidateEmailText,
        html: candidateEmailHtml
    };

    transporter.sendMail(interviewEmailOptions, (err, info) => {
        if (err) {
            console.log(`Error occurred. ${err.message}`);
            return process.exit(1);
        }
        console.log(`Message sent: ${info.messageId}`);
    }
    );
    transporter.sendMail(candidateEmailOptions, (err, info) => {
        if (err) {
            console.log(`Error occurred. ${err.message}`);
            return process.exit(1);
        }
        console.log(`Message sent: ${info.messageId}`);
    }
    );
    res.status(201).json(appointment);
  });



const getByRoomID = asyncHandler(async (req, res) => {
    const roomID = req.query.roomID;
    if (!roomID) {
        res.status(400);
        throw new Error("Room ID is required");
    }
    else {
        const appointment = await Appointment
            .findOne({ roomId: roomID });
    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }
    res.status(200).json(appointment);
    }
}
);






module.exports = { getAppointments, addAppointment, getAppointment, updateAppointment, deleteAppointment , getSheduledAppointments ,  getByRoomID };







