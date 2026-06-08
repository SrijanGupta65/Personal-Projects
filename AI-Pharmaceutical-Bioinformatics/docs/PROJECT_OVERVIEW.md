# Project Overview: AI Pharmaceutical Bioinformatics

## Problem Statement

Healthcare workers need to make faster, more informed medication decisions while minimizing the risk of harmful side effects from overmedication. Currently, decision-making is time-consuming and relies heavily on individual expertise, which can be inconsistent.

## Solution

This prototype develops a **clinical decision-support system** that:
- Analyzes patient medical history, vital signs, demographics, and symptoms
- Finds medically similar patients in a reference dataset
- Recommends personalized medication plans based on outcomes from similar cases
- Reduces decision time and risk of medication errors

## Key Features

1. **Patient Similarity Matching**: Uses clustering and distance metrics to identify medically similar cases
2. **Medication Recommendations**: Suggests medications and dosages based on similar patient outcomes
3. **Safety Checks**: Validates recommendations against patient allergies and contraindications
4. **Dosage Adjustments**: Customizes recommendations based on patient age, weight, kidney function, etc.

## Important Limitations

⚠️ **This is a prototype decision-support tool, NOT a real prescribing system.**

- Uses synthetic data only
- Should not be used for actual patient care without clinical validation
- Recommendations must be reviewed and approved by healthcare professionals
- Cannot account for all medical complexities and edge cases
- Requires further validation and regulatory approval for clinical use

## Target Users

- Nurses and healthcare workers evaluating medication options
- Pharmacy professionals checking treatment plans
- Medical researchers exploring data-driven treatment patterns

## Data

All data is synthetic and includes:
- Demographics (age, sex, weight)
- Medical conditions (primary illness, symptoms, history)
- Vital signs (temperature, heart rate, blood pressure, SpO2, etc.)
- Allergies and contraindications
- Current treatment outcomes

See `CLAUDE.md` for full data schema.
