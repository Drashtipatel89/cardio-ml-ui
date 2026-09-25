/**
 * Machine Learning Engine & Cardiovascular Assessment Utilities
 * Connects directly to the trained Kaggle GradientBoosting model (cardio_model.joblib)
 * with 100% exact client-side tree inference.
 */

import trainedModel from './trainedModelData.json';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ==========================================
// 1. FEATURE DEFINITIONS & REFERENCE VALUES
// ==========================================
export const FEATURE_INFO = [
  { id: 'age', name: 'Age', unit: 'years', min: 18, max: 100, default: 50, description: 'Patient age in years' },
  { id: 'gender', name: 'Gender', unit: 'categorical', min: 1, max: 2, default: 1, description: 'Biological sex (1: Female, 2: Male)' },
  { id: 'height', name: 'Height', unit: 'cm', min: 120, max: 220, default: 165, description: 'Height in cm' },
  { id: 'weight', name: 'Weight', unit: 'kg', min: 35, max: 200, default: 70, description: 'Weight in kg' },
  { id: 'ap_hi', name: 'Systolic BP (ap_hi)', unit: 'mmHg', min: 70, max: 240, default: 120, description: 'Systolic blood pressure' },
  { id: 'ap_lo', name: 'Diastolic BP (ap_lo)', unit: 'mmHg', min: 40, max: 150, default: 80, description: 'Diastolic blood pressure' },
  { id: 'cholesterol', name: 'Cholesterol Level', unit: '1-3 scale', min: 1, max: 3, default: 1, description: '1: Normal, 2: Above Normal, 3: High' },
  { id: 'gluc', name: 'Glucose Level', unit: '1-3 scale', min: 1, max: 3, default: 1, description: '1: Normal, 2: Above Normal, 3: High' },
  { id: 'smoke', name: 'Smoking Status', unit: 'binary', min: 0, max: 1, default: 0, description: '0: No, 1: Yes' },
  { id: 'alco', name: 'Alcohol Intake', unit: 'binary', min: 0, max: 1, default: 0, description: '0: No, 1: Yes' },
  { id: 'active', name: 'Physical Activity', unit: 'binary', min: 0, max: 1, default: 1, description: '0: No, 1: Yes' },
];

// ==========================================
// 2. CLINICAL CALCULATORS (BMI, BP STAGE)
// ==========================================

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return { bmi: 0, category: 'Unknown', color: 'slate' };
  const heightMeters = heightCm / 100;
  const bmi = +(weightKg / (heightMeters * heightMeters)).toFixed(1);

  let category = 'Normal';
  let color = 'emerald';
  let advice = 'Your BMI is in the healthy range.';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'amber';
    advice = 'Underweight body mass; consider a nutrient-dense diet.';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Healthy Weight';
    color = 'emerald';
    advice = 'Optimal weight range associated with lower cardiac risk.';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    color = 'amber';
    advice = 'Moderate cardiac strain; mild weight reduction recommended.';
  } else {
    category = 'Obesity';
    color = 'rose';
    advice = 'Significant risk factor for hypertension and heart disease.';
  }

  return { bmi, category, color, advice };
}

