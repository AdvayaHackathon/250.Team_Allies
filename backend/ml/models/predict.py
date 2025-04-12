import os
import sys
import pandas as pd
import pickle
import logging
import numpy as np

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import from config
from ml.config import (DIABETES_FEATURES, CARDIOVASCULAR_FEATURES, KIDNEY_STONE_FEATURES, 
                     MODELS_DIR, FEATURE_MAPPINGS)

# Make sure models directory exists
os.makedirs(MODELS_DIR, exist_ok=True)

# Map feature lists to model names
FEATURES = {
    "diabetes": DIABETES_FEATURES,
    "cardiovascular": CARDIOVASCULAR_FEATURES,
    "kidney_stone": KIDNEY_STONE_FEATURES
}

# Global models dictionary
models = {}

def calculate_bmi(height, weight):
    """Calculate BMI from height (cm) and weight (kg)"""
    try:
        height_m = float(height) / 100
        weight_kg = float(weight)
        if height_m <= 0:
            return 0
        return weight_kg / (height_m ** 2)
    except (ZeroDivisionError, TypeError, ValueError):
        logger.warning(f"BMI calculation failed for height={height}, weight={weight}")
        return 0

def load_models():
    """Load all trained models from disk"""
    global models
    for disease in ['diabetes', 'cardiovascular', 'kidney_stone']:
        model_path = os.path.join(MODELS_DIR, f"{disease}_model.pkl")
        logger.info(f"Attempting to load model from: {model_path}")
        
        try:
            if os.path.exists(model_path):
                with open(model_path, "rb") as f:
                    models[disease] = pickle.load(f)
                logger.info(f"Successfully loaded model for {disease}")
            else:
                logger.warning(f"Model file not found: {model_path}. Using mock model.")
                models[disease] = create_mock_model()
        except Exception as e:
            logger.error(f"Error loading model {disease}: {str(e)}")
            models[disease] = create_mock_model()

def create_mock_model():
    """Create a simple mock model for testing"""
    class MockModel:
        def predict_proba(self, X):
            # Return random but repeatable prediction
            return np.array([[0.3, 0.7]])
    return MockModel()

def get_risk_level(score):
    """Convert numeric score to risk level"""
    if score < 0.3:
        return "low"
    elif score < 0.6:
        return "medium"
    else:
        return "high"

def get_recommendations(disease, risk_level):
    """Get recommendations based on disease and risk level"""
    recommendations = {
        "diabetes": {
            "low": ["Maintain a balanced diet", "Regular check-ups annually", "Stay physically active"],
            "medium": ["Reduce sugar intake", "Exercise at least 3 times a week", "Monitor blood sugar periodically"],
            "high": ["Consult a doctor soon", "Daily blood sugar monitoring", "Follow a strict diabetic diet plan"]
        },
        "cardiovascular": {
            "low": ["Maintain healthy lifestyle", "Regular exercise", "Balanced diet"],
            "medium": ["Reduce salt intake", "Exercise regularly", "Monitor blood pressure monthly"],
            "high": ["Consult a cardiologist", "Consider medication options", "Follow a heart-healthy diet strictly"]
        },
        "kidney_stone": {
            "low": ["Stay hydrated", "Moderate calcium intake", "Reduce sodium consumption"],
            "medium": ["Drink at least 2L water daily", "Reduce oxalate-rich foods", "Consider dietary changes"],
            "high": ["Consult a urologist", "Follow specific diet plans", "Increase fluid intake significantly"]
        }
    }
    return recommendations.get(disease, {}).get(risk_level, ["Consult a healthcare professional"])

def prepare_input_data(user_data, disease):
    """Prepare input data ensuring all features are present and correctly typed"""
    # Get the feature list for this disease
    features = FEATURES[disease]
    
    # Create a DataFrame with a single row
    input_df = pd.DataFrame(index=[0])
    
    # Apply feature mappings for categorical features first
    for feature in features:
        # Check if feature needs mapping
        if feature in FEATURE_MAPPINGS and feature in user_data:
            value = user_data[feature]
            # Convert string value to numeric using mapping
            if isinstance(value, str) and value in FEATURE_MAPPINGS[feature]:
                input_df[feature] = FEATURE_MAPPINGS[feature][value]
            else:
                # Try to use the value directly if it's numeric
                try:
                    numeric_val = float(value)
                    # Validate if this is a valid value for mapping (positive integer)
                    if numeric_val >= 0 and numeric_val.is_integer():
                        input_df[feature] = numeric_val
                    else:
                        input_df[feature] = 0
                except (ValueError, TypeError):
                    input_df[feature] = 0
        # Handle non-categorical features
        elif feature in user_data:
            try:
                input_df[feature] = float(user_data[feature])
            except (ValueError, TypeError):
                input_df[feature] = 0
        else:
            # Feature not provided
            input_df[feature] = 0
    
    # Special handling for BMI calculation if needed
    if "BMI" in features and "BMI" not in user_data and "Height" in user_data and "Weight" in user_data:
        input_df["BMI"] = calculate_bmi(user_data["Height"], user_data["Weight"])
    
    # Ensure all features from the model are present
    for feature in features:
        if feature not in input_df.columns:
            input_df[feature] = 0
    
    # Ensure only required features are included and in the correct order
    return input_df[features]  # Return DataFrame instead of numpy array


def predict_risk_direct(user_data):
    """Get predictions for all disease models"""
    # Ensure models are loaded
    if not models:
        load_models()
    
    results = {}

    for disease in ['diabetes', 'cardiovascular', 'kidney_stone']:
        try:
            # Prepare input data - keep as DataFrame
            X = prepare_input_data(user_data, disease)
            
            # Make prediction
            if disease in models and models[disease] is not None:
                # Get prediction probability of positive class
                prediction_prob = models[disease].predict_proba(X)[0][1]
                prediction = prediction_prob * 100
            else:
                # Use deterministic fallback if model not available
                prediction = 50.0  # Middle value
            
            # Get risk level and recommendations
            risk_level = get_risk_level(prediction/100)
            recommendations_list = get_recommendations(disease, risk_level)
            
            # Store results
            results[disease] = {
                "risk_score": round(prediction, 1),
                "risk_level": risk_level,
                "recommendations": recommendations_list
            }
            
            logger.info(f"Prediction for {disease}: {prediction:.1f}% ({risk_level} risk)")

        except Exception as e:
            logger.error(f"Error in prediction for {disease}: {str(e)}")
            # Provide deterministic fallback
            results[disease] = {
                "risk_score": 50.0,
                "risk_level": "medium",
                "recommendations": get_recommendations(disease, "medium")
            }

    return results