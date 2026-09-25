"""
CardioGuard ML - FastAPI Backend Service
Directly connects the React Single Page Application with cardio_model.joblib
"""

import os
import time
import joblib
import pandas as pd
import numpy as np
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI App
app = FastAPI(
    title="CardioGuard ML Inference API",
    description="REST API serving the Scikit-Learn GradientBoosting Cardiovascular Risk Model",
    version="1.0.0"
)

# Enable CORS for Frontend UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained Model and Pipeline
MODEL_PATH = os.path.join(os.path.dirname(__file__), "cardio_model.joblib")

model_data = {}
pipeline = None
feature_cols = []
metrics = {}

try:
    if os.path.exists(MODEL_PATH):
        model_data = joblib.load(MODEL_PATH)
        pipeline = model_data.get("pipeline")
        feature_cols = model_data.get("feature_cols", [
            'age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo',
            'cholesterol', 'gluc', 'smoke', 'alco', 'active', 'bmi', 'pulse_pressure'
        ])
        metrics = model_data.get("metrics", {})
        print(f"[OK] Model successfully loaded from {MODEL_PATH}")
        print(f"     Algorithm: {model_data.get('model_name', 'Trained Pipeline')}")
        print(f"     Features: {len(feature_cols)} features ({', '.join(feature_cols)})")
    else:
        print(f"[WARNING] {MODEL_PATH} not found.")
except Exception as e:
    print(f"[ERROR] Error loading model: {e}")


# Pydantic Schemas for Request & Response
class PatientInput(BaseModel):
    age: float = Field(..., description="Age in years (e.g. 52)")
    gender: int = Field(..., description="Gender (1: Female, 2: Male)")
    height: float = Field(..., description="Height in cm (e.g. 165)")
    weight: float = Field(..., description="Weight in kg (e.g. 72)")
    ap_hi: float = Field(..., description="Systolic Blood Pressure in mmHg (e.g. 130)")
    ap_lo: float = Field(..., description="Diastolic Blood Pressure in mmHg (e.g. 85)")
    cholesterol: int = Field(1, description="Cholesterol Level (1: Normal, 2: Above Normal, 3: High)")
    gluc: int = Field(1, description="Glucose Level (1: Normal, 2: Above Normal, 3: High)")
    smoke: int = Field(0, description="Smoking Habit (0: No, 1: Yes)")
    alco: int = Field(0, description="Alcohol Intake (0: No, 1: Yes)")
    active: int = Field(1, description="Physical Activity (0: Inactive, 1: Active)")


class FactorDetail(BaseModel):
    name: str
    impact: str  # "Hazard Factor" | "Protective Factor" | "Optimal"
    category: str
    desc: str


class PredictionResponse(BaseModel):
    prediction: int  # 0 or 1
    risk_score: float  # 0.0 to 1.0
    risk_percent: float  # 0.0 to 100.0%
    risk_category: str  # "Low Risk", "Moderate Risk", "High Risk"
    bmi: float
    bmi_category: str
    pulse_pressure: float
    bp_stage: str
    model_name: str
    inference_time_ms: float
    features: Dict[str, Any]
    significant_factors: List[FactorDetail]


def calculate_clinical_metrics(p: PatientInput):
    """Computes BMI category and Blood Pressure Stage based on AHA guidelines."""
    # BMI
    height_m = p.height / 100.0
    bmi = round(p.weight / (height_m ** 2), 2)
    if bmi < 18.5:
        bmi_cat = "Underweight"
    elif bmi < 25.0:
        bmi_cat = "Normal Weight"
    elif bmi < 30.0:
        bmi_cat = "Overweight"
    else:
        bmi_cat = "Obese"

    # Pulse Pressure
    pulse_pressure = round(p.ap_hi - p.ap_lo, 2)

    # Blood Pressure Stage
    if p.ap_hi < 120 and p.ap_lo < 80:
        bp_stage = "Normal (Optimal)"
    elif p.ap_hi <= 129 and p.ap_lo < 80:
        bp_stage = "Elevated BP"
    elif p.ap_hi <= 139 or p.ap_lo <= 89:
        bp_stage = "Hypertension Stage 1"
    elif p.ap_hi >= 180 or p.ap_lo >= 120:
        bp_stage = "Hypertensive Crisis"
    else:
        bp_stage = "Hypertension Stage 2"

    return bmi, bmi_cat, pulse_pressure, bp_stage


