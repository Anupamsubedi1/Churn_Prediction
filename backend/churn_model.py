import joblib
import numpy as np
import pandas as pd
import shap


FEATURE_NAMES = [
    "tenure",
    "MonthlyCharges",
    "TotalCharges",
    "InternetService_Fiber_optic",
    "PaymentMethod_Electronic_check",
    "Contract_Two_year",
    "OnlineSecurity_Yes",
    "TechSupport_Yes",
    "PaperlessBilling_Yes",
    "Partner_Yes",
]

SCALER_FEATURE_NAMES = {
    "tenure": "tenure",
    "MonthlyCharges": "MonthlyCharges",
    "TotalCharges": "TotalCharges",
    "InternetService_Fiber_optic": "InternetService_Fiber optic",
    "PaymentMethod_Electronic_check": "PaymentMethod_Electronic check",
    "Contract_Two_year": "Contract_Two year",
    "OnlineSecurity_Yes": "OnlineSecurity_Yes",
    "TechSupport_Yes": "TechSupport_Yes",
    "PaperlessBilling_Yes": "PaperlessBilling_Yes",
    "Partner_Yes": "Partner_Yes",
}

FEATURE_LABELS = {
    "tenure": "Tenure",
    "MonthlyCharges": "Monthly Charges",
    "TotalCharges": "Total Charges",
    "InternetService_Fiber_optic": "Fiber Optic Internet",
    "PaymentMethod_Electronic_check": "Electronic Check",
    "Contract_Two_year": "Two-Year Contract",
    "OnlineSecurity_Yes": "Online Security",
    "TechSupport_Yes": "Tech Support",
    "PaperlessBilling_Yes": "Paperless Billing",
    "Partner_Yes": "Has Partner",
}


class ChurnModel:

    def __init__(self):
        self.model = joblib.load("rf_model.pkl")
        self.scaler = joblib.load("scaler.pkl")
        self.explainer = shap.TreeExplainer(self.model)

    def predict(self, features: dict):
        scaler_input = {
            SCALER_FEATURE_NAMES[f]: features[f]
            for f in FEATURE_NAMES
        }
        input_df = pd.DataFrame([scaler_input], columns=[SCALER_FEATURE_NAMES[f] for f in FEATURE_NAMES])
        scaled_input = self.scaler.transform(input_df)

        prediction = self.model.predict(scaled_input)[0]
        probability = self.model.predict_proba(scaled_input)[0][1]

        # SHAP values for the churn class (index 1)
        shap_values = self.explainer.shap_values(scaled_input)
        # Handle different SHAP output formats
        if isinstance(shap_values, list):
            # Older SHAP: list of [class0_array, class1_array]
            sv = shap_values[1][0]
        elif shap_values.ndim == 3:
            # Newer SHAP: shape (n_samples, n_features, n_classes)
            sv = shap_values[0, :, 1]
        else:
            sv = shap_values[0]

        ev = self.explainer.expected_value
        if isinstance(ev, (list, np.ndarray)) and len(ev) > 1:
            base_value = float(ev[1])
        else:
            base_value = float(ev)

        # Build per-feature SHAP breakdown sorted by |value|
        shap_breakdown = []
        for i, fname in enumerate(FEATURE_NAMES):
            shap_breakdown.append({
                "feature": FEATURE_LABELS.get(fname, fname),
                "value": round(float(sv[i]), 4),
            })
        shap_breakdown.sort(key=lambda x: abs(x["value"]), reverse=True)

        return {
            "prediction": int(prediction),
            "probability": round(float(probability), 4),
            "shap_values": shap_breakdown,
            "shap_base_value": round(base_value, 4),
        }
