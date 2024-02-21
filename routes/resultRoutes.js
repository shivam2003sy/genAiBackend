// resultRoutes.js
const express = require('express');
const {
    getAllResults,
    getResult,
    createResult,
    updateResult,
    deleteResult,
    getResultByCandidateEmail,
    sendMarksToCandidate
} = require('../controllers/resultController');

const router = express.Router();

router.get('/', getAllResults);
router.get('/:id', getResult);
router.post('/', createResult);
router.patch('/:id', updateResult);
router.delete('/:id', deleteResult);
router.get('/candidate/:candidateEmail', getResultByCandidateEmail);
router.get('mail/:report_id', sendMarksToCandidate);







module.exports = router;



