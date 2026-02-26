from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from churn_model import ChurnModel

app = FastAPI(title="Churn Prediction API", version="1.0.0")
model = ChurnModel()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Customer(BaseModel):
    tenure: float = Field(..., ge=0, description="Months the customer has stayed")
    MonthlyCharges: float = Field(..., ge=0, description="Monthly charge amount")
    TotalCharges: float = Field(..., ge=0, description="Total charges")
    InternetService_Fiber_optic: int = Field(..., ge=0, le=1, description="1 if Fiber optic, else 0")
    PaymentMethod_Electronic_check: int = Field(..., ge=0, le=1, description="1 if Electronic check, else 0")
    Contract_Two_year: int = Field(..., ge=0, le=1, description="1 if Two year contract, else 0")
    OnlineSecurity_Yes: int = Field(..., ge=0, le=1, description="1 if Online security, else 0")
    TechSupport_Yes: int = Field(..., ge=0, le=1, description="1 if Tech support, else 0")
    PaperlessBilling_Yes: int = Field(..., ge=0, le=1, description="1 if Paperless billing, else 0")
    Partner_Yes: int = Field(..., ge=0, le=1, description="1 if has partner, else 0")


@app.get("/")
def root():
    return {"message": "Churn Prediction API is running"}


@app.post("/predict")
def predict(customer: Customer):
    result = model.predict(customer.dict())
    return {
        "prediction": result["prediction"],
        "churn": "Yes" if result["prediction"] == 1 else "No",
        "probability": result["probability"],
        "confidence": round(result["probability"] * 100, 2),
        "shap_values": result["shap_values"],
        "shap_base_value": result["shap_base_value"],
    }
