"""
Entry point for retraining the model on new patient data.

Set NEW_DATA_PATH below to the CSV of new patients you want to add, then run:

    python retrain.py

It runs two steps in order:

  STEP 1 - Add the new data. process_new_data():
    1. Checks the CSV's columns exactly match the required structure.
    2. Keeps only genuinely new patients (by Patient_ID, so re-running is safe).
    3. Embeds the new rows' symptoms with SentenceTransformer.
    4. Appends them to BOTH the raw .xlsx and the processed .csv.

  STEP 2 - Retrain the model. train_and_save():
    Reads the now-updated processed .csv, retrains the model, and saves it to a
    new timestamped run folder under outputs/ (past runs are never overwritten).

All data here is synthetic and for educational use only. It is not medical
advice and must not be used for real prescribing.
"""

from src.data_preparation import process_new_data
from src.illness_classifier import train_and_save

# --- EDIT THIS: path to the CSV of new patients you want to add ---
NEW_DATA_PATH = "data/raw/new_rows.csv"


def main():
    """Add the new patient CSV to the dataset, then retrain the model."""
    # Step 1: add the new data to the raw + processed files.
    process_new_data(NEW_DATA_PATH)

    # Step 2: retrain on the updated processed file and save a new run.
    train_and_save()


if __name__ == "__main__":
    main()
