# Concerns

## Retraining and accuracy

When you re-train the model based on new data, what if the accuracy decreases?
How should you decide whether to keep the new model or stay on the old one?

## Updating hyperparameters

When should you also update the hyperparameters of a model, instead of just
re-training on new data with the existing ones?

## No vector index yet

The patients table has a pgvector `symptom_embedding` column, but no vector
index (HNSW/IVFFlat). At a few hundred rows Postgres just scans them all, which
is fast. Once the table grows large (tens of thousands+), add an index so
similarity search stays quick.

## Plan 
its going to fetch similar cases in teh past. present those as a summary. then also present a summary of the new patient that we are trying to help which owuld include patient allergies and some extra conditions he may have. then lastly based on the similar patients fetched, i will also present the drugs given and some facts about them. like allergens it may contatin. We can then create something like a dashboard with all of tehse inforation for the expert to use and analyze. then the expert can use it to prescribe
