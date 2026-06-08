# Dosage Support & Medication Recommendations

## Goal

Generate personalized medication recommendations for a patient by analyzing medication patterns used for medically similar patients.

## Recommendation Logic

### 1. Extract Medication Patterns

**Input**: Similar patients (from clustering)

**Process**:
1. Collect all medications used for similar patients
2. Aggregate by medication name
3. Calculate statistics (mean dosage, dosage range, frequency)

**Output**: Dictionary of medications → dosage distributions

Example:
```
{
  "Metformin": {"mean": 500, "range": [250, 1000], "count": 3},
  "Lisinopril": {"mean": 10, "range": [5, 20], "count": 2}
}
```

### 2. Safety Validation

Before recommending any medication:

**Check allergies**:
- Cross-reference patient's `Medication_Allergies` field
- Skip any known allergens

**Check contraindications**:
- Patient with kidney disease (low eGFR) → avoid nephrotoxic drugs
- Patient with history of adverse reactions → flag for review
- Patient on other medications → check for interactions

**Output**: (is_safe: bool, reason: str)

### 3. Dosage Adjustment

Adjust recommended dosage based on patient factors:

**Age adjustments**:
- Elderly patients (>65): Consider 25-50% dose reduction
- Pediatric (<18): Scale by weight/age

**Weight adjustments**:
- Dose ∝ patient_weight / standard_weight
- Critical for drugs with narrow therapeutic windows

**Kidney function adjustments**:
- eGFR < 60: Reduce dose (kidneys clear drug slowly)
- Formula: adjusted_dose = base_dose * (patient_eGFR / 90)

**Liver function**:
- Severely impaired liver → reduce dose or contraindicate

### 4. Generate Recommendations

**Input**: Query patient, similar patients, extracted patterns

**Output**: Structured recommendation dict
```
{
  "medications": [
    {
      "name": "Metformin",
      "base_dosage": 500,
      "adjusted_dosage": 400,
      "frequency": "twice daily",
      "rationale": "Recommended for all 5 similar patients",
      "safety_notes": "None"
    }
  ],
  "confidence": 0.85,
  "similar_patients_count": 5,
  "clinical_notes": "..."
}
```

## Implementation Details

### Medication Dosage Data

Must include in patient records:
- `Medication_Dosage_Fixed_Period`: e.g., "Metformin 500mg BID, Lisinopril 10mg daily"
- `Medication_Reasoning`: Clinical justification for why medication was chosen

### Confidence Scoring

- High (>0.8): 5+ similar patients, clear medication consensus
- Medium (0.5-0.8): 3-4 similar patients, some dosage variation
- Low (<0.5): <3 similar patients, wide dosage range
- Flag low-confidence recommendations for clinical review

## Safety & Limitations

⚠️ **Critical Rules**:
1. Always flag allergies and contraindications prominently
2. Include uncertainty/confidence scores
3. Recommend human review before use
4. Never auto-prescribe; output is recommendation only
5. Handle missing medication data gracefully (don't guess)

## Future Enhancements

- Learn medication patterns from clinical outcomes (which meds → best outcomes)
- Incorporate drug interaction databases
- Model individual patient response variation
- Bayesian confidence estimation
- Support for drug combinations
