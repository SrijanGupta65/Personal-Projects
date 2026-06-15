"""
Build the illness-classification data file (vitals + symptom embeddings).

Embedding the symptom text with SentenceTransformer is the slow step, so it
lives here instead of in the notebook. There are two ways to run this file:

    # Append new data (the day-to-day workflow):
    #   embeds ONLY the new rows, then appends them to BOTH the raw .xlsx
    #   and the processed .csv.
    python src/data_preparation.py data/raw/new_rows.csv

    # Full rebuild (reset): re-embed ALL raw rows and overwrite the processed
    #   .csv. Use this if the processed file gets corrupted or you change the
    #   embedding model.
    python src/data_preparation.py

The notebook only reads the processed .csv, so it picks up new rows automatically.

All data here is synthetic and for educational use only. It is not medical
advice and must not be used for real prescribing.
"""

import sys
from pathlib import Path

import pandas as pd

# Resolve paths from the project root (the parent of this src/ folder) so the
# file works no matter which directory you run it from.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_DATA_PATH = PROJECT_ROOT / "data" / "raw" / "nurseassist_patient_dataset_210_rows.xlsx"
RAW_SHEET_NAME = "Patient Dataset"
PROCESSED_DATA_PATH = PROJECT_ROOT / "data" / "processed" / "illness_classification_data.csv"

# Stable unique key used to tell new patients apart from ones we already have.
ID_COL = "Patient_ID"

# Vitals (numeric, model-ready) and the text column we embed.
VITAL_COLS = [
    "Temperature_C",
    "Heart_Rate_bpm",
    "Systolic_BP_mmHg",
    "Diastolic_BP_mmHg",
    "SpO2_percent",
    "Respiratory_Rate_bpm",
    "Pain_0_10",
]
TEXT_COL = "Symptoms"
LABEL_COL = "Primary_Illness"

# Loaded once and reused, so we don't reload the model on every call.
_model = None


def _get_model():
    """Load the SentenceTransformer model once and cache it for reuse."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def embed_symptoms(texts) -> pd.DataFrame:
    """
    Turn a list of symptom texts into a DataFrame of embedding columns.

    Args:
        texts: Iterable of symptom strings.

    Returns:
        DataFrame with one column per embedding dimension (emb_0, emb_1, ...).
    """
    embeddings = _get_model().encode(list(texts))
    return pd.DataFrame(
        embeddings,
        columns=[f"emb_{i}" for i in range(embeddings.shape[1])],
    )


def build_processed_rows(df: pd.DataFrame) -> pd.DataFrame:
    """
    Convert raw-shaped patient rows into the processed (model-ready) shape.

    Args:
        df: DataFrame with at least the vital, text, and label columns.

    Returns:
        DataFrame of vitals + symptom embeddings + illness label.
    """
    embedding_df = embed_symptoms(df[TEXT_COL].tolist())
    return pd.concat(
        [
            df[VITAL_COLS].reset_index(drop=True),
            embedding_df,
            df[LABEL_COL].reset_index(drop=True),
        ],
        axis=1,
    )


def rebuild_all() -> pd.DataFrame:
    """
    Re-embed ALL raw rows and overwrite the processed CSV from scratch.

    Returns:
        The full processed DataFrame that was saved.
    """
    raw_df = pd.read_excel(RAW_DATA_PATH, sheet_name=RAW_SHEET_NAME)
    processed_df = build_processed_rows(raw_df)

    PROCESSED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    processed_df.to_csv(PROCESSED_DATA_PATH, index=False)
    print(f"Full rebuild: wrote {len(processed_df)} rows to {PROCESSED_DATA_PATH}")
    return processed_df


def process_new_data(input_path) -> pd.DataFrame:
    """
    Embed only the new rows and append them to BOTH the raw and processed files.

    Steps:
      1. Read the new CSV and check its headers exactly match the raw file.
      2. Keep only patients whose Patient_ID isn't already in the raw file
         (duplicate guard, so re-running the same file does nothing).
      3. Append the new rows to the raw .xlsx.
      4. Embed the new rows and append them to the processed .csv.

    Args:
        input_path: Path to a CSV of new rows with the same columns as the raw file.

    Returns:
        DataFrame of the new rows that were added (empty if there were none).
    """
    input_path = Path(input_path)
    new_df = pd.read_csv(input_path)
    raw_df = pd.read_excel(RAW_DATA_PATH, sheet_name=RAW_SHEET_NAME)

    # 1. Headers must match the raw file exactly (same names, same order).
    if list(new_df.columns) != list(raw_df.columns):
        raise ValueError(
            "New file columns do not match the raw file.\n"
            f"  Expected: {list(raw_df.columns)}\n"
            f"  Got:      {list(new_df.columns)}"
        )

    # 2. Keep only genuinely new patients (Patient_ID not already in raw).
    existing_ids = set(raw_df[ID_COL])
    new_rows = new_df[~new_df[ID_COL].isin(existing_ids)].reset_index(drop=True)

    if new_rows.empty:
        print("No new rows to add (all Patient_IDs already exist). Nothing changed.")
        return new_rows

    # 3. Append the full new rows to the raw .xlsx and save.
    updated_raw = pd.concat([raw_df, new_rows], ignore_index=True)
    updated_raw.to_excel(RAW_DATA_PATH, sheet_name=RAW_SHEET_NAME, index=False)

    # 4. Embed the new rows and append them to the processed .csv.
    new_processed = build_processed_rows(new_rows)
    if PROCESSED_DATA_PATH.exists():
        existing_processed = pd.read_csv(PROCESSED_DATA_PATH)
        updated_processed = pd.concat([existing_processed, new_processed], ignore_index=True)
    else:
        updated_processed = new_processed

    PROCESSED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    updated_processed.to_csv(PROCESSED_DATA_PATH, index=False)

    print(
        f"Added {len(new_rows)} new rows. "
        f"Raw now has {len(updated_raw)} rows; "
        f"processed now has {len(updated_processed)} rows."
    )
    return new_rows


if __name__ == "__main__":
    # With a file path  -> append new data. Without one -> full rebuild.
    if len(sys.argv) > 1:
        process_new_data(sys.argv[1])
    else:
        rebuild_all()
