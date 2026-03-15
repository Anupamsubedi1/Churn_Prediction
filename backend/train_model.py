"""Train and save four churn models: Random Forest, Logistic Regression, Decision Tree, and SVM."""

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier


def load_data():
    df = pd.read_csv("telco.csv")
    df.drop("customerID", axis=1, inplace=True)
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
    df["TotalCharges"] = df["TotalCharges"].fillna(df["TotalCharges"].median())
    df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})

    df_encoded = pd.get_dummies(df, drop_first=True)
    selected_features = [
        "tenure",
        "MonthlyCharges",
        "TotalCharges",
        "InternetService_Fiber optic",
        "PaymentMethod_Electronic check",
        "Contract_Two year",
        "OnlineSecurity_Yes",
        "TechSupport_Yes",
        "PaperlessBilling_Yes",
        "Partner_Yes",
    ]

    X = df_encoded[selected_features]
    y = df_encoded["Churn"]
    return X, y, selected_features


def train_random_forest(X_train_scaled, y_train):
    param_grid = {
        "n_estimators": [100, 200],
        "max_depth": [None, 10, 20],
        "min_samples_split": [2, 5],
    }
    grid = GridSearchCV(
        RandomForestClassifier(class_weight="balanced", random_state=42),
        param_grid,
        cv=5,
        scoring="roc_auc",
        n_jobs=-1,
    )
    grid.fit(X_train_scaled, y_train)
    print(f"Random Forest best params: {grid.best_params_}")
    return grid.best_estimator_


def train_logistic_regression(X_train_scaled, y_train):
    model = LogisticRegression(
        C=100,
        penalty="l2",
        solver="lbfgs",
        class_weight="balanced",
        max_iter=1000,
    )
    model.fit(X_train_scaled, y_train)
    return model


def train_decision_tree(X_train, y_train):
    model = DecisionTreeClassifier(
        max_depth=5,
        min_samples_leaf=10,
        class_weight="balanced",
        random_state=42,
    )
    model.fit(X_train.astype(float), y_train)
    return model


def train_svm(X_train_scaled, y_train):
    param_grid = {
        "C": [0.1, 1, 10, 100],
        "kernel": ["linear", "rbf"],
        "gamma": ["scale", "auto"],
    }
    grid = GridSearchCV(
        SVC(class_weight="balanced", probability=True),
        param_grid,
        cv=5,
        scoring="roc_auc",
        n_jobs=-1,
    )
    grid.fit(X_train_scaled, y_train)
    print(f"SVM best params: {grid.best_params_}")
    return grid.best_estimator_


def main():
    X, y, selected_features = load_data()

    X_train, _, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Shared scaled features for RF, Logistic Regression and SVM.
    shared_scaler = StandardScaler()
    X_train_scaled = shared_scaler.fit_transform(X_train)

    # Background sample used by SHAP explainers for LR and SVM.
    np.random.seed(42)
    bg_idx = np.random.choice(len(X_train_scaled), min(50, len(X_train_scaled)), replace=False)
    X_background_scaled = X_train_scaled[bg_idx]

    rf_model = train_random_forest(X_train_scaled, y_train)
    lr_model = train_logistic_regression(X_train_scaled, y_train)
    dt_model = train_decision_tree(X_train, y_train)
    svm_model = train_svm(X_train_scaled, y_train)

    joblib.dump(rf_model, "rf_model.pkl")
    joblib.dump(shared_scaler, "rf_scaler.pkl")
    # Backward compatibility with previous backend version.
    joblib.dump(shared_scaler, "scaler.pkl")

    joblib.dump(lr_model, "lr_model.pkl")
    joblib.dump(shared_scaler, "lr_scaler.pkl")

    joblib.dump(dt_model, "dt_model.pkl")

    joblib.dump(svm_model, "svm_model.pkl")
    joblib.dump(shared_scaler, "svm_scaler.pkl")

    joblib.dump(selected_features, "features.pkl")
    joblib.dump(X_background_scaled, "shap_background_scaled.pkl")

    print("Saved: rf_model.pkl, lr_model.pkl, dt_model.pkl, svm_model.pkl")
    print("Saved: rf_scaler.pkl, lr_scaler.pkl, svm_scaler.pkl, scaler.pkl")
    print("Saved: features.pkl, shap_background_scaled.pkl")


if __name__ == "__main__":
    main()
