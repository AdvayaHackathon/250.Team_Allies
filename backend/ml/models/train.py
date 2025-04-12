import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
import pickle
import logging

# Set up proper path resolution
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(backend_dir)  # Add backend directory to system path

# Initialize logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import from config
try:
    from ml.config import (DIABETES_FEATURES, CARDIOVASCULAR_FEATURES, KIDNEY_STONE_FEATURES, 
                         DATASET_PATH, MODELS_DIR, FEATURE_MAPPINGS)
    
    # Make sure directories exist
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
    
    logger.info(f"Successfully imported configuration from config.py")
    logger.info(f"Models directory set to: {MODELS_DIR}")
    logger.info(f"Dataset path set to: {DATASET_PATH}")
except ImportError as e:
    logger.error(f"Could not import from config.py: {str(e)}")
    raise

def calculate_bmi(height, weight):
    """Calculate BMI from height (cm) and weight (kg)"""
    try:
        height_m = float(height) / 100
        weight_kg = float(weight)
        if height_m <= 0:
            return np.nan
        return weight_kg / (height_m ** 2)
    except (ZeroDivisionError, TypeError):
        return np.nan

def preprocess_dataset(df):
    """Preprocess the dataset with improved error handling and missing value treatment"""
    # Make a copy to avoid changing the original
    df = df.copy()
    
    # Clean column names (remove whitespace)
    df.columns = df.columns.str.strip()
    
    # Apply feature mappings for categorical features
    for feature, mapping in FEATURE_MAPPINGS.items():
        if feature in df.columns:
            # Create a temporary series to handle the mapping
            mapped_series = pd.Series(index=df.index, dtype=float)
            
            for i, value in enumerate(df[feature]):
                if isinstance(value, str) and value in mapping:
                    mapped_series.iloc[i] = mapping[value]
                elif pd.notna(value):
                    # For numeric values, check if they're already valid mapping keys
                    try:
                        numeric_val = float(value)
                        if numeric_val in mapping.values():
                            mapped_series.iloc[i] = numeric_val
                        else:
                            mapped_series.iloc[i] = 0  # Default if not found
                    except (ValueError, TypeError):
                        mapped_series.iloc[i] = 0  # Default for invalid values
                else:
                    mapped_series.iloc[i] = np.nan
                    
            df[feature] = mapped_series
    
    # Calculate BMI if not present but height and weight are
    if 'BMI' not in df.columns and 'Height' in df.columns and 'Weight' in df.columns:
        df['BMI'] = df.apply(lambda row: calculate_bmi(row['Height'], row['Weight']), axis=1)
    
    # Convert columns to appropriate numeric types
    for col in df.columns:
        if col not in df.select_dtypes(include=['number']).columns:
            # Try converting to numeric
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Fill remaining NaN values with column median for numeric columns
    for col in df.select_dtypes(include=['number']).columns:
        median_val = df[col].median()
        if pd.isna(median_val):  # If median is NaN, use 0
            median_val = 0
        df[col] = df[col].fillna(median_val)
    
    # Fill any remaining NaNs with 0
    df = df.fillna(0)
    
    return df

def create_preprocessor(numerical_features, categorical_features):
    """Create preprocessing pipeline with improved handling for missing values"""
    # For numerical features, first impute missing values then scale
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # For categorical features, first impute then one-hot encode
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value=0)),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough')
    
    return preprocessor

def create_target_variable(df):
    """Create target variables with improved balancing"""
    # Create diabetes risk target with balanced classes
    diabetes_risk = (
        ((df['BMI'] > 28) & (df['Age'] > 40)) |
        ((df['Family history of diabetes'] > 0) & (df['Age'] > 35)) |
        (df['Frequent urination'] >= 2) |
        (df['Unexplained thirst'] >= 1) |
        (df['Unexplained weight loss'] >= 2)
    )
    
    # Create cardiovascular risk target with balanced classes
    cardiovascular_risk = (
        ((df['Age'] > 50) & (df['Smoking status'] >= 3)) |
        ((df['Family history of cardiovascular disease'] > 0) & (df['Age'] > 45)) |
        ((df['Physical activity level'] <= 1) & (df['Age'] > 50) & (df['BMI'] > 28)) |
        ((df['Chest pain or discomfort'] > 0) & (df['Shortness of breath during normal activities'] > 0))
    )
    
    # Create kidney stone risk target with balanced classes
    kidney_stone_risk = (
        (df['Daily water intake'] <= 1) |
        (df['Previous kidney stones'] > 0) |
        ((df['Family history of kidney stones'] > 0) & (df['Age'] > 40)) |
        ((df['Back or flank pain'] > 0) & (df['Painful urination'] > 0))
    )
    
    return (diabetes_risk.astype(int), 
            cardiovascular_risk.astype(int), 
            kidney_stone_risk.astype(int))

