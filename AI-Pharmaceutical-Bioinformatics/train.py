
from src.illness_classifier import train_and_save

# --- EDIT THIS: path to the CSV of new patients you want to add ---
NEW_DATA_PATH = "data/raw/nurseassist_patient_dataset_structured_drug_dose.csv"


def main():
    """Add the new patient CSV to the dataset, then retrain the model."""

    print("\nSTEP 1/1: Training the model...", flush=True)
    train_and_save()

    print("\nDone.", flush=True)


if __name__ == "__main__":
    main()
