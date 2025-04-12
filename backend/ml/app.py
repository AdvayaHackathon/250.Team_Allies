# Import necessary libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import logging
import os
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the parent directory to the path to ensure imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
sys.path.append(current_dir)

try:
    from models.predict import predict_risk_direct, load_models, FEATURES
    logger.info("Successfully imported prediction modules")
except ImportError as e:
    logger.error(f"Failed to import prediction modules: {e}")
    raise

app = Flask(__name__)
CORS(app)

# Root route to avoid 404 on "/"
@app.route('/')
def home():
    return "Welcome to the Health Risk Prediction API! Use POST /assess_risk or GET /get_required_fields."

# API endpoint for risk assessment
@app.route('/assess_risk', methods=['POST'])
def assess_risk():
    user_data = request.json
    logger.info(f"Received request at /assess_risk")
    logger.info(f"Request data: {user_data}")

    try:
        # Try to load models first
        load_models()
        
        # Get prediction results
        results = predict_risk_direct(user_data)
        logger.info(f"Prediction results: {results}")
        
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        logger.error(f"Error in risk assessment: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# API endpoint to get required fields for assessment
@app.route('/get_required_fields', methods=['GET'])
def get_required_fields():
    try:
        # Return all features needed for assessments
        all_features = {}
        for disease, features in FEATURES.items():
            all_features[disease] = features
            
        return jsonify({
            'success': True,
            'required_fields': all_features
        })
    except Exception as e:
        logger.error(f"Error fetching required fields: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Load models if they exist
    try:
        load_models()
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.warning(f"Error loading models: {str(e)}")
        logger.info("Will attempt to load models when needed")

    # Run the Flask development server
    app.run(debug=True)