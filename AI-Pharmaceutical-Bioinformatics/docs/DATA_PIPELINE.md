# Data Pipeline

## Overview

The data pipeline transforms raw patient data into a normalized, analysis-ready format. It includes loading, validation, cleaning, normalization, and feature encoding.

## Pipeline Stages

### 1. Load (`data_loader.py`)

- **Input**: Raw CSV files in `data/raw/`
- **Function**: `load_patient_data(filepath)`
- **Output**: Pandas DataFrame with raw records

### 2. Validate

- **Function**: `validate_patient_data(df)`
- **Checks**:
  - All required columns present
  - Data types correct
  - Value ranges reasonable (e.g., age 0-120, SpO2 0-100)
  - No completely empty rows

### 3. Handle Missing Values (`data_processor.py`)

- **Function**: `handle_missing_values(df, strategy)`
- **Options**:
  - `drop`: Remove rows with missing values
  - `mean`/`median`: Fill numeric columns with central tendency
  - Custom: Domain-specific imputation
- **Rules**:
  - Never drop critical identifiers (Patient_ID)
  - Document imputation decisions for clinical review

### 4. Normalize Vital Signs

- **Function**: `normalize_vital_signs(df)`
- **Process**:
  - Scale vital signs to standard ranges (e.g., blood pressure 0-1)
  - Handle outliers appropriately
  - Document normalization parameters for reproducibility

### 5. Scale Features

- **Function**: `scale_features(df, exclude_cols)`
- **Method**: Standardization or min-max scaling
- **Exclude**: Patient_ID, names, categorical labels

### 6. Encode Categorical Features

- **Function**: `process_categorical_features(df)`
- **Encoding**:
  - One-hot encoding for nominal features (Sex, Primary_Illness)
  - Ordinal encoding where order matters (Consciousness_Orientation)
  - Vectorize text fields (Symptoms, Medical_History) if needed

## Output

- **Location**: `data/processed/`
- **Format**: CSV or pickle
- **Content**: Cleaned, normalized, and encoded patient records ready for clustering

## Reproducibility

- Store normalization parameters (mean, std, min, max) for future transformations
- Document all preprocessing decisions in this file
- Keep a data transformation log
