
from src.illness_classifier import train_and_save

# Training now reads all patients straight from the Postgres database.
# New patients are added separately (by the input interface, or by
# scripts/load_csv_to_db.py) -- this script just (re)trains on what's in the DB.


def main():
    """Train the model on the current patients in the database."""

    print("\nSTEP 1/1: Training the model...", flush=True)
    train_and_save()

    print("\nDone.", flush=True)


if __name__ == "__main__":
    main()
