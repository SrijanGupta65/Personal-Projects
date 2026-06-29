-- Database schema for the NurseAssist patient store.
--
-- One table holds every patient: the readable clinical columns AND the
-- 384-dimension symptom embedding used for similar-patient search.
--
-- This file runs automatically the first time the Docker database starts.
-- To apply it to AWS RDS later, run it once against the RDS instance:
--     psql "<RDS_DATABASE_URL>" -f db/schema.sql
--
-- All data is synthetic and for educational use only. Not medical advice.

-- pgvector: adds the vector() column type and similarity search operators.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS patients (
    -- Identification
    patient_id                    TEXT PRIMARY KEY,
    patient_name                  TEXT,

    -- Demographics
    age                           INTEGER,
    sex                           TEXT,
    weight_kg                     NUMERIC,

    -- Medical condition
    primary_illness               TEXT,
    symptoms                      TEXT,
    medical_history               TEXT,
    consciousness_orientation     TEXT,

    -- Vitals and clinical measurements
    temperature_c                 NUMERIC,
    heart_rate_bpm                INTEGER,
    systolic_bp_mmhg              INTEGER,
    diastolic_bp_mmhg             INTEGER,
    spo2_percent                  NUMERIC,
    respiratory_rate_bpm          INTEGER,
    egfr_ml_min                   NUMERIC,
    blood_glucose_mmol_l          NUMERIC,
    pain_0_10                     INTEGER,

    -- Allergies
    medication_allergies          TEXT,
    food_other_allergies          TEXT,

    -- Treatment support
    treatment_impact_notes        TEXT,
    medication_dosage_fixed_period TEXT,
    medication_reasoning          TEXT,

    -- 384-dim symptom embedding (all-MiniLM-L6-v2) for similarity search.
    symptom_embedding             vector(384),

    -- When the row was inserted (handy for "retrain after N new patients").
    created_at                    TIMESTAMPTZ NOT NULL DEFAULT now()
);
