"""
Train the illness-classification model using saved best hyperparameters.

Reads the tuned hyperparameters from model_params/, trains a final XGBoost
model on the processed data, evaluates it once on the held-out test set, and
saves the trained model (weights) and the illness label names to outputs/.

Run it from the project root (as a module, so the src import resolves):

    python -m src.illness_classifier

All data here is synthetic and for educational use only. It is not medical
advice and must not be used for real prescribing.
"""

import json
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

# Reuse the column definitions and processed-data path from the feature builder.
from src.embedding_features import LABEL_COL, PROCESSED_DATA_PATH, VITAL_COLS

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PARAMS_PATH = PROJECT_ROOT / "model_params" / "illness_classifier_hyperparameters.json"
MODEL_PATH = PROJECT_ROOT / "outputs" / "illness_classifier" / "model.json"
LABELS_PATH = PROJECT_ROOT / "outputs" / "illness_classifier" / "labels.json"
METRICS_PATH = PROJECT_ROOT / "outputs" / "illness_classifier" / "metrics.json"

# Same settings the notebook used, so results match.
MIN_PER_CLASS = 5  # drop illnesses with too few patients to split/validate
RANDOM_STATE = 42


def load_params(params_path: Path = PARAMS_PATH) -> dict:
    """Read the saved hyperparameters JSON."""
    with open(params_path) as f:
        return json.load(f)


def load_dataset(data_path: Path = PROCESSED_DATA_PATH):
    """Load the processed data and return (X, y) with rare classes dropped."""
    df = pd.read_csv(data_path)

    # Keep only illnesses with enough patients to split and validate.
    counts = df[LABEL_COL].value_counts()
    keep = counts[counts >= MIN_PER_CLASS].index
    df = df[df[LABEL_COL].isin(keep)].reset_index(drop=True)

    # Features = vitals + symptom embeddings; label = illness.
    embedding_cols = [c for c in df.columns if c.startswith("emb_")]
    feature_cols = VITAL_COLS + embedding_cols
    return df[feature_cols], df[LABEL_COL]


def train_and_save():
    """Train the final model on saved params and save the model + labels."""
    config = load_params()
    X, y = load_dataset()

    # 80-20 split; test set is used ONCE below for the final score.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=RANDOM_STATE
    )

    # XGBoost needs numeric labels.
    label_encoder = LabelEncoder()
    y_train_encoded = label_encoder.fit_transform(y_train)

    # Build and train the final model using the tuned hyperparameters.
    model = XGBClassifier(
        **config["params"],
        random_state=RANDOM_STATE,
        eval_metric="mlogloss",
    )
    model.fit(X_train, y_train_encoded)

    # Honest final score: evaluate once on the held-out test set.
    test_accuracy = model.score(X_test, label_encoder.transform(y_test))

    # Save the trained model (weights) and the label names for prediction later.
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    model.save_model(MODEL_PATH)
    with open(LABELS_PATH, "w") as f:
        json.dump(list(label_encoder.classes_), f, indent=2)

    print(f"Trained illness classifier with params: {config['params']}")
    print(f"Test accuracy: {test_accuracy:.3f}")
    print(f"Saved model to {MODEL_PATH}")
    print(f"Saved labels to {LABELS_PATH}")
    return model


if __name__ == "__main__":
    train_and_save()
