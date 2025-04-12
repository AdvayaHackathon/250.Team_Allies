const express = require('express');
const healthController = require('../controllers/healthController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

if (!authMiddleware.protect) throw new Error('authMiddleware.protect is undefined');

router.post('/assess_risk', authMiddleware.protect, healthController.getPrediction);
router.get('/get_required_fields', authMiddleware.protect, healthController.getRequiredFields);

router.get('/records', authMiddleware.protect, healthController.getUserHealthRecords);

module.exports = router;