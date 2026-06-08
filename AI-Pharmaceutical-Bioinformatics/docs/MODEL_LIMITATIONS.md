# Model Limitations & Ethical Considerations

## Critical Disclaimers

⚠️ **This system is a PROTOTYPE for educational and research purposes only.**

It should NOT be used for actual patient care without:
- Clinical validation and testing
- Regulatory approval
- Integration with licensed medical professionals
- Proper informed consent and transparency

## Technical Limitations

### Data Limitations
- **Synthetic data only**: Not representative of real patient populations
- **Limited coverage**: May not include all disease presentations or edge cases
- **Historical bias**: If trained on real data, inherits past medical biases
- **Small dataset**: Limited to samples in `data/raw/` (affects recommendation confidence)

### Similarity Matching Limitations
- **Incomplete features**: Missing or unmeasured patient attributes reduce match quality
- **Euclidean distance**: Assumes features are independent and normally distributed (may not hold for vital signs)
- **Fixed k neighbors**: Top-k may have high variance; consider ensemble of different k values
- **No temporal aspect**: Doesn't account for when treatment was given (trends matter)

### Medication Recommendation Limitations
- **Outcome blindness**: Doesn't know if recommended medications actually worked for similar patients
- **Survivorship bias**: May only see patients who survived/completed treatment
- **Limited context**: Cannot assess patient adherence, lifestyle, psychosocial factors
- **Drug interactions**: Simple allergy checks; doesn't model complex interactions
- **Individual variation**: Genetics, metabolism, previous drug responses not captured

### Dosage Adjustment Limitations
- **Simplistic rules**: Weight/age adjustments are heuristic, not personalized to patient metabolism
- **No therapeutic monitoring**: Doesn't adjust based on patient response
- **Edge cases**: Obese or very lightweight patients may need custom adjustments
- **Organ function**: eGFR is surrogate for kidney function; doesn't capture hepatic or cardiac metabolism

## Safety & Ethical Concerns

### Fairness
- **Demographic bias**: System trained on synthetic data; may have latent biases from generation process
- **Rare conditions**: Fewer similar patients → less reliable recommendations for uncommon diseases
- **Health disparities**: May perpetuate historical inequities if trained on biased real data

### Transparency
- **Black box**: Similarity metric and recommendation logic may not be interpretable to users
- **Confidence overestimation**: Users may trust recommendations more than evidence supports
- **Accountability**: Who is responsible if recommendation harms patient?

### Liability
- **No regulatory approval**: Not validated for clinical use
- **Prototype status**: Expected to have errors and limitations
- **Professional responsibility**: Healthcare workers remain responsible for final treatment decisions

## Recommendations for Use

1. **Always involve licensed healthcare professionals**
   - Use system as assistant to human judgment, not replacement
   - Final prescribing decisions made by authorized medical staff

2. **Validate recommendations**
   - Check against patient-specific factors not in data
   - Consult drug references and contraindication databases
   - Review allergy/interaction checking independently

3. **Transparent communication**
   - Disclose to users that system is prototype
   - Explain confidence scores and limitations
   - Document reasoning for any recommendations

4. **Continuous monitoring**
   - Track outcomes of recommended treatments
   - Identify when recommendations fail
   - Retrain/adjust logic based on failures

5. **Institutional oversight**
   - Deploy only in settings with clinical governance
   - Require institutional review and approval
   - Implement audit trails and monitoring

## Future Work Needed

- [ ] Validation on real patient data (with privacy protections)
- [ ] Clinical trial to demonstrate safety and efficacy
- [ ] Regulatory submission (FDA approval if used in US)
- [ ] Bias audits for fairness across demographics
- [ ] Integration with EHR systems
- [ ] Outcome tracking and feedback loops
- [ ] Explainability/interpretability research
