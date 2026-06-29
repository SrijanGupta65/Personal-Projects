"""
Patient data-access layer (the only place that reads/writes the patients table).

Two jobs:
  * Adding patients  -> add_patient() / add_patients(): embed the symptom text
    and insert the row(s). add_patient() is what the future input interface
    will call for one new patient at a time.
  * Reading for training -> load_training_data(): pull vitals + symptom
    embedding + illness label back out in the exact shape the model expects
    (the same columns the old processed CSV had).

Database column names are the lowercase version of the CSV column names
(e.g. "SpO2_percent" -> "spo2_percent"), which is how Postgres stored them.

All data is synthetic and for educational use only. Not medical advice.
"""

import numpy as np
import pandas as pd

from src import db
from src.data_preparation import (
    ID_COL,
    LABEL_COL,
    TEXT_COL,
    VITAL_COLS,
    embed_symptoms,
)

# How many numbers are in one symptom embedding (all-MiniLM-L6-v2).
EMBEDDING_DIM = 384

# The 23 readable columns we store straight from the raw CSV. The matching
# database column is just the lowercase form of each name.
RAW_COLUMNS = [
    "Patient_ID",
    "Patient_Name",
    "Age",
    "Sex",
    "Weight_kg",
    "Primary_Illness",
    "Symptoms",
    "Temperature_C",
    "Heart_Rate_bpm",
    "Systolic_BP_mmHg",
    "Diastolic_BP_mmHg",
    "SpO2_percent",
    "Respiratory_Rate_bpm",
    "eGFR_mL_min",
    "Blood_Glucose_mmol_L",
    "Pain_0_10",
    "Consciousness_Orientation",
    "Medication_Allergies",
    "Food_Other_Allergies",
    "Medical_History",
    "Treatment_Impact_Notes",
    "Medication_Dosage_Fixed_Period",
    "Medication_Reasoning",
]


def _clean(value):
    """Turn pandas/numpy values into plain Python that psycopg2 understands."""
    if pd.isna(value):
        return None
    if isinstance(value, np.integer):
        return int(value)
    if isinstance(value, np.floating):
        return float(value)
    return value


def _existing_ids(patient_ids) -> set:
    """Return the subset of patient_ids that are already in the table."""
    ids = [str(pid) for pid in patient_ids]
    if not ids:
        return set()
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT patient_id FROM patients WHERE patient_id = ANY(%s);", (ids,)
            )
            return {row[0] for row in cur.fetchall()}


def add_patients(df: pd.DataFrame) -> int:
    """
    Embed and insert many patient rows. Patients already in the table are
    skipped (so re-running is safe and doesn't re-embed existing rows).

    Args:
        df: DataFrame with the 23 raw CSV columns (see RAW_COLUMNS).

    Returns:
        The number of NEW patients inserted.
    """
    missing = [c for c in RAW_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Input is missing required columns: {missing}")

    # Don't waste time embedding patients we already have.
    already_here = _existing_ids(df[ID_COL].tolist())
    new_df = df[~df[ID_COL].astype(str).isin(already_here)].reset_index(drop=True)
    if new_df.empty:
        print("No new patients to add (all Patient_IDs already exist).")
        return 0

    # Embed the symptom text for the new rows (the slow step).
    embeddings = embed_symptoms(new_df[TEXT_COL].tolist())

    db_columns = [c.lower() for c in RAW_COLUMNS] + ["symptom_embedding"]
    placeholders = ", ".join(["%s"] * len(db_columns))
    insert_sql = (
        f"INSERT INTO patients ({', '.join(db_columns)}) "
        f"VALUES ({placeholders}) ON CONFLICT (patient_id) DO NOTHING;"
    )

    inserted = 0
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            for i in range(len(new_df)):
                row = new_df.iloc[i]
                values = [_clean(row[c]) for c in RAW_COLUMNS]
                values.append(embeddings.iloc[i].to_numpy())  # the vector column
                cur.execute(insert_sql, values)
                inserted += cur.rowcount

    print(f"Inserted {inserted} new patient(s).")
    return inserted


def add_patient(patient: dict) -> int:
    """
    Embed and insert ONE patient. This is the call the input interface will use.

    Args:
        patient: Mapping of the 23 raw CSV column names to this patient's values.

    Returns:
        1 if inserted, 0 if a patient with that Patient_ID already existed.
    """
    return add_patients(pd.DataFrame([patient]))


def load_training_data() -> pd.DataFrame:
    """
    Read all patients back as a model-ready DataFrame.

    Returns:
        DataFrame with columns: vitals (VITAL_COLS) + emb_0..emb_383 + illness
        label. This matches the shape the old processed CSV had, so the trainer
        can use it without other changes.
    """
    emb_cols = [f"emb_{i}" for i in range(EMBEDDING_DIM)]
    columns = VITAL_COLS + emb_cols + [LABEL_COL]

    vital_db_cols = [c.lower() for c in VITAL_COLS]
    select_cols = vital_db_cols + ["symptom_embedding", LABEL_COL.lower()]
    query = (
        f"SELECT {', '.join(select_cols)} FROM patients "
        f"WHERE symptom_embedding IS NOT NULL;"
    )

    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query)
            rows = cur.fetchall()

    if not rows:
        return pd.DataFrame(columns=columns)

    n_vitals = len(VITAL_COLS)
    records = []
    for row in rows:
        record = {col: float(val) for col, val in zip(VITAL_COLS, row[:n_vitals])}
        embedding = row[n_vitals]  # numpy array of length EMBEDDING_DIM
        for i, value in enumerate(embedding):
            record[f"emb_{i}"] = float(value)
        record[LABEL_COL] = row[n_vitals + 1]
        records.append(record)

    return pd.DataFrame(records, columns=columns)


if __name__ == "__main__":
    # Quick check: how many patients and illness classes are in the table.
    data = load_training_data()
    print(f"Rows in patients table: {len(data)}")
    if not data.empty:
        print(data[LABEL_COL].value_counts())
