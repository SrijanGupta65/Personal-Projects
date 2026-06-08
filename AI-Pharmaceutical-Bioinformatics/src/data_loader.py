"""
Load and validate patient data from CSV files.
"""

import pandas as pd
from pathlib import Path


def load_patient_data(filepath: str) -> pd.DataFrame:
    """
    Load patient data from CSV file.

    Args:
        filepath: Path to patient CSV file

    Returns:
        DataFrame with patient records
    """
    pass


def validate_patient_data(df: pd.DataFrame) -> bool:
    """
    Validate that patient data has required columns and reasonable values.

    Args:
        df: Patient DataFrame

    Returns:
        True if valid, raises exception otherwise
    """
    pass
