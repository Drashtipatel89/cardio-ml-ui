import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart, AlertTriangle, CheckCircle2, User, Activity, 
  RotateCcw, Sparkles, Flame, Wine, Zap, Gauge, Stethoscope, Cpu,
  Calculator
} from 'lucide-react';
import { 
  predictCardiovascularRisk, 
  predictCardiovascularRiskAsync, 
  calculateBMI, 
  getBloodPressureStage,
  PATIENT_PRESETS
} from '../utils/mlEngine';

export default function Predictor({ patient, setPatient, onReset }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [prediction, setPrediction] = useState(() => predictCardiovascularRisk(patient));
  const [loading, setLoading] = useState(false);

  // Computed metrics
  const bmiInfo = useMemo(() => calculateBMI(patient.weight, patient.height), [patient.weight, patient.height]);
  const bpStage = useMemo(() => getBloodPressureStage(patient.ap_hi, patient.ap_lo), [patient.ap_hi, patient.ap_lo]);

  // Query prediction (debounced)
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      const res = await predictCardiovascularRiskAsync(patient);
      if (isCurrent) {
        setPrediction(res);
        setLoading(false);
      }
    }, 120);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [patient]);

  const handleChange = (field, val) => {
    const num = val === '' ? '' : Number(val);
    setPatient((prev) => ({ ...prev, [field]: num }));
    setSelectedPreset(null);
  };

  const handleLoadPreset = (preset) => {
    setPatient(preset.data);
    setSelectedPreset(preset.name);
  };

  const isHighRisk = prediction.probabilityPercent >= 50;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Presets Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-sm shadow-rose-200">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Model Status</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{prediction.isLiveApi ? 'FastAPI (cardio_model.joblib)' : 'Connected ML Engine'}</span>
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 mt-0.5">Cardiovascular Disease Prediction</h2>
          </div>
        </div>

        {/* Quick Test Profiles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden md:inline">Quick Test:</span>
          {PATIENT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedPreset === preset.name
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="text-xs px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center space-x-1"
            title="Reset to default values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Text-Box Input Form (Left 7 cols) & Live Results (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================= */}
        {/* LEFT COLUMN: MANUAL TEXT BOX INPUTS (7 COLS) */}
        {/* ========================================= */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Card 1: Personal Demographics & Physical Measurements */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Personal & Body Measurements</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Age Text Box */}
              <div className="space-y-1.5">
                <label htmlFor="age-input" className="block text-xs font-semibold text-slate-700">
                  Age <span className="text-slate-400 font-normal">(in years)</span>
                </label>
                <div className="relative">
                  <input
                    id="age-input"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 50"
                    value={patient.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition text-slate-900 font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                    years
                  </span>
                </div>
              </div>

              {/* Gender Buttons */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Biological Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('gender', 1)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      patient.gender === 1
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm ring-1 ring-rose-300'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Female (1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('gender', 2)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      patient.gender === 2
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm ring-1 ring-rose-300'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Male (2)
                  </button>
                </div>
              </div>

              {/* Height Text Box */}
              <div className="space-y-1.5">
                <label htmlFor="height-input" className="block text-xs font-semibold text-slate-700">
                  Height <span className="text-slate-400 font-normal">(in cm)</span>
                </label>
                <div className="relative">
                  <input
                    id="height-input"
                    type="number"
                    min="50"
                    max="250"
                    placeholder="e.g. 165"
                    value={patient.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition text-slate-900 font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                    cm
                  </span>
                </div>
              </div>

              {/* Weight Text Box */}
              <div className="space-y-1.5">
                <label htmlFor="weight-input" className="block text-xs font-semibold text-slate-700">
                  Weight <span className="text-slate-400 font-normal">(in kg)</span>
                </label>
                <div className="relative">
                  <input
                    id="weight-input"
                    type="number"
                    min="20"
                    max="250"
                    placeholder="e.g. 70"
                    value={patient.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition text-slate-900 font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                    kg
                  </span>
                </div>
              </div>

            </div>

            {/* Calculated BMI Badge */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Calculated BMI: <strong className="text-slate-900 font-mono text-sm">{bmiInfo.bmi} kg/m²</strong>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                bmiInfo.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                bmiInfo.color === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {bmiInfo.category}
              </span>
            </div>
          </div>

          {/* Card 2: Blood Pressure Text Boxes */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Gauge className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Blood Pressure (Hemodynamics)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Systolic BP Text Box */}
              <div className="space-y-1.5">
                <label htmlFor="ap-hi-input" className="block text-xs font-semibold text-slate-700">
                  Systolic Blood Pressure <span className="text-slate-400 font-normal">(ap_hi)</span>
                </label>
                <div className="relative">
                  <input
                    id="ap-hi-input"
                    type="number"
                    min="50"
                    max="250"
                    placeholder="e.g. 120"
                    value={patient.ap_hi}
                    onChange={(e) => handleChange('ap_hi', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-900 font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                    mmHg
                  </span>
                </div>
              </div>

              {/* Diastolic BP Text Box */}
              <div className="space-y-1.5">
                <label htmlFor="ap-lo-input" className="block text-xs font-semibold text-slate-700">
                  Diastolic Blood Pressure <span className="text-slate-400 font-normal">(ap_lo)</span>
                </label>
                <div className="relative">
                  <input
                    id="ap-lo-input"
                    type="number"
                    min="30"
                    max="180"
                    placeholder="e.g. 80"
                    value={patient.ap_lo}
                    onChange={(e) => handleChange('ap_lo', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-900 font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                    mmHg
                  </span>
                </div>
              </div>

            </div>

            {/* AHA Blood Pressure Staging Badge */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Blood Pressure Status: <span className="text-slate-500 font-mono text-[11px]">(Pulse Pressure: {patient.ap_hi - patient.ap_lo} mmHg)</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${bpStage.badge}`}>
                {bpStage.stage}
              </span>
            </div>
          </div>

          {/* Card 3: Biochemical Labs & Lifestyle */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Biochemical Labs & Lifestyle Factors</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cholesterol Level (1, 2, 3) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Serum Cholesterol</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: 1, label: 'Normal (1)' },
                    { val: 2, label: 'Above (2)' },
                    { val: 3, label: 'High (3)' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => handleChange('cholesterol', item.val)}
                      className={`py-2 text-[11px] font-bold rounded-xl border text-center transition ${
                        patient.cholesterol === item.val
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glucose Level (1, 2, 3) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Blood Glucose</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: 1, label: 'Normal (1)' },
                    { val: 2, label: 'Above (2)' },
                    { val: 3, label: 'High (3)' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => handleChange('gluc', item.val)}
                      className={`py-2 text-[11px] font-bold rounded-xl border text-center transition ${
                        patient.gluc === item.val
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Lifestyle Binary Switches */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              
              {/* Smoking */}
              <button
                type="button"
                onClick={() => handleChange('smoke', patient.smoke ? 0 : 1)}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                  patient.smoke 
                    ? 'bg-rose-50 border-rose-300 text-rose-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Flame className={`w-3.5 h-3.5 ${patient.smoke ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">Smoking</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  patient.smoke ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {patient.smoke ? 'YES (1)' : 'NO (0)'}
                </span>
              </button>

              {/* Alcohol */}
              <button
                type="button"
                onClick={() => handleChange('alco', patient.alco ? 0 : 1)}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                  patient.alco 
                    ? 'bg-amber-50 border-amber-300 text-amber-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Wine className={`w-3.5 h-3.5 ${patient.alco ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">Alcohol</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  patient.alco ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {patient.alco ? 'YES (1)' : 'NO (0)'}
                </span>
              </button>

              {/* Physical Activity */}
              <button
                type="button"
                onClick={() => handleChange('active', patient.active ? 0 : 1)}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                  patient.active 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Zap className={`w-3.5 h-3.5 ${patient.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">Exercise</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  patient.active ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {patient.active ? 'ACTIVE (1)' : 'INACTIVE (0)'}
                </span>
              </button>

            </div>
          </div>

        </div>

        {/* ========================================= */}
        {/* RIGHT COLUMN: PREDICTION RESULTS (5 COLS) */}
        {/* ========================================= */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          
          {/* Main Risk Output Card */}
          <div className={`rounded-2xl p-6 border shadow-md space-y-5 transition-all duration-300 ${
            isHighRisk 
              ? 'bg-gradient-to-b from-rose-50/90 to-white border-rose-200 shadow-rose-100' 
              : 'bg-gradient-to-b from-emerald-50/90 to-white border-emerald-200 shadow-emerald-100'
          }`}>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
                Prediction Output
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-white border border-slate-200 text-slate-600 font-semibold">
                {prediction.modelName}
              </span>
            </div>

            {/* Radial Risk Gauge */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={isHighRisk ? '#e11d48' : '#10b981'}
                    strokeWidth="9"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - prediction.probabilityPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                    {prediction.probabilityPercent}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Disease Risk
                  </span>
                </div>
              </div>

              {/* Status Classification Badge */}
              <div className="mt-3">
                <span className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm ${
                  isHighRisk 
                    ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {isHighRisk ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>{prediction.riskCategory}</span>
                </span>
              </div>
            </div>

            {/* Key Clinical Summary */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
              <span className="font-bold text-slate-800 block border-b border-slate-100 pb-1.5">
                Entered Clinical Values:
              </span>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Blood Pressure:</span>
                  <span className={`font-semibold ${patient.ap_hi >= 130 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {patient.ap_hi}/{patient.ap_lo} mmHg ({bpStage.stage})
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>Cholesterol:</span>
                  <span className={`font-semibold ${patient.cholesterol > 1 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {patient.cholesterol === 1 ? 'Normal' : patient.cholesterol === 2 ? 'Above Normal' : 'High'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>Body Mass Index:</span>
                  <span className={`font-semibold ${bmiInfo.bmi >= 25 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {bmiInfo.bmi} kg/m² ({bmiInfo.category})
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>Lifestyle Profile:</span>
                  <span className="font-semibold text-slate-800">
                    {patient.smoke ? 'Smoker' : 'Non-smoker'} • {patient.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Guidance */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                <span>Health Recommendations:</span>
              </span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                {(prediction.recommendations || []).map((rec, idx) => (
                  <li key={idx} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
