# CLAUDE.md

# AI Pharmaceutical Bioinformatics

## Project Goal

This project is an AI-powered nursing and pharmaceutical informatics prototype.

The goal is to use synthetic patient data, including medical history, current diagnosis, vital signs, symptoms, allergies, and kidney function, to create a personalized medication-support plan for each patient.

The system should help healthcare workers and pharmacy professionals make faster and more informed decisions by comparing a patient with medically similar synthetic cases.

This project is a clinical decision-support prototype only. It is not a real medical prescribing tool and should not be treated as medical advice.

## Safety and Ethics Rules

* Do not present outputs as real medical recommendations.
* Do not claim that the system can safely prescribe medication.
* Do not provide real-world dosage advice for actual patients.
* All medication and dosage data should be treated as synthetic or educational.
* Include clear disclaimers in user-facing outputs.
* Avoid overclaiming model accuracy or clinical usefulness.
* Prioritize patient safety, transparency, and explainability.

## Dataset

The project uses synthetic patient data.

### Patient Identification

* `Patient_ID`: Unique ID for each patient.
* `Patient_Name`: Synthetic patient name used for readability only.

### Demographic Information

* `Age`: Patient age.
* `Sex`: Patient sex.
* `Weight_kg`: Patient weight in kilograms.

### Medical Condition Information

* `Primary_Illness`: Main illness or condition.
* `Symptoms`: Reported or observed symptoms.
* `Medical_History`: Past health conditions that may affect treatment support.
* `Consciousness_Orientation`: Patient alertness or orientation level.

### Vital Signs and Clinical Measurements

* `Temperature_C`: Body temperature in Celsius.
* `Heart_Rate_bpm`: Heart rate in beats per minute.
* `Systolic_BP_mmHg`: Systolic blood pressure.
* `Diastolic_BP_mmHg`: Diastolic blood pressure.
* `SpO2_percent`: Blood oxygen saturation percentage.
* `Respiratory_Rate_bpm`: Breaths per minute.
* `eGFR_mL_min`: Estimated kidney function.
* `Blood_Glucose_mmol_L`: Blood glucose level.
* `Pain_0_10`: Pain level from 0 to 10.

### Allergy Information

* `Medication_Allergies`: Medication allergies that may affect treatment options.
* `Food_Other_Allergies`: Food or other allergies.

### Treatment Support Information

* `Treatment_Impact_Notes`: Notes about how the patient’s condition, history, or vitals may affect treatment planning.
* `Medication_Dosage_Fixed_Period`: Synthetic medication and dosage information over a fixed period.
* `Medication_Reasoning`: Explanation of why the medication or dosage may be considered.

## Planned Folder Structure

### `data/`

Stores all project datasets.

### `data/raw/`

Stores original datasets. Do not edit or overwrite files in this folder.

Examples:

* Original patient CSV files
* Synthetic patient data
* Downloaded sample datasets

### `data/processed/`

Stores cleaned and transformed datasets.

Examples:

* Cleaned patient data
* Scaled vital signs
* Text embeddings
* Clustered patient data
* Final model-ready datasets

### `docs/`

Stores project planning and task-specific documentation.

Expected files:

* `PROJECT_OVERVIEW.md`: Detailed explanation of the project idea
* `DATA_PIPELINE.md`: How patient data should be loaded, cleaned, and processed
* `CLUSTERING_PLAN.md`: How similar patients should be grouped
* `DOSAGE_SUPPORT_PLAN.md`: How dosage-support logic should be designed
* `MODEL_LIMITATIONS.md`: Safety limits and ethical concerns
* `README_PLAN.md`: GitHub README structure

### `src/`

Stores reusable Python source code.

### `notebooks/`

Stores exploratory notebooks only.

Use notebooks for testing ideas, experimenting with clustering, and visualizing data. Final reusable code should go in `src/`.

Expected notebooks:

* `01_data_exploration.ipynb`
* `02_clustering_experiments.ipynb`
* `03_similarity_testing.ipynb`
* `04_dosage_support_testing.ipynb`

