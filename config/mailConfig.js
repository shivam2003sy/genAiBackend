const nodemailer = require('nodemailer');
require('dotenv').config({path: '../.env'});


// Check if required environment variables are set
if (!process.env.NODEJS_GMAIL_APP_USER || !process.env.NODEJS_GMAIL_APP_PASSWORD) {
    console.error("Error: Please set NODEJS_GMAIL_APP_USER and NODEJS_GMAIL_APP_PASSWORD environment variables.");
    process.exit(1);
}

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEJS_GMAIL_APP_USER,
        pass: process.env.NODEJS_GMAIL_APP_PASSWORD
    }
});



module.exports = {
    transporter
};


