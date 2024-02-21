const mongoose = require('mongoose');


const resultSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: [true, 'A result must have a roomId'],
        unique: true,
        trim: true,
    },
    candidateEmail: String,
    interviewEmail: String,
    interviewInfo: String,
    TechRole: String,
    Role: Array,
    user: Object,
    MarksResult :{
       type  :Object,
    },
    }
);

module.exports = mongoose.model('Result', resultSchema);


