"""
One-time loader: read the raw patient CSV and put every patient into Postgres.

Run it once after the database is up to seed the table from your existing data:

    ./venv/bin/python scripts/load_csv_to_db.py
    # or load a specific file:
    ./venv/bin/python scripts/load_csv_to_db.py data/raw/some_other_file.csv

It is safe to re-run: patients already in the table are skipped (not re-embedded).

All data is synthetic and for educational use only. Not medical advice.
"""

import sys
from pathlib import Path

import pandas as pd

# Make the project root importable so "from src ..." works when run directly.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src import patient_store
from src.data_preparation import RAW_DATA_PATH


def main(csv_path=None) -> None:
    path = Path(csv_path) if csv_path else RAW_DATA_PATH
    df = pd.read_csv(path)
    print(f"Read {len(df)} rows from {path}")

    inserted = patient_store.add_patients(df)
    print(f"Done. {inserted} new patient(s) added; the rest already existed.")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
