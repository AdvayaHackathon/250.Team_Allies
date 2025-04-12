const HealthRecord = require('../models/healthModel');
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

module.exports = {
    // Save health record (used in POST /health/records)
    saveHealthRecord: async (req, res) => {
        console.log("Request received:", req.body);
        const userId = req.user.id;

        try {
            const healthData = req.body;

            const predictionResponse = await axios.post(`${ML_SERVICE_URL}/assess_risk`, healthData);

            if (!predictionResponse.data.success) {
                throw new Error('Risk assessment prediction failed');
            }

            const newHealthRecord = new HealthRecord({
                userId,
                ...healthData,
                riskAssessment: predictionResponse.data.results,
                createdAt: new Date()
            });

            await newHealthRecord.save();

            res.status(201).json({
                message: 'Health record submitted successfully',
                results: predictionResponse.data.results,
                record: newHealthRecord
            });
        } catch (error) {
            console.error("Error processing health data:", error);
            res.status(500).json({
                message: 'Error processing health data',
                error: error.message
            });
        }
    },

    // Get all health records for a user
    getUserHealthRecords: async (req, res) => {
        try {
            const userId = req.user.id;
            const records = await HealthRecord.find({ userId })
                .sort({ createdAt: -1 })
                .select('-__v');

            res.status(200).json({ records });
        } catch (error) {
            console.error("Error fetching health records:", error);
            res.status(500).json({ message: 'Error fetching health records' });
        }
    },

    // Get required fields for health form from ML service
    getRequiredFields: async (req, res) => {
        try {
            const response = await axios.get(`${ML_SERVICE_URL}/get_required_fields`);

            if (!response.data.success) {
                throw new Error('Failed to retrieve required fields');
            }

            res.status(200).json({
                success: true,
                required_fields: response.data.required_fields
            });
        } catch (error) {
            console.error("Error fetching required fields:", error);
            res.status(500).json({
                success: false,
                message: 'Error fetching required fields',
                error: error.message
            });
        }
    },

    // Get prediction without saving
    getPrediction: async (req, res) => {
        try {
            const healthData = req.body;

            const predictionResponse = await axios.post(`${ML_SERVICE_URL}/assess_risk`, healthData);

            res.status(200).json(predictionResponse.data);
        } catch (error) {
            console.error("Error getting prediction:", error);
            res.status(500).json({
                success: false,
                message: 'Error getting prediction',
                error: error.message
            });
        }
    }
};
