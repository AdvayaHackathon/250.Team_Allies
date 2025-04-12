DIABETES_FEATURES = [
    "Age", "Sex", "Height", "Weight", "BMI", "Physical activity level", 
    "Smoking status", "Alcohol consumption", "Sleep duration", 
    "Fruit and vegetable consumption", "Processed food consumption", 
    "Added sugar intake", "Family history of diabetes", 
    "Frequent urination", "Unexplained thirst", "Unexplained weight loss"
]

CARDIOVASCULAR_FEATURES = [
    "Age", "Sex", "Height", "Weight", "BMI", "Physical activity level", 
    "Smoking status", "Alcohol consumption", 
    "Chest pain or discomfort", "Shortness of breath during normal activities", 
    "Fatigue", "Stress levels", "Salt intake", "Activity intensity", 
    "Family history of cardiovascular disease"
]

KIDNEY_STONE_FEATURES = [
    "Age", "Sex", "Weight", "Height", "Daily water intake", 
    "Salt intake", "Red meat consumption", "Family history of kidney stones",
    "Previous kidney stones", "Back or flank pain", 
    "Painful urination", "Blood in urine"
]


FEATURE_MAPPINGS = {
    "Sex": {"Male": 0, "Female": 1, "Other": 2, "default": 0},
    "Physical activity level": {
        "None": 0,
        "Light (1-2 days/week)": 1,
        "Moderate (3-5 days/week)": 2,
        "High (6-7 days/week)": 3,
        "default": 1
    },
    "Smoking status": {
        "Never smoked": 0,
        "Former smoker (quit >1 year ago)": 1,
        "Former smoker (quit <1 year ago)": 2,
        "Current smoker (occasional)": 3,
        "Current smoker (daily)": 4,
        "default": 0
    },
    "Alcohol consumption": {
        "None": 0,
        "Occasional (1-2 drinks/week)": 1,
        "Moderate (3-7 drinks/week)": 2,
        "Heavy (>7 drinks/week)": 3,
        "default": 0
    },
    "Fruit and vegetable consumption": {
        "Less than 1 serving/day": 0,
        "1-2 servings/day": 1,
        "3-4 servings/day": 2,
        "5+ servings/day": 3,
        "default": 1
    },
    "Processed food consumption": {
        "Rarely": 0,
        "1-3 times/week": 1,
        "4-6 times/week": 2,
        "Daily": 3,
        "default": 1
    },
    "Added sugar intake": {
        "Low": 0,
        "Moderate": 1,
        "High": 2,
        "default": 1
    },
    "Daily water intake": {
        "<4 glasses": 0,
        "4-6 glasses": 1,
        "7-8 glasses": 2,
        ">8 glasses": 3,
        "default": 1
    },
    "Family history of diabetes": {
        "No": 0,
        "Yes (one parent)": 1,
        "Yes (both parents)": 2,
        "Yes (siblings)": 1,
        "Yes (extended family)": 1,
        "default": 0
    },
    "Family history of cardiovascular disease": {
        "No": 0,
        "Yes (one parent)": 1,
        "Yes (both parents)": 2,
        "Yes (siblings)": 1,
        "Yes (extended family)": 1,
        "default": 0
    },
    "Family history of kidney stones": {
        "No": 0,
        "Yes (immediate family)": 1,
        "Yes (extended family)": 1,
        "default": 0
    },
    "Frequent urination": {
        "No": 0,
        "Occasionally": 1,
        "Frequently": 2,
        "Very frequently": 3,
        "default": 0
    },
    "Unexplained thirst": {
        "No": 0,
        "Yes (slight)": 1,
        "Yes (significant)": 2,
        "default": 0
    },
    "Unexplained weight loss": {
        "No": 0,
        "Yes (less than 5% of body weight)": 1,
        "Yes (5-10% of body weight)": 2,
        "Yes (more than 10% of body weight)": 3,
        "default": 0
    },
    "Previous kidney stones": {
        "No": 0,
        "Yes (once)": 1,
        "Yes (multiple times)": 2,
        "default": 0
    },
    "Chest pain or discomfort": {
        "No": 0,
        "Rarely": 1,
        "Occasionally": 2,
        "Frequently": 3,
        "default": 0
    },
    "Shortness of breath during normal activities": {
        "No": 0,
        "Mild": 1,
        "Moderate": 2,
        "Severe": 3,
        "default": 0
    },
    "Fatigue": {
        "None": 0,
        "Mild": 1,
        "Moderate": 2,
        "Severe": 3,
        "default": 0
    },
    "Stress levels": {
        "Low": 0,
        "Moderate": 1,
        "High": 2,
        "Very high": 3,
        "default": 1
    },
    "Salt intake": {
        "Low": 0,
        "Moderate": 1,
        "High": 2,
        "default": 1
    },
    "Activity intensity": {
        "Low": 0,
        "Moderate": 1,
        "High": 2,
        "Very high": 3,
        "default": 1
    },
    "Red meat consumption": {
        "Rarely": 0,
        "1-2 times/week": 1,
        "3-4 times/week": 2,
        "5+ times/week": 3,
        "default": 1
    },
    "Back or flank pain": {
        "No": 0,
        "Mild": 1,
        "Moderate": 2,
        "Severe": 3,
        "default": 0
    },
    "Painful urination": {
        "No": 0,
        "Mild": 1,
        "Moderate": 2,
        "Severe": 3,
        "default": 0
    },
    "Blood in urine": {
        "No": 0,
        "Yes": 1,
        "default": 0
    },
    "Sleep duration": {
        "<6 hours": 0,
        "6-7 hours": 1,
        "7-8 hours": 2,
        ">8 hours": 3,
        "default": 1
    }
}


NUMERIC_DEFAULTS = {
    "Age": 35,
    "Height": 170,
    "Weight": 70,
    "BMI": 24.5,
}

VALUE_RANGES = {
    "Age": (0, 120),
    "Height": (50, 250),  
    "Weight": (20, 300),  
    "BMI": (10, 60),
    "Sleep duration": (0, 24)  
}

BOOLEAN_FEATURES = [
    "Blood in urine"
]

DATASET_PATH = 'data/risk_assessment_sample_dataset.csv'
MODELS_DIR = 'models/saved/'

def get_default_mapping(feature):
    """Get default numeric value for a categorical feature"""
    if feature in FEATURE_MAPPINGS:
        return FEATURE_MAPPINGS[feature].get("default", 0)
    return 0

def get_numeric_default(feature):
    """Get default value for a numeric feature"""
    return NUMERIC_DEFAULTS.get(feature, 0)

def get_value_range(feature):
    """Get valid range for a numeric feature"""
    return VALUE_RANGES.get(feature, (0, float('inf')))

def is_valid_value(feature, value):
    """Check if a value is within valid range"""
    if feature in VALUE_RANGES:
        min_val, max_val = VALUE_RANGES[feature]
        try:
            num_val = float(value)
            return min_val <= num_val <= max_val
        except (ValueError, TypeError):
            return False
    return True