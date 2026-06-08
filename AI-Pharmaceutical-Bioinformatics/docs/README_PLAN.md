# README Structure Plan

When the project is ready for sharing, create a `README.md` at the root with sections:

## Suggested Sections

### 1. Title & Disclaimer
- Clear title: "AI Pharmaceutical Bioinformatics"
- **Prominent disclaimer**: Prototype, not for real patient care

### 2. Overview
- 2-3 sentence description of what the system does
- Link to `PROJECT_OVERVIEW.md` for detailed explanation

### 3. Features
- Patient similarity matching
- Medication recommendations
- Dosage adjustments
- Safety checks

### 4. Installation
- Python version required (3.8+)
- Dependencies (pandas, scikit-learn, numpy, etc.)
- Installation command: `pip install -r requirements.txt`

### 5. Quick Start
```bash
# Load data and find similar patients
python main.py --patient-id 12345

# Output: List of similar patients + medication recommendations
```

### 6. Project Structure
- Brief explanation of folders and their purpose

### 7. Documentation
- Link to `docs/PROJECT_OVERVIEW.md` (what problem this solves)
- Link to `docs/DATA_PIPELINE.md` (data flow)
- Link to `docs/CLUSTERING_PLAN.md` (similarity matching)
- Link to `docs/DOSAGE_SUPPORT_PLAN.md` (recommendations)
- Link to `docs/MODEL_LIMITATIONS.md` (safety & ethics)

### 8. Usage Examples
- Code snippets showing how to use each module
- Example patient query and output

### 9. Data
- Description of synthetic data schema
- How to add custom data
- Where to download/reference data

### 10. Contributing
- Guidelines for contributing (if open source)
- Code style, testing requirements
- How to report issues

### 11. Limitations & Safety
- Refer to `MODEL_LIMITATIONS.md`
- Emphasize prototype status
- Requirements for clinical use

### 12. License
- Choose appropriate license (MIT, Apache 2.0, etc.)

### 13. Contact
- Author/maintainer info
- Email: sguptasr@uw.edu
- Link to issues/discussions

## Key Principles

- **Front-load the disclaimer**: Make prototype/limitations immediately visible
- **Link to docs**: Don't duplicate; point to detailed docs in `docs/`
- **Code examples**: Show actual usage, not just theory
- **Be honest about scope**: Synthetic data, not validated for clinical use
