# =========================
# Train & Save Random Forest Model
# =========================

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

# Load dataset
df = pd.read_csv("telco.csv")

# Basic cleaning
df.drop("customerID", axis=1, inplace=True)
df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
df["TotalCharges"].fillna(df["TotalCharges"].median(), inplace=True)
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
    "Partner_Yes"
]

X = df_encoded[selected_features]
y = df_encoded["Churn"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# Model tuning
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
    n_jobs=-1
)

grid.fit(X_train_scaled, y_train)

best_model = grid.best_estimator_

# Save artifacts
joblib.dump(best_model, "rf_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(selected_features, "features.pkl")

print(f"Best params: {grid.best_params_}")
print(f"Best ROC-AUC: {grid.best_score_:.4f}")
print("Model trained and saved successfully")
