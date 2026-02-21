import joblib
import numpy as np


class ChurnModel:

    def __init__(self):
        self.model = joblib.load("rf_model.pkl")
        self.scaler = joblib.load("scaler.pkl")

    def predict(self, features: dict):
        input_array = np.array([[
            features["tenure"],
            features["MonthlyCharges"],
            features["TotalCharges"],
            features["InternetService_Fiber_optic"],
            features["PaymentMethod_Electronic_check"],
            features["Contract_Two_year"],
            features["OnlineSecurity_Yes"],
            features["TechSupport_Yes"],
            features["PaperlessBilling_Yes"],
            features["Partner_Yes"]
        ]])

        scaled_input = self.scaler.transform(input_array)

        prediction = self.model.predict(scaled_input)[0]
        probability = self.model.predict_proba(scaled_input)[0][1]

        return {
            "prediction": int(prediction),
            "probability": round(float(probability), 4)
        }
