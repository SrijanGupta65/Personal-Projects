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
from datetime import datetime
from pathlib import Path

import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

# Reuse the column definitions and processed-data path from the feature builder.
from src.data_preparation import LABEL_COL, PROCESSED_DATA_PATH, VITAL_COLS

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PARAMS_PATH = PROJECT_ROOT / "model_params" / "illness_classifier_hyperparameters.json"

# Each training run saves into its own timestamped folder under this base dir,
# so past runs are never overwritten. The file names inside each run folder
# stay the same (model.json, labels.json, metrics.json).
RUNS_DIR = PROJECT_ROOT / "outputs" / "illness_classifier"

# Same settings the notebook used, so results match.
MIN_PER_CLASS = 10  # drop illnesses with too few patients to split/validate
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
    """Train the final model, then save the model, labels, and metrics.

    Each run writes into its own timestamped folder so earlier runs are kept.
    """
    config = load_params()
    X, y = load_dataset()

    # 80-20 split; test set is used ONCE below for the final score.
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=RANDOM_STATE
    )

    # XGBoost needs numeric labels.
    label_encoder = LabelEncoder()
    y_train_encoded = label_encoder.fit_transform(y_train)

    # Build the final model using the tuned hyperparameters.
    model = XGBClassifier(
        **config["params"],
        random_state=RANDOM_STATE,
        eval_metric="mlogloss",
    )

    # Cross-validation accuracy on the train set (same 5-fold setup as the
    # notebook), measured before the final fit on all training data.
    kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    cv_scores = cross_val_score(model, X_train, y_train_encoded, cv=kfold, scoring="accuracy")
    cv_accuracy = float(cv_scores.mean())

    model.fit(X_train, y_train_encoded)

    # Honest final score: evaluate once on the held-out test set.
    test_accuracy = float(model.score(X_test, label_encoder.transform(y_test)))

    # Make this run's own folder, named by date and time.
    trained_at = datetime.now()
    run_dir = RUNS_DIR / trained_at.strftime("%Y-%m-%d_%H%M")
    run_dir.mkdir(parents=True, exist_ok=True)

    model_path = run_dir / "model.json"
    labels_path = run_dir / "labels.json"
    metrics_path = run_dir / "metrics.json"

    # Save the trained model (weights) and the label names for prediction later.
    model.save_model(model_path)
    with open(labels_path, "w") as f:
        json.dump(list(label_encoder.classes_), f, indent=2)

    # Save a record of how this run performed and how it was trained.
    metrics = {
        "trained_at": trained_at.strftime("%Y-%m-%d %H:%M:%S"),
        "test_accuracy": test_accuracy,
        "cv_accuracy": cv_accuracy,
        "params": config["params"],
        "train_size": len(X_train),
        "test_size": len(X_test),
    }
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    # One clean summary at the end (same fields saved in metrics.json).
    print(f"Trained at:    {metrics['trained_at']}")
    print(f"Params:        {config['params']}")
    print(f"CV accuracy:   {cv_accuracy:.3f}")
    print(f"Test accuracy: {test_accuracy:.3f}")
    print(f"Train / test:  {len(X_train)} / {len(X_test)}")
    print(f"Saved run to:  {run_dir}")
    return model


if __name__ == "__main__":
    train_and_save()
