// resultController.js
const Result = require('../models/resultModel');
const {marksCalculator} = require('../utils/marks');
const transporter = require('../config/mailConfig').transporter;
const Mailgen = require('mailgen');
exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find();
        res.status(200).json({
        status: 'success',
        results,
        });
    } catch (err) {
        res.status(404).json({
        status: 'fail',
        message: err,
        });
    }
    }

exports.getResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        res.status(200).json({
        status: 'success',
        result,
        });
    } catch (err) {
        res.status(404).json({
        status: 'fail',
        message: err,
        });
    }
    }

exports.createResult = async (req, res) => {
    try {
        const newResult = await Result.create(req.body);
        
        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
              name: 'InterviewBlitz',
              link: 'https://www.interviewblitz.live/',
              logo: 'https://www.interviewblitz.live/images/logo.svg'
            }
          });
          const data =  marksCalculator(req.body);
          console.log("data from function ",data);
          const candidateEmailContent = {
            body:{
                greeting : 'Hello !',
                intro : `You have scored ${data.percentage}% in the interview. You have scored ${data.obtainedMarks} out of ${data.totalMarks} in the interview.`,
                table : {
                    data : [
                        {
                            key : 'Need Improvement',
                            value : JSON.stringify(data.needImprovement)
                        },
                        {
                            key : 'Done Well',
                            value : JSON.stringify(data.Donewell)
                        }
                    ]
                },
                outro : 'Thank you for taking the interview.',
            }
          }


    //     const interviewEmailOptions = {
    //     from: 'result@InterviewBlitz.live',
    //     to: newResult.user.email,
    //     subject: 'Interview Scheduled',
    //     text: interviewEmailText,
    //     html: interviewEmailHtml
    // };


    const candidateEmailHtml = mailGenerator.generate(candidateEmailContent);
    const candidateEmailText = mailGenerator.generatePlaintext(candidateEmailContent);

    const candidateEmailOptions = {
        from: 'result@InterviewBlitz.live',
        to: newResult.candidateEmail,
        subject: 'Result of the interview',
        text: candidateEmailText,
        html: candidateEmailHtml
    };

    transporter.sendMail(candidateEmailOptions, (err, info) => {
        if (err) {
            console.log(`Error occurred. ${err.message}`);
            return process.exit(1);
        }
        console.log(`Message sent: ${info.messageId}`);
    }
    );
    res.status(201).json({
        status: 'success',
        result: newResult,
        });


    } catch (err) {
        res.status(400).json({
        status: 'fail',
        message: err,
        });
    }
    }
exports.updateResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndUpdate
        (req.params.id, req.body, {
        new: true,
        runValidators: true,
        });
        res.status(200).json({
        status: 'success',
        result,
        });
    }

    catch (err) {
        res.status(400).json({
        status: 'fail',
        message: err,
        });
    }
    }

exports.deleteResult = async (req, res) => {
    try {
        await Result.findByIdAndDelete(req.params.id);
        res.status(204).json({
        status: 'success',
        data: null,
        });
    }


    catch (err) {
        res.status(404).json({
        status: 'fail',
        message: err,
        });
    }
    }


    exports.getResultByCandidateEmail = async (req, res) => {
        console.log(req.params);
        try {
            const result = await Result.find({ candidateEmail: req.params.candidateEmail });
            res.status(200).json({
                status: 'success',
                result,
            });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err,
            });
        }
    }
    
exports.sendMarksToCandidate = async (req, res) => {
    console.log(req.params.report_id);
    try {
        const result = await Result.findById(req.params.report_id);
        console.log(result);
        res.status(200).json({
            status: 'success',
            result,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
}
