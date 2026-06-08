# Patient Clustering & Similarity

## Goal

Identify medically similar patients to use as reference cases for medication recommendations.

## Approach

### 1. Similarity Metrics

**Primary**: Euclidean distance on normalized features
- Treats all patient attributes equally
- Sensitive to feature scaling (handled in data pipeline)

**Alternatives**:
- Cosine similarity: Better for high-dimensional or sparse data
- Manhattan distance: Robust to outliers
- Domain-weighted distance: Higher weight on critical features (vitals > demographics)

### 2. Clustering Methods

**K-Means** (recommended for prototype)
- Fast, interpretable
- Requires choosing k (number of clusters)
- Good for initial exploration

**Hierarchical Clustering** (alternative)
- Produces dendrograms showing relationships
- More flexible, no k needed upfront
- Slower on large datasets

### 3. Feature Selection

Include in similarity calculations:
- Vital signs (Temperature, Heart_Rate, BP, SpO2, Respiratory_Rate, Blood_Glucose)
- Kidney function (eGFR)
- Symptoms (vectorized text or categorical)
- Primary illness
- Age (may weight by importance)

Exclude:
- Patient_ID, Patient_Name (identifiers)
- Medication info (will be derived from matches)
- Exact medical history text (use embeddings or categorize)

### 4. Finding Similar Patients

**Function**: `find_similar_patients(query_patient, patient_pool, top_k=5)`

For a new/query patient:
1. Compute distance to all patients in pool
2. Sort by distance
3. Return top_k closest matches

**Choice of k**: Start with k=5-10 to balance statistical reliability and computational cost

## Implementation Details

### Distance Calculation
```
similarity_score = 1 / (1 + euclidean_distance)
```

### Clustering Quality
- Monitor intra-cluster variance
- Visualize clusters (2D/3D projection using PCA or t-SNE)
- Check cluster stability across data subsets

## Future Enhancements

- Learn optimal feature weights from clinical outcomes
- Use patient embeddings (word2vec on medical history)
- Time-aware similarity (recent patients more relevant)
- Hierarchical clustering for disease subtypes