def analyze_patient_factors(p: PatientInput, bmi: float, pulse_pressure: float) -> List[FactorDetail]:
    """Generates clinical explanations for risk drivers."""
    factors = []

    # Blood Pressure
    if p.ap_hi >= 140 or p.ap_lo >= 90:
        factors.append(FactorDetail(
            name=f"High Blood Pressure ({int(p.ap_hi)}/{int(p.ap_lo)} mmHg)",
            impact="Hazard Factor",
            category="Hemodynamic",
            desc="Systolic/diastolic blood pressure significantly increases arterial wall stress and cardiac workload."
        ))
    elif p.ap_hi < 120 and p.ap_lo < 80:
        factors.append(FactorDetail(
            name=f"Optimal Blood Pressure ({int(p.ap_hi)}/{int(p.ap_lo)} mmHg)",
            impact="Protective Factor",
            category="Hemodynamic",
            desc="Healthy blood pressure minimizes cardiovascular strain and stroke risk."
        ))

    # Cholesterol
    if p.cholesterol == 3:
        factors.append(FactorDetail(
            name="High Serum Cholesterol (Level 3)",
            impact="Hazard Factor",
            category="Biochemical",
            desc="Excessive serum lipids accelerate coronary plaque buildup and arterial narrowing."
        ))
    elif p.cholesterol == 2:
        factors.append(FactorDetail(
            name="Above Normal Cholesterol (Level 2)",
            impact="Hazard Factor",
            category="Biochemical",
            desc="Elevated cholesterol levels warrant dietary modifications and lipid monitoring."
        ))

    # Age
    if p.age >= 55:
        factors.append(FactorDetail(
            name=f"Advanced Age ({int(p.age)} Years)",
            impact="Hazard Factor",
            category="Demographic",
            desc="Cardiovascular stiffness and vascular aging naturally elevate baseline cardiac probability."
        ))

    # BMI
    if bmi >= 30.0:
        factors.append(FactorDetail(
            name=f"Obesity Indicator (BMI {bmi})",
            impact="Hazard Factor",
            category="Anthropometric",
            desc="Excess body mass increases systemic vascular resistance and metabolic risk."
        ))
    elif bmi < 25.0:
        factors.append(FactorDetail(
            name=f"Healthy BMI ({bmi})",
            impact="Protective Factor",
            category="Anthropometric",
            desc="Normal body weight supports optimal metabolic and cardiovascular function."
        ))

    # Smoking
    if p.smoke == 1:
        factors.append(FactorDetail(
            name="Active Tobacco Smoking",
            impact="Hazard Factor",
            category="Lifestyle",
            desc="Nicotine induces endothelial dysfunction, vasoconstriction, and atherogenesis."
        ))

    # Physical Activity
    if p.active == 1:
        factors.append(FactorDetail(
            name="Regular Physical Activity",
            impact="Protective Factor",
            category="Lifestyle",
            desc="Regular exercise enhances myocardial efficiency, HDL balance, and vasodilation."
        ))
    else:
        factors.append(FactorDetail(
            name="Sedentary Lifestyle",
            impact="Hazard Factor",
            category="Lifestyle",
            desc="Lack of physical activity contributes to arterial stiffness and reduced cardiopulmonary reserve."
        ))

    # Glucose
    if p.gluc >= 2:
        factors.append(FactorDetail(
            name=f"Elevated Blood Glucose (Level {p.gluc})",
            impact="Hazard Factor",
            category="Biochemical",
            desc="Hyperglycemia contributes to microvascular and macrovascular complications."
        ))

    return factors


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CardioGuard ML Prediction Engine",
        "model_loaded": pipeline is not None,
        "model_name": model_data.get("model_name", "GradientBoostingClassifier"),
        "docs_url": "/docs"
    }


@app.get("/api/info")
def get_model_info():
    """Returns model metadata, performance metrics, and feature list."""
    return {
        "status": "ready" if pipeline is not None else "model_not_loaded",
        "model_name": model_data.get("model_name", "GradientBoostingClassifier (Ensemble)"),
        "feature_cols": feature_cols,
        "metrics": metrics,
        "trained_at": model_data.get("trained_at", "2026-03"),
        "pipeline_description": "StandardScaler + GradientBoostingClassifier (150 estimators, learning_rate=0.08)"
    }


@app.post("/api/predict", response_model=PredictionResponse)
def predict_cardio(patient: PatientInput):
    """
    Evaluates patient features through the trained Machine Learning Pipeline
    and returns probability, classification, and clinical explanations.
    """
    start_time = time.perf_counter()

    bmi, bmi_cat, pulse_pressure, bp_stage = calculate_clinical_metrics(patient)

    if pipeline is None:
        raise HTTPException(
            status_code=503,
            detail="Machine learning model is not initialized on the server."
        )

    # Build input feature dictionary
    input_dict = {
        'age': float(patient.age),
        'gender': int(patient.gender),
        'height': float(patient.height),
        'weight': float(patient.weight),
        'ap_hi': float(patient.ap_hi),
        'ap_lo': float(patient.ap_lo),
        'cholesterol': int(patient.cholesterol),
        'gluc': int(patient.gluc),
        'smoke': int(patient.smoke),
        'alco': int(patient.alco),
        'active': int(patient.active),
        'bmi': float(bmi),
        'pulse_pressure': float(pulse_pressure)
    }

    try:
        # Create DataFrame in exact expected column order
        df_input = pd.DataFrame([input_dict])[feature_cols]

        # Run inference
        pred_class = int(pipeline.predict(df_input)[0])
        pred_proba = pipeline.predict_proba(df_input)[0]
        
        # Risk probability for class 1 (cardio disease present)
        risk_score = float(pred_proba[1])
        risk_percent = round(risk_score * 100.0, 1)

        # Classify risk tier
        if risk_percent < 35.0:
            risk_category = "Low Risk"
        elif risk_percent <= 65.0:
            risk_category = "Moderate Risk"
        else:
            risk_category = "High Risk"

        significant_factors = analyze_patient_factors(patient, bmi, pulse_pressure)
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return PredictionResponse(
            prediction=pred_class,
            risk_score=round(risk_score, 4),
            risk_percent=risk_percent,
            risk_category=risk_category,
            bmi=bmi,
            bmi_category=bmi_cat,
            pulse_pressure=pulse_pressure,
            bp_stage=bp_stage,
            model_name=model_data.get("model_name", "GradientBoostingClassifier (Ensemble)"),
            inference_time_ms=inference_time_ms,
            features=input_dict,
            significant_factors=significant_factors
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference error: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    print("[INFO] Starting CardioGuard ML API Server on http://localhost:8000 ...")
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