export function getBloodPressureStage(ap_hi, ap_lo) {
  const sys = Number(ap_hi);
  const dia = Number(ap_lo);

  if (sys < 120 && dia < 80) {
    return { stage: 'Normal', color: 'emerald', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  } else if (sys >= 120 && sys <= 129 && dia < 80) {
    return { stage: 'Elevated', color: 'amber', badge: 'bg-amber-100 text-amber-800 border-amber-300' };
  } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    return { stage: 'Stage 1 Hypertension', color: 'orange', badge: 'bg-orange-100 text-orange-800 border-orange-300' };
  } else if (sys >= 180 || dia >= 120) {
    return { stage: 'Hypertensive Crisis', color: 'rose', badge: 'bg-red-200 text-red-900 border-red-400 font-bold' };
  } else if (sys >= 140 || dia >= 90) {
    return { stage: 'Stage 2 Hypertension', color: 'rose', badge: 'bg-rose-100 text-rose-800 border-rose-300' };
  }
  return { stage: 'Normal', color: 'emerald', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
}

// ==========================================
// 3. EXACT GRADIENT BOOSTING ML PREDICTION
// ==========================================

export function predictCardiovascularRisk(patientData) {
  const {
    age = 50,
    gender = 1,
    height = 165,
    weight = 70,
    ap_hi = 120,
    ap_lo = 80,
    cholesterol = 1,
    gluc = 1,
    smoke = 0,
    alco = 0,
    active = 1,
  } = patientData;

  const hM = Number(height) / 100;
  const bmi = +(Number(weight) / (hM * hM)).toFixed(2);
  const pulse_pressure = +(Number(ap_hi) - Number(ap_lo)).toFixed(2);

  // Exact 13 features matching cardio_model.joblib
  const rawFeatures = [
    Number(age),
    Number(gender),
    Number(height),
    Number(weight),
    Number(ap_hi),
    Number(ap_lo),
    Number(cholesterol),
    Number(gluc),
    Number(smoke),
    Number(alco),
    Number(active),
    bmi,
    pulse_pressure,
  ];

  // StandardScaler transform: (x - mean) / scale
  const scaled = rawFeatures.map((val, i) => (val - trainedModel.scaler_mean[i]) / trainedModel.scaler_scale[i]);

  // Evaluate 150 Gradient Boosting Trees
  let rawScore = trainedModel.init_raw;
  for (let i = 0; i < trainedModel.trees.length; i++) {
    const tree = trainedModel.trees[i];
    let node = 0;
    while (tree.left[node] !== -1) {
      const f = tree.f[node];
      const th = tree.th[node];
      if (scaled[f] <= th) {
        node = tree.left[node];
      } else {
        node = tree.right[node];
      }
    }
    rawScore += trainedModel.learning_rate * tree.v[node];
  }

  // Sigmoid probability for class 1 (cardio disease present)
  const probabilityRaw = 1 / (1 + Math.exp(-rawScore));
  const probabilityPercent = Math.min(Math.max(Math.round(probabilityRaw * 100), 1), 99);
  const isHighRisk = probabilityPercent >= 50;

  return {
    probabilityPercent,
    isHighRisk,
    riskCategory: probabilityPercent < 35 ? 'Low Risk (Healthy)' : probabilityPercent < 50 ? 'Low-Moderate Risk' : 'High Risk',
    riskColor: probabilityPercent < 35 ? 'emerald' : probabilityPercent < 50 ? 'amber' : 'rose',
    modelName: 'GradientBoosting (Kaggle Dataset Model)',
    factorContributions: getFallbackFactors(patientData),
    recommendations: generateClinicalRecommendations(patientData),
  };
}

/**
 * Predicts risk with optional backend check, seamlessly falling back to exact client tree inference.
 */
export async function predictCardiovascularRiskAsync(patientData) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: Number(patientData.age),
        gender: Number(patientData.gender),
        height: Number(patientData.height),
        weight: Number(patientData.weight),
        ap_hi: Number(patientData.ap_hi),
        ap_lo: Number(patientData.ap_lo),
        cholesterol: Number(patientData.cholesterol),
        gluc: Number(patientData.gluc),
        smoke: Number(patientData.smoke),
        alco: Number(patientData.alco),
        active: Number(patientData.active),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const apiResult = await res.json();
      return {
        isLiveApi: true,
        probabilityPercent: Math.round(apiResult.risk_percent),
        isHighRisk: apiResult.prediction === 1 || apiResult.risk_percent >= 50,
        riskCategory: apiResult.risk_category,
        riskColor: apiResult.risk_percent < 35 ? 'emerald' : apiResult.risk_percent < 50 ? 'amber' : 'rose',
        modelName: 'FastAPI + GradientBoosting',
        factorContributions: getFallbackFactors(patientData),
        recommendations: generateClinicalRecommendations(patientData),
      };
    }
  } catch {
    // Graceful offline fallback using exact tree evaluator
  }

  const localResult = predictCardiovascularRisk(patientData);
  return {
    ...localResult,
    isLiveApi: false,
  };
}

