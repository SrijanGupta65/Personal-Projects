# CLAUDE.md

# Project Name

AI Pharmaseutical bio informationcs

## Project Goal

This project is an AI-powered nursing and pharmaceutical informatics prototype. The goal is to use patient medical history, current diagnosis, vital signs and symptoms, to develop personalized medication plan for each patient. 

The system is designed to help healthcare workers and pharmacy professionals make faster and more informed decisions by comparing each patient with medically similar cases. It aims to reduce the risk of harmful side effects caused by overmedication.

This project should be treated as a clinical decision-support prototype, not a real medical prescribing tool.

## Dataset Columns

This prototype uses synthetic data.

### Patient Identification

- `Patient_ID`: Unique ID for each patient.
- `Patient_Name`: Synthetic patient name used for readability only.

### Demographic Information

- `Age`: Patient age.
- `Sex`: Patient sex.
- `Weight_kg`: Patient weight in kilograms.

### Medical Condition Information

- `Primary_Illness`: The main illness or condition for the patient.
- `Symptoms`: The patient’s reported or observed symptoms.
- `Medical_History`: Past health conditions that may affect treatment decisions.
- `Consciousness_Orientation`: Patient alertness or orientation level.

### Vital Signs and Clinical Measurements

- `Temperature_C`: Patient body temperature in Celsius.
- `Heart_Rate_bpm`: Heart rate in beats per minute.
- `Systolic_BP_mmHg`: Systolic blood pressure.
- `Diastolic_BP_mmHg`: Diastolic blood pressure.
- `SpO2_percent`: Blood oxygen saturation percentage.
- `Respiratory_Rate_bpm`: Breaths per minute.
- `eGFR_mL_min`: Estimated kidney function.
- `Blood_Glucose_mmol_L`: Blood glucose level.
- `Pain_0_10`: Patient pain level on a 0 to 10 scale.

### Allergy Information

- `Medication_Allergies`: Medication allergies that may affect treatment options.
- `Food_Other_Allergies`: Food or other allergies.

### Treatment Support Information

- `Treatment_Impact_Notes`: Notes about how the patient’s condition, history, or vitals may affect treatment planning.
- `Medication_Dosage_Fixed_Period`: Synthetic medication and dosage information over a fixed period.
- `Medication_Reasoning`: Explanation of why the medication or dosage may be considered.



## Folder Structure

### data/

Stores all project datasets.

### data/raw/

Stores original datasets. Do not edit or overwrite files in this folder.

Examples:

- original patient CSV files
- synthetic patient data
- downloaded sample datasets

### data/processed/

Stores cleaned and transformed datasets.

Examples:

- cleaned patient data
- scaled vital signs
- text embeddings
- clustered patient data
- final model-ready datasets

### docs/

Stores project planning and task-specific documentation.

Use this folder so Claude does not need to read the entire codebase every time.

Expected files:

- `PROJECT_OVERVIEW.md`: detailed explanation of the project idea
- `DATA_PIPELINE.md`: how patient data should be loaded, cleaned, and processed
- `CLUSTERING_PLAN.md`: how similar patients should be grouped
- `DOSAGE_SUPPORT_PLAN.md`: how dosage-support logic should be designed
- `MODEL_LIMITATIONS.md`: safety limits and ethical concerns
- `README_PLAN.md`: GitHub README structure

### src/

Stores reusable Python source code.


### notebooks/

Stores exploratory notebooks only.

Use notebooks for testing ideas, experimenting with clustering, and visualizing data. Final reusable code should go in `src/`.

Expected notebooks:

- `01_data_exploration.ipynb`
- `02_clustering_experiments.ipynb`
- `03_similarity_testing.ipynb`
- `04_dosage_support_testing.ipynb`

### outputs/

Stores generated results.

## Coding Rules

- Keep code modular and readable.
- Use clear function names.
- Use docstrings for important functions.
- Avoid writing everything in one giant script.
- Do not overwrite raw data.
- Make the project runnable from `main.py`.