### `outputs/`

Stores generated results such as charts, clustered datasets, model results, and reports.

## Coding Rules

* Keep code modular and readable.
* Use clear function names.
* Use docstrings for important functions.
* Avoid writing everything in one giant script.
* Do not overwrite raw data.
* Make the project runnable from `retrain.py` (the project entry point).
* Keep the project beginner-friendly and explainable.
* Do not overbuild the project unless asked.
* Prefer simple baseline models before complex models.
* Explain major changes before editing many files.

## Development Workflow for Claude

When starting a new task:

1. Read this `CLAUDE.md` file first.
2. Inspect the current project files before making changes.
3. Briefly summarize the goal of the task.
4. Propose a simple plan before writing code.
5. Make small, organized changes.
6. After coding, explain what changed and how to run it.
7. If a task is related to model training, start with data cleaning and a simple baseline model before trying advanced methods.

## First Implementation Goal

Since this project may start with no code, begin by creating a clean starter structure:

* `retrain.py` (entry point)
* `README.md`
* `requirements.txt`
* `data/raw/`
* `data/processed/`
* `src/`
* `notebooks/`
* `outputs/`
* `docs/`

The first working version should:

1. Load the synthetic patient dataset.
2. Clean and validate the columns.
3. Prepare numeric and text features.
4. Group similar patients using a simple clustering or similarity approach.
5. Output an explainable medication-support summary.
6. Clearly label all results as synthetic and educational.

## Current Status

(Last updated 2026-06-14)

The project currently does one thing end to end: an **illness-classification
workflow** that takes new patient data, prepares it, and retrains an XGBoost
model on the full dataset.

### Files that make up the workflow

* `retrain.py` — project entry point. Set `NEW_DATA_PATH` to a CSV of new
  patients, then run `python retrain.py`. It runs two steps in order:
  (1) adds the new data via `process_new_data()`, then (2) retrains via
  `train_and_save()`.
* `src/data_preparation.py` — all data prep. `process_new_data(csv_path)`
  validates the CSV columns, keeps only new patients (by `Patient_ID`), embeds
  their symptoms with SentenceTransformer (`all-MiniLM-L6-v2`), and appends the
  rows to BOTH the raw `.xlsx` and the processed `.csv`. Run with no arg for a
  full rebuild. Also defines the shared column/path constants the other files
  import (`VITAL_COLS`, `LABEL_COL`, `PROCESSED_DATA_PATH`).
* `notebooks/02_illness_classification.ipynb` — reads the processed CSV, tunes
  XGBoost hyperparameters, and saves the best ones to
  `model_params/illness_classifier_hyperparameters.json`. Only re-run this when
  you want to re-tune.
* `src/illness_classifier.py` — reads the params JSON, retrains the final model,
  and saves a **versioned run**: each run writes its own timestamped folder
  `outputs/illness_classifier/<YYYY-MM-DD_HHMM>/` containing `model.json`,
  `labels.json`, and `metrics.json` (test accuracy, CV accuracy, params,
  train/test sizes, and training date/time). Past runs are never overwritten.

### Key conventions

* Classes with fewer than `MIN_PER_CLASS = 10` patients are dropped before
  training (kept consistent between the notebook and `illness_classifier.py`).
* Run scripts with the project venv, e.g. `./venv/bin/python retrain.py`.
* Open design questions are tracked in `docs/concern.md` (e.g. what to do if
  retraining lowers accuracy; when to also re-tune hyperparameters).

### Not built yet (future ideas, not started)

* **Inference/prediction script** — load a saved run and predict an illness for
  a new patient. Parked; design still being thought through.
* **Retrain threshold** — only retrain once N new patients have accumulated
  (threshold not chosen yet; intentionally not a small number).
* **AWS** — trigger the workflow from an S3 upload. Note: sentence-transformers
  + PyTorch is too big for a default Lambda; plan for container Lambda / Batch /
  EC2 / SageMaker.