def check_class_balance(y, label):
    """Check if target variable has both classes represented"""
    unique_values = np.unique(y)
    if len(unique_values) < 2:
        logger.warning(f"{label} target only has class {unique_values[0]}! Model training will fail.")
        return False
    
    # Log class distribution
    class_count = np.bincount(y)
    class_ratio = class_count[1] / len(y)
    logger.info(f"{label} class distribution - Class 0: {class_count[0]}, Class 1: {class_count[1]} (ratio: {class_ratio:.2f})")
    
    # Check if classes are extremely imbalanced
    if class_ratio < 0.1 or class_ratio > 0.9:
        logger.warning(f"{label} classes are highly imbalanced!")
        return False
        
    return True

def train_models():
    """Train all disease prediction models with improved robustness"""
    logger.info("Starting model training process")

    # Load data
    try:
        df = pd.read_csv(DATASET_PATH)
        logger.info(f"Successfully loaded dataset with {len(df)} records and {len(df.columns)} columns")
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        raise

    # Preprocess data
    df = preprocess_dataset(df)
    logger.info("Data preprocessing completed")

    # Store models and evaluation reports
    models = {}
    reports = {}

    # Split the data
    train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
    logger.info(f"Data split: {len(train_df)} training records, {len(test_df)} testing records")

    # Create all target variables before training
    diabetes_target_train, cardio_target_train, kidney_target_train = create_target_variable(train_df)
    diabetes_target_test, cardio_target_test, kidney_target_test = create_target_variable(test_df)
    
    # Check class balance for all target variables
    diabetes_balanced = check_class_balance(diabetes_target_train, "Diabetes")
    cardio_balanced = check_class_balance(cardio_target_train, "Cardiovascular")
    kidney_balanced = check_class_balance(kidney_target_train, "Kidney Stone")

    # ========== Diabetes Model ==========
    if diabetes_balanced:
        logger.info("Training diabetes model...")
        
        # Ensure all required features are present in the dataframe
        missing_features = [f for f in DIABETES_FEATURES if f not in train_df.columns]
        if missing_features:
            logger.warning(f"Missing diabetes features: {missing_features}")
            for f in missing_features:
                train_df[f] = 0
                test_df[f] = 0
        
        # Prepare features
        X_diabetes_train = train_df[DIABETES_FEATURES].copy()
        X_diabetes_test = test_df[DIABETES_FEATURES].copy()
        
        # Identify numeric and categorical columns based on actual data types
        diabetes_num = X_diabetes_train.select_dtypes(include=['number']).columns.tolist()
        diabetes_cat = [f for f in DIABETES_FEATURES if f not in diabetes_num]
        
        # Create preprocessor and pipeline
        diabetes_preprocessor = create_preprocessor(diabetes_num, diabetes_cat)
        diabetes_model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42, C=1.0)
        
        # Create and train the complete pipeline
        diabetes_pipeline = Pipeline([
            ('preprocessor', diabetes_preprocessor),
            ('classifier', diabetes_model)
        ])
        
        diabetes_pipeline.fit(X_diabetes_train, diabetes_target_train)
        
        # Evaluate
        y_pred = diabetes_pipeline.predict(X_diabetes_test)
        accuracy = accuracy_score(diabetes_target_test, y_pred)
        
        # Calculate AUC for better evaluation
        try:
            y_prob = diabetes_pipeline.predict_proba(X_diabetes_test)[:, 1]
            auc = roc_auc_score(diabetes_target_test, y_prob)
            logger.info(f"Diabetes Model AUC: {auc:.3f}")
        except Exception as e:
            logger.warning(f"Could not calculate AUC for diabetes model: {str(e)}")
            
        reports['diabetes'] = classification_report(diabetes_target_test, y_pred)
        logger.info(f"Diabetes Model Test Accuracy: {accuracy:.3f}")
        
        models['diabetes'] = diabetes_pipeline
    else:
        logger.warning("Skipping diabetes model training due to class imbalance")
        models['diabetes'] = None
        reports['diabetes'] = "Training skipped - insufficient class balance"

    # ========== Cardiovascular Model ==========
    if cardio_balanced:
        logger.info("Training cardiovascular model...")
        
        # Ensure all required features are present in the dataframe
        missing_features = [f for f in CARDIOVASCULAR_FEATURES if f not in train_df.columns]
        if missing_features:
            logger.warning(f"Missing cardiovascular features: {missing_features}")
            for f in missing_features:
                train_df[f] = 0
                test_df[f] = 0
        
        # Prepare features
        X_cardio_train = train_df[CARDIOVASCULAR_FEATURES].copy()
        X_cardio_test = test_df[CARDIOVASCULAR_FEATURES].copy()
        
        # Identify numeric and categorical columns based on actual data types
        cardio_num = X_cardio_train.select_dtypes(include=['number']).columns.tolist()
        cardio_cat = [f for f in CARDIOVASCULAR_FEATURES if f not in cardio_num]
        
        # Create preprocessor and pipeline
        cardio_preprocessor = create_preprocessor(cardio_num, cardio_cat)
        cardio_model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42, C=1.0)
        
        # Create and train the complete pipeline
        cardio_pipeline = Pipeline([
            ('preprocessor', cardio_preprocessor),
            ('classifier', cardio_model)
        ])
        
        cardio_pipeline.fit(X_cardio_train, cardio_target_train)
        
        # Evaluate
        y_pred = cardio_pipeline.predict(X_cardio_test)
        accuracy = accuracy_score(cardio_target_test, y_pred)
        
        # Calculate AUC for better evaluation
        try:
            y_prob = cardio_pipeline.predict_proba(X_cardio_test)[:, 1]
            auc = roc_auc_score(cardio_target_test, y_prob)
            logger.info(f"Cardiovascular Model AUC: {auc:.3f}")
        except Exception as e:
            logger.warning(f"Could not calculate AUC for cardiovascular model: {str(e)}")
            
        reports['cardiovascular'] = classification_report(cardio_target_test, y_pred)
        logger.info(f"Cardiovascular Model Test Accuracy: {accuracy:.3f}")
        
        models['cardiovascular'] = cardio_pipeline
    else:
        logger.warning("Skipping cardiovascular model training due to class imbalance")
        models['cardiovascular'] = None
        reports['cardiovascular'] = "Training skipped - insufficient class balance"

    # ========== Kidney Stone Model ==========
    if kidney_balanced:
        logger.info("Training kidney stone model...")
        
        # Ensure all required features are present in the dataframe
        missing_features = [f for f in KIDNEY_STONE_FEATURES if f not in train_df.columns]
        if missing_features:
            logger.warning(f"Missing kidney stone features: {missing_features}")
            for f in missing_features:
                train_df[f] = 0
                test_df[f] = 0
        
        # Prepare features
        X_kidney_train = train_df[KIDNEY_STONE_FEATURES].copy()
        X_kidney_test = test_df[KIDNEY_STONE_FEATURES].copy()
        
        # Identify numeric and categorical columns based on actual data types
        kidney_num = X_kidney_train.select_dtypes(include=['number']).columns.tolist()
        kidney_cat = [f for f in KIDNEY_STONE_FEATURES if f not in kidney_num]
        
        # Create preprocessor and pipeline
        kidney_preprocessor = create_preprocessor(kidney_num, kidney_cat)
        kidney_model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42, C=1.0)
        
        # Create and train the complete pipeline
        kidney_pipeline = Pipeline([
            ('preprocessor', kidney_preprocessor),
            ('classifier', kidney_model)
        ])
        
        kidney_pipeline.fit(X_kidney_train, kidney_target_train)
        
        # Evaluate
        y_pred = kidney_pipeline.predict(X_kidney_test)
        accuracy = accuracy_score(kidney_target_test, y_pred)
        
        # Calculate AUC for better evaluation
        try:
            y_prob = kidney_pipeline.predict_proba(X_kidney_test)[:, 1]
            auc = roc_auc_score(kidney_target_test, y_prob)
            logger.info(f"Kidney Stone Model AUC: {auc:.3f}")
        except Exception as e:
            logger.warning(f"Could not calculate AUC for kidney stone model: {str(e)}")
            
        reports['kidney_stone'] = classification_report(kidney_target_test, y_pred)
        logger.info(f"Kidney Stone Model Test Accuracy: {accuracy:.3f}")
        
        models['kidney_stone'] = kidney_pipeline
    else:
        logger.warning("Skipping kidney stone model training due to class imbalance")
        models['kidney_stone'] = None
        reports['kidney_stone'] = "Training skipped - insufficient class balance"

    # Save all models and reports
    try:
        os.makedirs(MODELS_DIR, exist_ok=True)
        for name, model in models.items():
            if model is not None:
                with open(os.path.join(MODELS_DIR, f"{name}_model.pkl"), "wb") as f:
                    pickle.dump(model, f)
                with open(os.path.join(MODELS_DIR, f"{name}_report.txt"), "w") as f:
                    f.write(reports[name])
                logger.info(f"Model {name} saved to {MODELS_DIR}")
            else:
                logger.warning(f"Model {name} was not trained and will not be saved")
        logger.info(f"All successful models saved to {MODELS_DIR}")
    except Exception as e:
        logger.error(f"Error saving models: {str(e)}")

    return models, reports

if __name__ == "__main__":
    train_models()