function getFallbackFactors(patientData) {
  const { ap_hi, ap_lo, cholesterol, smoke, active, weight, height, age } = patientData;
  const { bmi } = calculateBMI(weight, height);

  return [
    {
      factor: 'Blood Pressure',
      value: `${ap_hi}/${ap_lo} mmHg`,
      impact: ap_hi >= 140 ? 'High (+30%)' : ap_hi >= 130 ? 'Elevated (+15%)' : 'Normal',
      isHazard: ap_hi >= 130,
    },
    {
      factor: 'Cholesterol Level',
      value: cholesterol === 1 ? 'Normal (1)' : cholesterol === 2 ? 'Above Normal (2)' : 'High (3)',
      impact: cholesterol === 3 ? 'High Risk (+25%)' : cholesterol === 2 ? 'Moderate (+12%)' : 'Optimal',
      isHazard: cholesterol > 1,
    },
    {
      factor: 'Body Mass Index (BMI)',
      value: `${bmi} kg/m²`,
      impact: bmi >= 30 ? 'Obese' : bmi >= 25 ? 'Overweight' : 'Normal',
      isHazard: bmi >= 25,
    },
    {
      factor: 'Age',
      value: `${age} years`,
      impact: age >= 55 ? 'Higher Risk' : 'Normal',
      isHazard: age >= 55,
    },
    {
      factor: 'Lifestyle',
      value: `${smoke ? 'Smoker' : 'Non-smoker'}, ${active ? 'Active' : 'Inactive'}`,
      impact: smoke ? 'Smoking Risk' : 'Healthy Habits',
      isHazard: !!smoke || !active,
    },
  ];
}

function generateClinicalRecommendations(patientData) {
  const { ap_hi, ap_lo, cholesterol, smoke, active, weight, height } = patientData;
  const { bmi } = calculateBMI(weight, height);
  const recommendations = [];

  if (ap_hi >= 130 || ap_lo >= 85) {
    recommendations.push('Monitor blood pressure regularly and limit daily salt intake.');
  }
  if (cholesterol > 1) {
    recommendations.push('Reduce saturated fats and include high-fiber foods in your diet.');
  }
  if (bmi >= 25) {
    recommendations.push('Aim for gradual weight reduction to lower strain on the heart.');
  }
  if (smoke) {
    recommendations.push('Quitting smoking significantly reduces cardiovascular risks.');
  }
  if (!active) {
    recommendations.push('Engage in at least 30 minutes of moderate physical activity daily.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue maintaining your balanced diet and regular physical exercise.');
  }
  return recommendations;
}

// ==========================================
// 4. CLINICAL PATIENT PRESETS
// ==========================================
export const PATIENT_PRESETS = [
  {
    name: 'Healthy Young Adult',
    data: {
      age: 32,
      gender: 1,
      height: 168,
      weight: 60,
      ap_hi: 110,
      ap_lo: 70,
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1,
    },
  },
  {
    name: 'Normal Adult (50yo)',
    data: {
      age: 50,
      gender: 1,
      height: 165,
      weight: 65,
      ap_hi: 120,
      ap_lo: 80,
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1,
    },
  },
  {
    name: 'High Risk Profile',
    data: {
      age: 58,
      gender: 2,
      height: 172,
      weight: 90,
      ap_hi: 155,
      ap_lo: 95,
      cholesterol: 3,
      gluc: 2,
      smoke: 1,
      alco: 0,
      active: 0,
    },
  },
];
