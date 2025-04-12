import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert.jsx';
import { api } from '../../utils/api';
import './HealthForm.css';

const HealthForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Basic Demographics
        age: '',
        sex: '',
        height: '',
        weight: '',
        ethnicity: '',
        geographicRegion: '',

        // Lifestyle Factors
        physicalActivityLevel: 'none',
        activityIntensity: 'light',
        occupationType: 'sedentary',
        smokingStatus: 'never',
        yearsOfSmoking: '',
        packsPerDay: '',
        alcoholConsumption: 'none',
        sleepDuration: '7-8',
        sleepQuality: 'good',
        stressLevels: 'moderate',

        // Diet and Nutrition
        waterIntake: '4-6',
        fruitVegetableConsumption: '1-2',
        processedFoodConsumption: 'sometimes',
        addedSugarIntake: 'moderate',
        saltIntake: 'moderate',
        redMeatConsumption: 'moderate',

        // Medical History
        familyHistoryCardiovascular: 'no',
        familyHistoryDiabetes: 'no',
        familyHistoryKidneyStones: 'no',
        previousKidneyStones: 'no',
        gestationalDiabetes: 'not_applicable',

        // Symptoms
        frequentUrination: 'no',
        unexplainedThirst: 'no',
        unexplainedWeightLoss: 'no',
        chestPain: 'never',
        shortnessOfBreath: 'never',
        fatigue: 'never',
        backFlankPain: 'never',
        painfulUrination: 'never',
        bloodInUrine: 'never',
        // Environmental Factors
        environmentalExposure: 'low'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSmokingFields, setShowSmokingFields] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Show smoking-related fields only if user is current or former smoker
        if (name === 'smokingStatus') {
            setShowSmokingFields(
                value === 'former_over_year' ||
                value === 'former_under_year' ||
                value === 'current_occasional' ||
                value === 'current_daily'
            );
        }

        if (error) setError('');
    };

    const validateForm = () => {
        const requiredFields = {
            age: 'Age',
            sex: 'Sex',
            height: 'Height',
            weight: 'Weight',
            ethnicity: 'Ethnicity'
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
            height: { min: 50, max: 250, label: 'Height (cm)' },
            weight: { min: 20, max: 500, label: 'Weight (kg)' }
        };

        for (const [field, rules] of Object.entries(numericValidation)) {
            const value = Number(formData[field]);
            if (isNaN(value) || value < rules.min || value > rules.max) {
                setError(`${rules.label} must be between ${rules.min} and ${rules.max}`);
                return false;
            }
        }

        // Validation for smoking fields if smoker
        if (showSmokingFields) {
            if (!formData.yearsOfSmoking || !formData.packsPerDay) {
                setError('Please complete all smoking-related fields');
                return false;
            }
        }

        return true;
    };

    const transformFormData = (data) => {
        // Map from your form keys to API expected keys
        return {
            "Age": Number(data.age),
            "Sex": data.sex === "Male" ? 0 : (data.sex === "Female" ? 1 : 2),
            "Height": Number(data.height),
            "Weight": Number(data.weight),
            "Physical activity level": ["none", "light", "moderate", "active", "very_active"].indexOf(data.physicalActivityLevel),
            "Smoking status": ["never", "former_over_year", "former_under_year", "current_occasional", "current_daily"].indexOf(data.smokingStatus),
            "Alcohol consumption": ["none", "occasional", "moderate", "heavy"].indexOf(data.alcoholConsumption),
            "Sleep duration": ["less_than_6", "6-7", "7-8", "more_than_8"].indexOf(data.sleepDuration),
            "Fruit and vegetable consumption": ["none", "1-2", "3-4", "5+"].indexOf(data.fruitVegetableConsumption),
            "Processed food consumption": ["never", "rarely", "sometimes", "frequently", "daily"].indexOf(data.processedFoodConsumption),
            "Added sugar intake": ["low", "moderate", "high"].indexOf(data.addedSugarIntake),
            "Family history of diabetes": data.familyHistoryDiabetes === "yes" ? 1 : 0,
            "Frequent urination": data.frequentUrination === "yes" ? 1 : 0,
            "Unexplained thirst": data.unexplainedThirst === "yes" ? 1 : 0,
            "Unexplained weight loss": data.unexplainedWeightLoss === "yes" ? 1 : 0,
            "Activity intensity": ["light", "moderate", "vigorous"].indexOf(data.activityIntensity),
            "Stress levels": ["low", "moderate", "high"].indexOf(data.stressLevels),
            "Salt intake": ["low", "moderate", "high"].indexOf(data.saltIntake),
            "Family history of cardiovascular disease": data.familyHistoryCardiovascular === "yes" ? 1 : 0,
            "Chest pain or discomfort": ["never", "rarely", "sometimes", "frequently"].indexOf(data.chestPain),
            "Shortness of breath during normal activities": ["never", "rarely", "sometimes", "frequently"].indexOf(data.shortnessOfBreath),
            "Fatigue": ["never", "rarely", "sometimes", "frequently"].indexOf(data.fatigue),
            "Daily water intake": ["less_than_2", "2-4", "4-6", "more_than_6"].indexOf(data.waterIntake),
            "Red meat consumption": ["never", "rare", "moderate", "frequent"].indexOf(data.redMeatConsumption),
            "Family history of kidney stones": data.familyHistoryKidneyStones === "yes" ? 1 : 0,
            "Previous kidney stones": data.previousKidneyStones === "yes" ? 1 : 0,
            "Back or flank pain": ["never", "rarely", "sometimes", "frequently"].indexOf(data.backFlankPain),
            "Painful urination": data.painfulUrination === "yes" ? 1 : 0,
            "Blood in urine": data.bloodInUrine === "yes" ? 1 : 0
        };
    };

    // Use it in your handleSubmit
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (!validateForm()) {
                setIsSubmitting(false);
                return;
            }

            const modelData = transformFormData(formData);
            const response = await api.submitHealthData(modelData);

            navigate('/risk-assessment', {
                state: {
                    assessmentData: response
                }
            });
        } catch (error) {
            setError(error.message || 'An error occurred while submitting the form. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="health-form-container">
            <h2 className="text-2xl font-bold mb-6">Comprehensive Health Risk Assessment</h2>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div img alt='bg image' className="bg-image">
            <form onSubmit={handleSubmit} className="health-form">
                {/* Basic Demographics Section */}
                <div className="form-section">
                    <h3 className="text-xl font-semibold mb-4">Basic Demographics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="age">Age (years)*</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="0"
                                max="120"
                                required
                                className="form-input"
                            />
                        </div>

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
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="height">Height (cm)*</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                min="50"
                                max="250"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="weight">Weight (kg)*</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                min="20"
                                max="500"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ethnicity">Ethnicity*</label>
                            <select
                                id="ethnicity"
                                name="ethnicity"
                                value={formData.ethnicity}
                                onChange={handleChange}
                                required
                                className="form-select"
                            >
                                <option value="">Select Ethnicity</option>
                                <option value="african_black">African/Black</option>
                                <option value="asian">Asian</option>
                                <option value="caucasian_white">Caucasian/White</option>
                                <option value="hispanic_latino">Hispanic/Latino</option>
                                <option value="middle_eastern">Middle Eastern</option>
                                <option value="pacific_islander">Pacific Islander</option>
                                <option value="indigenous_native">Indigenous/Native</option>
                                <option value="mixed">Mixed</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="geographicRegion">Geographic Region</label>
                            <select
                                id="geographicRegion"
                                name="geographicRegion"
                                value={formData.geographicRegion}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select Region</option>
                                <option value="urban">Urban</option>
                                <option value="suburban">Suburban</option>
                                <option value="rural">Rural</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lifestyle Factors Section */}
                <div className="form-section">
                    <h3 className="text-xl font-semibold mb-4">Lifestyle Factors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="physicalActivityLevel">Physical Activity Level</label>
                            <select
                                id="physicalActivityLevel"
                                name="physicalActivityLevel"
                                value={formData.physicalActivityLevel}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="none">None (0 days/week)</option>
                                <option value="low">Low (1-2 days/week)</option>
                                <option value="moderate">Moderate (3-4 days/week)</option>
                                <option value="high">High (5+ days/week)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="activityIntensity">Activity Intensity</label>
                            <select
                                id="activityIntensity"
                                name="activityIntensity"
                                value={formData.activityIntensity}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="light">Light (walking, gentle yoga)</option>
                                <option value="moderate">Moderate (brisk walking, cycling)</option>
                                <option value="vigorous">Vigorous (running, HIIT workouts)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="occupationType">Occupation Type</label>
                            <select
                                id="occupationType"
                                name="occupationType"
                                value={formData.occupationType}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="sedentary">Sedentary (desk job)</option>
                                <option value="moderately_active">Moderately active</option>
                                <option value="physically_demanding">Physically demanding</option>
                                <option value="retired">Retired</option>
                                <option value="student">Student</option>
                                <option value="unemployed">Unemployed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="smokingStatus">Smoking Status</label>
                            <select
                                id="smokingStatus"
                                name="smokingStatus"
                                value={formData.smokingStatus}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="never">Never smoked</option>
                                <option value="former_over_year">Former smoker (quit &gt;1 year ago)</option>
                                <option value="former_under_year">Former smoker (quit &lt;1 year ago)</option>
                                <option value="current_occasional">Current smoker (occasional)</option>
                                <option value="current_daily">Current smoker (daily)</option>
                            </select>
                        </div>

                        {showSmokingFields && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="yearsOfSmoking">Years of Smoking</label>
                                    <input
                                        type="number"
                                        id="yearsOfSmoking"
                                        name="yearsOfSmoking"
                                        value={formData.yearsOfSmoking}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="packsPerDay">Average Packs Per Day</label>
                                    <select
                                        id="packsPerDay"
                                        name="packsPerDay"
                                        value={formData.packsPerDay}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select Amount</option>
                                        <option value="0.25">0.25 (few cigarettes)</option>
                                        <option value="0.5">0.5 (half pack)</option>
                                        <option value="1">1 (one pack)</option>
                                        <option value="1.5">1.5 (one and a half packs)</option>
                                        <option value="2+">2+ (two or more packs)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label htmlFor="alcoholConsumption">Alcohol Consumption</label>
                            <select
                                id="alcoholConsumption"
                                name="alcoholConsumption"
                                value={formData.alcoholConsumption}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="none">None</option>
                                <option value="occasional">Occasional (few times per month)</option>
                                <option value="moderate">Moderate (1-2 drinks, few times per week)</option>
                                <option value="heavy">Heavy (daily or multiple drinks most days)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sleepDuration">Sleep Duration</label>
                            <select
                                id="sleepDuration"
                                name="sleepDuration"
                                value={formData.sleepDuration}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="<5">Less than 5 hours</option>
                                <option value="5-6">5-6 hours</option>
                                <option value="7-8">7-8 hours</option>
                                <option value="9+">9+ hours</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sleepQuality">Sleep Quality</label>
                            <select
                                id="sleepQuality"
                                name="sleepQuality"
                                value={formData.sleepQuality}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="poor">Poor</option>
                                <option value="fair">Fair</option>
                                <option value="good">Good</option>
                                <option value="excellent">Excellent</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="stressLevels">Stress Levels</label>
                            <select
                                id="stressLevels"
                                name="stressLevels"
                                value={formData.stressLevels}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                                <option value="severe">Severe</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Diet and Nutrition Section */}
                <div className="form-section">
                    <h3 className="text-xl font-semibold mb-4">Diet and Nutrition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="waterIntake">Daily Water Intake</label>
                            <select
                                id="waterIntake"
                                name="waterIntake"
                                value={formData.waterIntake}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="<4">Less than 4 glasses</option>
                                <option value="4-6">4-6 glasses</option>
                                <option value="7-8">7-8 glasses</option>
                                <option value="9+">9+ glasses</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="fruitVegetableConsumption">Fruit and Vegetable Consumption</label>
                            <select
                                id="fruitVegetableConsumption"
                                name="fruitVegetableConsumption"
                                value={formData.fruitVegetableConsumption}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="<1">Less than 1 serving/day</option>
                                <option value="1-2">1-2 servings/day</option>
                                <option value="3-4">3-4 servings/day</option>
                                <option value="5+">5+ servings/day</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="processedFoodConsumption">Processed Food Consumption</label>
                            <select
                                id="processedFoodConsumption"
                                name="processedFoodConsumption"
                                value={formData.processedFoodConsumption}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="rarely">Rarely (few times/month)</option>
                                <option value="sometimes">Sometimes (few times/week)</option>
                                <option value="often">Often (almost daily)</option>
                                <option value="very_often">Very often (multiple times daily)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="addedSugarIntake">Added Sugar Intake</label>
                            <select
                                id="addedSugarIntake"
                                name="addedSugarIntake"
                                value={formData.addedSugarIntake}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="low">Low (avoid sugary foods/drinks)</option>
                                <option value="moderate">Moderate (occasional sweets/sodas)</option>
                                <option value="high">High (daily consumption of sugary items)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="saltIntake">Salt Intake</label>
                            <select
                                id="saltIntake"
                                name="saltIntake"
                                value={formData.saltIntake}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="low">Low (minimal added salt)</option>
                                <option value="moderate">Moderate (some added salt)</option>
                                <option value="high">High (frequently add salt/consume salty foods)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="redMeatConsumption">Red Meat Consumption</label>
                            <select
                                id="redMeatConsumption"
                                name="redMeatConsumption"
                                value={formData.redMeatConsumption}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="none">None (vegetarian/vegan)</option>
                                <option value="low">Low (few times/month)</option>
                                <option value="moderate">Moderate (1-2 times/week)</option>
                                <option value="high">High (3+ times/week)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Medical History Section */}
                <div className="form-section">
                    <h3 className="text-xl font-semibold mb-4">Medical History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="familyHistoryCardiovascular">Family History of Cardiovascular Disease</label>
                            <select
                                id="familyHistoryCardiovascular"
                                name="familyHistoryCardiovascular"
                                value={formData.familyHistoryCardiovascular}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="no">No</option>
                                <option value="extended">Yes, extended family (grandparents, aunts/uncles)</option>
                                <option value="immediate">Yes, immediate family (parents, siblings)</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="familyHistoryDiabetes">Family History of Diabetes</label>
                            <select
                                id="familyHistoryDiabetes"
                                name="familyHistoryDiabetes"
                                value={formData.familyHistoryDiabetes}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="no">No</option>
                                <option value="extended">Yes, extended family</option>
                                <option value="immediate">Yes, immediate family</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="familyHistoryKidneyStones">Family History of Kidney Stones</label>
                            <select
                                id="familyHistoryKidneyStones"
                                name="familyHistoryKidneyStones"
                                value={formData.familyHistoryKidneyStones}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="no">No</option>
                                <option value="extended">Yes, extended family</option>
                                <option value="immediate">Yes, immediate family</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="previousKidneyStones">Previous Kidney Stones</label>
                            <select
                                id="previousKidneyStones"
                                name="previousKidneyStones"
                                value={formData.previousKidneyStones}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="no">No</option>
                                <option value="one">Yes, one occurrence</option>
                                <option value="multiple">Yes, multiple occurrences</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="gestationalDiabetes">For Women - History of Gestational Diabetes</label>
                            <select
                                id="gestationalDiabetes"
                                name="gestationalDiabetes"
                                value={formData.gestationalDiabetes}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="not_applicable">Not applicable</option>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Symptoms Section */}
                <div className="form-section">
                    <h3 className="text-xl font-semibold mb-4">Symptoms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="frequentUrination">Frequent Urination</label>
                            <select
                                id="frequentUrination"
                                name="frequentUrination"
                                value={formData.frequentUrination}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="no">No</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                                <option value="very_frequently">Very frequently</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="unexplainedThirst">Unexplained Thirst</label>
                            <select
                                id="unexplainedThirst"
                                name="unexplainedThirst"
                                value={formData.unexplainedThirst}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="no">No</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                                <option value="very_frequently">Very frequently</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="unexplainedWeightLoss">Unexplained Weight Loss</label>
                            <select
                                id="unexplainedWeightLoss"
                                name="unexplainedWeightLoss"
                                value={formData.unexplainedWeightLoss}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="no">No</option>
                                <option value="slight">Yes (slight)</option>
                                <option value="significant">Yes (significant)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="chestPain">Chest Pain or Discomfort</label>
                            <select
                                id="chestPain"
                                name="chestPain"
                                value={formData.chestPain}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="never">Never</option>
                                <option value="rarely">Rarely</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="shortnessOfBreath">Shortness of Breath During Normal Activities</label>
                            <select
                                id="shortnessOfBreath"
                                name="shortnessOfBreath"
                                value={formData.shortnessOfBreath}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="never">Never</option>
                                <option value="rarely">Rarely</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="fatigue">Fatigue</label>
                            <select
                                id="fatigue"
                                name="fatigue"
                                value={formData.fatigue}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="never">Never</option>
                                <option value="rarely">Rarely</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="backFlankPain">Back or Flank Pain</label>
                            <select
                                id="backFlankPain"
                                name="backFlankPain"
                                value={formData.backFlankPain}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="never">Never</option>
                                <option value="rarely">Rarely</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="painfulUrination">Painful Urination</label>
                            <select
                                id="painfulUrination"
                                name="painfulUrination"
                                value={formData.painfulUrination}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="never">Never</option>
                                <option value="rarely">Rarely</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bloodInUrine">Blood in Urine</label>
                            <select
                                id="bloodInUrine"
                                name="bloodInUrine"
                                value={formData.bloodInUrine}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="never">Never</option>
                                <option value="rarely">Rarely</option>
                                <option value="occasionally">Occasionally</option>
                                <option value="frequently">Frequently</option>
                            </select>
                        </div>
                    </div>{/* Environmental Factors Section */}
                    <div className="form-group">
                        <label htmlFor="environmentalExposure">Environmental Exposure to Pollutants</label>
                        <select
                            id="environmentalExposure"
                            name="environmentalExposure"
                            value={formData.environmentalExposure}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="low">Low</option>
                            <option value="moderate">Moderate</option>
                            <option value="high">High</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-button ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
            </form>
            </div>
        </div>
    );
};

export default HealthForm;