# Define mappings between API numerical inputs and model string inputs

FEATURE_MAPPINGS = {
    # General mappings
    "Sex": {
        0: "Female",
        1: "Male",
        2: "Other"
    },
    "Smoking status": {
        0: "Never smoked",
        1: "Former smoker",
        2: "Current smoker, light",
        3: "Current smoker, heavy"
    },
    "Alcohol consumption": {
        0: "None",
        1: "Occasional (1-2 drinks/week)",
        2: "Moderate (3-7 drinks/week)",
        3: "Heavy (>7 drinks/week)"
    },
    "Physical activity level": {
        0: "None",
        1: "Low (1-2 days/week)",
        2: "Moderate (3-5 days/week)",
        3: "High (6-7 days/week)"
    },
    "Family history of diabetes": {
        0: "No",
        1: "Yes"
    },
    "Family history of cardiovascular disease": {
        0: "No",
        1: "Yes"
    },
    "Family history of kidney stones": {
        0: "No",
        1: "Yes"
    },
    "Previous kidney stones": {
        0: "No",
        1: "Yes"
    },
    "Fruit and vegetable consumption": {
        0: "Rarely",
        1: "1-2 servings/day",
        2: "3-4 servings/day",
        3: "5+ servings/day"
    },
    "Processed food consumption": {
        0: "Rarely",
        1: "1-3 times/week",
        2: "4-6 times/week",
        3: "Daily"
    },
    "Sleep duration": {
        0: "<5 hours",
        1: "5-6 hours",
        2: "6-7 hours",
        3: "7-8 hours",
        4: "8+ hours"
    },
    "Frequent urination": {
        0: "No",
        1: "Occasionally",
        2: "Frequently",
        3: "Very frequently"
    },
    "Unexplained thirst": {
        0: "No",
        1: "Yes (slight)",
        2: "Yes (significant)"
    },
    "Unexplained weight loss": {
        0: "No",
        1: "Yes (slight)",
        2: "Yes (significant)"
    },
    "Daily water intake": {
        0: "<4 glasses",
        1: "4-6 glasses",
        2: "7-9 glasses",
        3: "10+ glasses"
    },
    "Activity intensity": {
        0: "Low",
        1: "Moderate",
        2: "High"
    },
    "Salt intake": {
        0: "Low",
        1: "Moderate",
        2: "High"
    },
    "Stress levels": {
        0: "Low",
        1: "Moderate",
        2: "High",
        3: "Very high"
    },
    "Chest pain or discomfort": {
        0: "No",
        1: "Occasionally",
        2: "Frequently"
    },
    "Shortness of breath during normal activities": {
        0: "No",
        1: "Occasionally",
        2: "Frequently"
    },
    "Fatigue": {
        0: "No",
        1: "Occasionally",
        2: "Frequently",
        3: "Constantly"
    },
    "Back or flank pain": {
        0: "No",
        1: "Occasionally",
        2: "Frequently"
    },
    "Painful urination": {
        0: "No",
        1: "Occasionally",
        2: "Frequently"
    },
    "Blood in urine": {
        0: "No",
        1: "Yes, once",
        2: "Yes, multiple times"
    },
    "Red meat consumption": {
        0: "None",
        1: "1-2 times/week",
        2: "3-4 times/week",
        3: "5+ times/week"
    },
    "Added sugar intake": {
        0: "Low",
        1: "Moderate",
        2: "High",
        3: "Very high"
    }
}