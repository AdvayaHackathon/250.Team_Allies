
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

def calculate_bmi(height_cm, weight_kg):
    """
    Calculate BMI from height in cm and weight in kg
    
    Args:
        height_cm (float): Height in centimeters
        weight_kg (float): Weight in kilograms
    
    Returns:
        float: Body Mass Index (BMI)
    """
    height_m = float(height_cm) / 100
    return float(weight_kg) / (height_m * height_m)

def create_preprocessor(numerical_features, categorical_features):
    """
    Create a preprocessing pipeline for numerical and categorical features
    
    Args:
        numerical_features (list): List of numerical feature names
        categorical_features (list): List of categorical feature names
    
    Returns:
        ColumnTransformer: Scikit-learn preprocessing pipeline
    """
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    return preprocessor