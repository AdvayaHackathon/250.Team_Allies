from config import DIABETES_FEATURES, CARDIOVASCULAR_FEATURES, KIDNEY_STONE_FEATURES

def get_all_features():
    """
    Get all unique features required for all disease models

    Returns:
        list: List of all unique feature names, excluding BMI (which is calculated)
    """
    all_features = list(set(DIABETES_FEATURES + CARDIOVASCULAR_FEATURES + KIDNEY_STONE_FEATURES))

    # Remove BMI as it's calculated from height and weight
    if 'BMI' in all_features:
        all_features.remove('BMI')

    return sorted(all_features)