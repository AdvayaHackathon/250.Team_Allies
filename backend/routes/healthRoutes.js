const express = require('express');
const healthController = require('../controllers/healthController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

if (!authMiddleware.protect) throw new Error('authMiddleware.protect is undefined');

// Only keep the endpoints that interact with the ML model
router.post('/assess_risk', authMiddleware.protect, healthController.getPrediction);
router.get('/get_required_fields', authMiddleware.protect, healthController.getRequiredFields);

// Optional: Keep record retrieval if you still want to display history
router.get('/records', authMiddleware.protect, healthController.getUserHealthRecords);

module.exports = router;