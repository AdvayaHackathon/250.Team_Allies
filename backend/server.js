const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));


app.use('/health', healthRoutes);
app.use('/users', userRoutes);

app.post('/assess_risk', async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/assess_risk`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/get_required_fields', async (req, res) => {
    try {
        const response = await axios.get(`${ML_SERVICE_URL}/get_required_fields`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});