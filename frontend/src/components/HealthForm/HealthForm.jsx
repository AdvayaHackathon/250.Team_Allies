import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert.jsx';
import { api } from '../../utils/api';
import './HealthForm.css';

const HealthForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        sex: '',
        height: '', 
        weight: '',
        yearsOfSmoking: '',
        averagePacksPerDay: '',
        smoking: false,
        diabetesFamilyHistory: false,
        environmentalExposure: 'low',
        coughingFrequency: 'rare',
        ethnicity: '',
        geographicRegion: '',
        physicalActivityLevel: '',
        activityIntensity: '',
        occupationType: '',
        smokingStatus: '',
        alcoholConsumption: '',
        sleepDuration: '',
        sleepQuality: '',
        stressLevels: '',
        waterIntake: '',
        fruitVegetableConsumption: '',
        processedFoodConsumption: '',
        sugarIntake: '',
        saltIntake: '',
        redMeatConsumption: '',
        familyHistoryCardiovascular: '',
        familyHistoryKidneyStones: '',
        previousKidneyStones: '',
        historyGestationalDiabetes: '',
        frequentUrination: '',
        unexplainedThirst: '',
        unexplainedWeightLoss: '',
        chestPainDiscomfort: '',
        shortnessOfBreath: '',
        fatigue: '',
        backFlankPain: '',
        painfulUrination: '',
        bloodInUrine: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState(null);

    // Options for dropdown fields
    const options = {
        'Sex': ['Male', 'Female', 'Other'],
        'Ethnicity': ['African/Black', 'Asian', 'Caucasian/White', 'Hispanic/Latino', 'Middle Eastern', 'Pacific Islander', 'Indigenous/Native', 'Mixed', 'Other'],
        'GeographicRegion': ['Urban', 'Suburban', 'Rural'],
        'PhysicalActivityLevel': ['None', 'Low', 'Moderate', 'High'],
        'ActivityIntensity': ['Light', 'Moderate', 'Vigorous'],
        'OccupationType': ['Sedentary', 'Moderately active', 'Physically demanding', 'Retired', 'Student', 'Unemployed'],
        'SmokingStatus': ['Never smoked', 'Former smoker (quit >1 year ago)', 'Former smoker (quit <1 year ago)', 'Current smoker (occasional)', 'Current smoker (daily)'],
        'AlcoholConsumption': ['None', 'Occasional', 'Moderate', 'Heavy'],
        'SleepDuration': ['<5 hours', '5-6 hours', '7-8 hours', '9+ hours'],
        'SleepQuality': ['Poor', 'Fair', 'Good', 'Excellent'],
        'StressLevels': ['Low', 'Moderate', 'High', 'Severe'],
        'WaterIntake': ['<4 glasses', '4-6 glasses', '7-8 glasses', '9+ glasses'],
        'FruitVegetableConsumption': ['<1 serving/day', '1-2 servings/day', '3-4 servings/day', '5+ servings/day'],
        'ProcessedFoodConsumption': ['Rarely', 'Sometimes', 'Often', 'Very often'],
        'SugarIntake': ['Low', 'Moderate', 'High'],
        'SaltIntake': ['Low', 'Moderate', 'High'],
        'RedMeatConsumption': ['None', 'Low', 'Moderate', 'High'],
        'FamilyHistoryCardiovascular': ['No', 'Yes, extended family', 'Yes, immediate family', 'Unknown'],
        'FamilyHistoryDiabetes': ['No', 'Yes, extended family', 'Yes, immediate family', 'Unknown'],
        'FamilyHistoryKidneyStones': ['No', 'Yes, extended family', 'Yes, immediate family', 'Unknown'],
        'PreviousKidneyStones': ['No', 'Yes, one occurrence', 'Yes, multiple occurrences'],
        'HistoryGestationalDiabetes': ['Not applicable', 'No', 'Yes', 'Unknown'],
        'FrequentUrination': ['No', 'Occasionally', 'Frequently', 'Very frequently'],
        'UnexplainedThirst': ['No', 'Occasionally', 'Frequently', 'Very frequently'],
        'UnexplainedWeightLoss': ['No', 'Yes (slight)', 'Yes (significant)'],
        'ChestPainDiscomfort': ['Never', 'Rarely', 'Occasionally', 'Frequently'],
        'ShortnessOfBreath': ['Never', 'Rarely', 'Occasionally', 'Frequently'],
        'Fatigue': ['Never', 'Rarely', 'Occasionally', 'Frequently'],
        'BackFlankPain': ['Never', 'Rarely', 'Occasionally', 'Frequently'],
        'PainfulUrination': ['Never', 'Rarely', 'Occasionally', 'Frequently'],
        'BloodInUrine': ['Never', 'Rarely', 'Occasionally', 'Frequently'],
        'EnvironmentalExposure': ['Low', 'Moderate', 'High', 'Unknown'],
        'CoughingFrequency': ['Rare', 'Occasional', 'Frequent']
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({
            ...prev,
            [e.target.name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        const requiredFields = {
            age: 'Age',
            sex: 'Sex',
            height: 'Height',
            weight: 'Weight',
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !formData[key])
            .map(([_, label]) => label);

        if (missingFields.length > 0) {
            setError(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return false;
        }

        const numericValidation = {
            age: { min: 0, max: 120, label: 'Age' },
            height: { min: 50, max: 250, label: 'Height' },
            weight: { min: 20, max: 250, label: 'Weight' },
        };

        for (const [field, rules] of Object.entries(numericValidation)) {
            const value = Number(formData[field]);
            if (value < rules.min || value > rules.max) {
                setError(`${rules.label} must be between ${rules.min} and ${rules.max}`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (!validateForm()) {
                setIsSubmitting(false);
                return;
            }

            const modelData = {
                ...formData,
                age: Number(formData.age),
                height: Number(formData.height),
                weight: Number(formData.weight),
                yearsOfSmoking: Number(formData.yearsOfSmoking || 0),
                averagePacksPerDay: Number(formData.averagePacksPerDay || 0),
            };

            const response = await api.submitHealthData(modelData);
            setResults(response.data.results);
        } catch (error) {
            setError(error.message || 'An error occurred while submitting the form. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const renderField = (field, label, type = 'text') => {
        if (type === 'number') {
            return (
                <div className="form-group">
                    <label htmlFor={field}>{label}*</label>
                    <input
                        type="number"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
            );
        } else if (type === 'select' && options[label]) {
            return (
                <div className="form-group">
                    <label htmlFor={field}>{label}</label>
                    <select
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">Select an option</option>
                        {options[label].map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            );
        } else if (type === 'checkbox') {
            return (
                <div className="form-group checkbox-group">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name={field}
                            checked={formData[field]}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                        <span>{label}</span>
                    </label>
                </div>
            );
        }
    };

    const renderResults = () => {
        if (!results) return null;
        
        return (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Risk Assessment Results</h2>
                
                {Object.entries(results).map(([disease, data]) => (
                    <div key={disease} className="mb-6 p-4 border rounded-md">
                        <h3 className="text-xl font-semibold capitalize mb-2">{disease} Risk</h3>
                        <div className="flex items-center mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div 
                                    className={`h-4 rounded-full ${
                                        data.risk_level === 'high' ? 'bg-red-500' : 
                                        data.risk_level === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} 
                                    style={{ width: `${data.risk_score}%` }}
                                ></div>
                            </div>
                            <span className="ml-2 font-semibold">{data.risk_score}%</span>
                        </div>
                        <p className="mb-3">
                            Risk Level: <span className={`font-bold ${
                                data.risk_level === 'high' ? 'text-red-600' : 
                                data.risk_level === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                            }`}>{data.risk_level.toUpperCase()}</span>
                        </p>
                        <div>
                            <h4 className="font-semibold mb-2">Recommendations:</h4>
                            <ul className="list-disc pl-5">
                                {data.recommendations.map((rec, idx) => (
                                    <li key={idx} className="mb-1">{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    return (
        <div className="health-form-container">
            <h2 className="text-2xl font-bold mb-6">Health Assessment Form</h2>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!results ? (
                <form onSubmit={handleSubmit} className="health-form">
                    <div className="form-section">
                        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField('age', 'Age', 'number')}
                            <div className="form-group">
                                <label htmlFor="sex">Sex*</label>
                                <select
                                    id="sex"
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {renderField('height', 'Height (cm)', 'number')}
                            {renderField('weight', 'Weight (kg)', 'number')}
                            {renderField('ethnicity', 'Ethnicity', 'select')}
                            {renderField('geographicRegion', 'GeographicRegion', 'select')}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="text-xl font-semibold mb-4">Lifestyle Factors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField('physicalActivityLevel', 'PhysicalActivityLevel', 'select')}
                            {renderField('activityIntensity', 'ActivityIntensity', 'select')}
                            {renderField('occupationType', 'OccupationType', 'select')}
                            {renderField('smokingStatus', 'SmokingStatus', 'select')}
                            {renderField('yearsOfSmoking', 'Years of Smoking', 'number')}
                            {renderField('averagePacksPerDay', 'Average Packs Per Day', 'number')}
                            {renderField('alcoholConsumption', 'AlcoholConsumption', 'select')}
                            {renderField('sleepDuration', 'SleepDuration', 'select')}
                            {renderField('sleepQuality', 'SleepQuality', 'select')}
                            {renderField('stressLevels', 'StressLevels', 'select')}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="text-xl font-semibold mb-4">Dietary Habits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField('waterIntake', 'WaterIntake', 'select')}
                            {renderField('fruitVegetableConsumption', 'FruitVegetableConsumption', 'select')}
                            {renderField('processedFoodConsumption', 'ProcessedFoodConsumption', 'select')}
                            {renderField('sugarIntake', 'SugarIntake', 'select')}
                            {renderField('saltIntake', 'SaltIntake', 'select')}
                            {renderField('redMeatConsumption', 'RedMeatConsumption', 'select')}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="text-xl font-semibold mb-4">Medical History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField('familyHistoryCardiovascular', 'FamilyHistoryCardiovascular', 'select')}
                            {renderField('diabetesFamilyHistory', 'Do you have family history of diabetes?', 'checkbox')}
                            {renderField('familyHistoryKidneyStones', 'FamilyHistoryKidneyStones', 'select')}
                            {renderField('previousKidneyStones', 'PreviousKidneyStones', 'select')}
                            {renderField('historyGestationalDiabetes', 'HistoryGestationalDiabetes', 'select')}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="text-xl font-semibold mb-4">Symptoms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField('frequentUrination', 'FrequentUrination', 'select')}
                            {renderField('unexplainedThirst', 'UnexplainedThirst', 'select')}
                            {renderField('unexplainedWeightLoss', 'UnexplainedWeightLoss', 'select')}
                            {renderField('chestPainDiscomfort', 'ChestPainDiscomfort', 'select')}
                            {renderField('shortnessOfBreath', 'ShortnessOfBreath', 'select')}
                            {renderField('fatigue', 'Fatigue', 'select')}
                            {renderField('backFlankPain', 'BackFlankPain', 'select')}
                            {renderField('painfulUrination', 'PainfulUrination', 'select')}
                            {renderField('bloodInUrine', 'BloodInUrine', 'select')}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="text-xl font-semibold mb-4">Environmental Factors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="environmentalExposure">Environmental Exposure</label>
                                <select
                                    id="environmentalExposure"
                                    name="environmentalExposure"
                                    value={formData.environmentalExposure}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="coughingFrequency">Coughing Frequency</label>
                                <select
                                    id="coughingFrequency"
                                    name="coughingFrequency"
                                    value={formData.coughingFrequency}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="rare">Rare</option>
                                    <option value="occasional">Occasional</option>
                                    <option value="frequent">Frequent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`submit-button ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Processing...' : 'Assess My Risk'}
                    </button>
                </form>
            ) : renderResults()}
            
            {results && (
                <div className="mt-4">
                    <button
                        onClick={() => setResults(null)}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Take Another Assessment
                    </button>
                </div>
            )}
        </div>
    );
};

export default HealthForm;