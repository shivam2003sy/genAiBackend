// resultController.js
const Result = require('../models/resultModel');

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
