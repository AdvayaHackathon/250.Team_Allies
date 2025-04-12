const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema({
    risk_score: {
        type: Number,
        required: true
    },
    risk_level: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        required: true
    },
    recommendations: {
        type: [String],
        required: true
    }
});

const healthDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Basic Demographics
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    bmi: {
        type: Number
    },
    ethnicity: {
        type: String,
        enum: ['African/Black', 'Asian', 'Caucasian/White', 'Hispanic/Latino', 'Middle Eastern', 'Pacific Islander', 'Indigenous/Native', 'Mixed', 'Other']
    },
    geographicRegion: {
        type: String,
        enum: ['Urban', 'Suburban', 'Rural']
    },

    // Lifestyle Factors
    physicalActivityLevel: {
        type: String,
        enum: ['None', 'Low', 'Moderate', 'High']
    },
    activityIntensity: {
        type: String,
        enum: ['Light', 'Moderate', 'Vigorous']
    },
    occupationType: {
        type: String,
        enum: ['Sedentary', 'Moderately active', 'Physically demanding', 'Retired', 'Student', 'Unemployed']
    },
    smokingStatus: {
        type: String,
        enum: ['Never smoked', 'Former smoker (quit >1 year ago)', 'Former smoker (quit <1 year ago)', 'Current smoker (occasional)', 'Current smoker (daily)']
    },
    smokingYears: {
        type: Number
    },
    smokingPacksPerDay: {
        type: Number
    },
    alcoholConsumption: {
        type: String,
        enum: ['None', 'Occasional', 'Moderate', 'Heavy']
    },
    sleepDuration: {
        type: String,
        enum: ['<5 hours', '5-6 hours', '7-8 hours', '9+ hours']
    },
    sleepQuality: {
        type: String,
        enum: ['Poor', 'Fair', 'Good', 'Excellent']
    },
    stressLevels: {
        type: String,
        enum: ['Low', 'Moderate', 'High', 'Severe']
    },

    // Diet and Nutrition
    waterIntake: {
        type: String,
        enum: ['<4 glasses', '4-6 glasses', '7-8 glasses', '9+ glasses']
    },
    fruitVegetableConsumption: {
        type: String,
        enum: ['<1 serving/day', '1-2 servings/day', '3-4 servings/day', '5+ servings/day']
    },
    processedFoodConsumption: {
        type: String,
        enum: ['Rarely', 'Sometimes', 'Often', 'Very often']
    },
    sugarIntake: {
        type: String,
        enum: ['Low', 'Moderate', 'High']
    },
    saltIntake: {
        type: String,
        enum: ['Low', 'Moderate', 'High']
    },
    redMeatConsumption: {
        type: String,
        enum: ['None', 'Low', 'Moderate', 'High']
    },

    // Medical History
    familyHistoryCardiovascular: {
        type: String,
        enum: ['No', 'Yes, extended family', 'Yes, immediate family', 'Unknown']
    },
    familyHistoryDiabetes: {
        type: String,
        enum: ['No', 'Yes, extended family', 'Yes, immediate family', 'Unknown']
    },
    familyHistoryKidneyStones: {
        type: String,
        enum: ['No', 'Yes, extended family', 'Yes, immediate family', 'Unknown']
    },
    previousKidneyStones: {
        type: String,
        enum: ['No', 'Yes, one occurrence', 'Yes, multiple occurrences']
    },
    gestationalDiabetes: {
        type: String,
        enum: ['Not applicable', 'No', 'Yes', 'Unknown']
    },

    // Symptoms
    frequentUrination: {
        type: String,
        enum: ['No', 'Occasionally', 'Frequently', 'Very frequently']
    },
    unexplainedThirst: {
        type: String,
        enum: ['No', 'Occasionally', 'Frequently', 'Very frequently']
    },
    unexplainedWeightLoss: {
        type: String,
        enum: ['No', 'Yes (slight)', 'Yes (significant)']
    },
    chestPain: {
        type: String,
        enum: ['Never', 'Rarely', 'Occasionally', 'Frequently']
    },
    shortnessOfBreath: {
        type: String,
        enum: ['Never', 'Rarely', 'Occasionally', 'Frequently']
    },
    fatigue: {
        type: String,
        enum: ['Never', 'Rarely', 'Occasionally', 'Frequently']
    },
    backFlankPain: {
        type: String,
        enum: ['Never', 'Rarely', 'Occasionally', 'Frequently']
    },
    painfulUrination: {
        type: String,
        enum: ['Never', 'Rarely', 'Occasionally', 'Frequently']
    },
    bloodInUrine: {
        type: String,
        enum: ['Never', 'Rarely', 'Occasionally', 'Frequently']
    },

    // Environmental Factors
    environmentalExposure: {
        type: String,
        enum: ['Low', 'Moderate', 'High', 'Unknown']
    },

    // Vitals (from original model)
    bloodPressureSystolic: {
        type: Number,
        min: 70,
        max: 250
    },
    bloodPressureDiastolic: {
        type: Number,
        min: 40,
        max: 150
    },
    bloodSugar: {
        type: Number,
        min: 30,
        max: 500
    },
    cholesterol: {
        type: Number,
        min: 100,
        max: 500
    },

    // Risk Assessment Results
    riskAssessment: {
        cardiovascular: riskAssessmentSchema,
        diabetes: riskAssessmentSchema,
        kidney_stone: riskAssessmentSchema
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
healthDataSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const HealthData = mongoose.model('HealthData', healthDataSchema);
module.exports = HealthData;