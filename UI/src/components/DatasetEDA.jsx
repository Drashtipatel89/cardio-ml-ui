import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Database, Users, Heart, Activity, CheckCircle, BarChart2, Flame, Wine, Zap } from 'lucide-react';
import { DATASET_STATS } from '../utils/mlEngine';

export default function DatasetEDA() {
  const correlationData = [
    { feature: 'Systolic BP (ap_hi)', correlation: 0.43, type: 'Hemodynamic', color: '#e11d48' },
    { feature: 'Diastolic BP (ap_lo)', correlation: 0.34, type: 'Hemodynamic', color: '#e11d48' },
    { feature: 'Age (Years)', correlation: 0.24, type: 'Demographic', color: '#6366f1' },
    { feature: 'Cholesterol Level', correlation: 0.22, type: 'Biochemical', color: '#f59e0b' },
    { feature: 'Weight / BMI', correlation: 0.18, type: 'Anthropometric', color: '#10b981' },
    { feature: 'Glucose Level', correlation: 0.09, type: 'Biochemical', color: '#f59e0b' },
    { feature: 'Smoking Habit', correlation: 0.04, type: 'Lifestyle', color: '#64748b' },
    { feature: 'Physical Activity', correlation: -0.04, type: 'Lifestyle (Protective)', color: '#0d9488' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
              <Database className="w-3.5 h-3.5" />
              <span>Exploratory Data Analysis (EDA)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Cardiovascular Dataset Insights
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Analysis of 70,000 real-world cardiovascular medical records, demographic profiles, and feature correlation patterns.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">Total Records</span>
              <span className="font-bold text-slate-900 text-sm">70,000 Rows</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block">Data Balance</span>
              <span className="font-bold text-emerald-600 text-sm">50.0% / 50.0% (Perfect)</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs text-slate-500 block">Total Cohort</span>
            <span className="text-2xl font-black text-slate-900">70,000</span>
            <span className="text-[11px] text-slate-400 block">Patient Records</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs text-slate-500 block">Total Features</span>
            <span className="text-2xl font-black text-indigo-600">11</span>
            <span className="text-[11px] text-slate-400 block">Clinical Variables</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs text-slate-500 block">Missing Values</span>
            <span className="text-2xl font-black text-emerald-600">0</span>
            <span className="text-[11px] text-slate-400 block">Clean & Imputed</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs text-slate-500 block">Target Balance</span>
            <span className="text-2xl font-black text-rose-600">49.97%</span>
            <span className="text-[11px] text-slate-400 block">Disease Prevalence</span>
          </div>
        </div>
      </div>

      {/* Grid: Target Distribution & Age Group Disease Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Target Balance Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Target Class Distribution</h2>
            <p className="text-xs text-slate-500">Cardio vs Healthy ratio in 70k instances</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATASET_STATS.targetDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {DATASET_STATS.targetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value.toLocaleString()} patients (${((value/70000)*100).toFixed(1)}%)`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-800 block">Healthy (Class 0)</span>
              <span className="text-base font-black text-emerald-900">35,021 (50.03%)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-800 block">Cardio Disease (Class 1)</span>
              <span className="text-base font-black text-rose-900">34,979 (49.97%)</span>
            </div>
          </div>
        </div>

        {/* Age Group vs Disease Prevalence (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Disease Prevalence by Age Cohort</h2>
            <p className="text-xs text-slate-500">Percentage of cardiovascular disease increasing across decades</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATASET_STATS.ageGroupStats} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 12 }} />
                <YAxis unit="%" domain={[0, 80]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Disease Prevalence']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="diseaseRate" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
            <span className="font-bold text-slate-900">Observation:</span>
            <span>Disease rate rises from <strong>25.1%</strong> in the 30-39 bracket to <strong>64.8%</strong> in seniors (60-65), confirming age as a continuous risk multiplier.</span>
          </div>
        </div>

      </div>

      {/* Grid: Cholesterol Impact & Feature Correlations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cholesterol Level Impact (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Cholesterol Level vs Disease Rate</h2>
            <p className="text-xs text-slate-500">Surge in cardio incidence across lipid categories</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATASET_STATS.cholesterolDistribution} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                <YAxis unit="%" domain={[0, 90]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Cardio Rate']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="cardioRate" radius={[6, 6, 0, 0]} barSize={36}>
                  {DATASET_STATS.cholesterolDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-600 space-y-1">
            <p>• Normal (1): <strong>44.0%</strong> cardio incidence</p>
            <p>• Above Normal (2): <strong>60.2%</strong> cardio incidence (+16.2%)</p>
            <p>• High (3): <strong>76.5%</strong> cardio incidence (+32.5% vs normal)</p>
          </div>
        </div>

        {/* Feature Correlation Ranking (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Feature Correlation with Target (cardio)</h2>
            <p className="text-xs text-slate-500">Pearson correlation coefficients from EDA matrix</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={correlationData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[-0.1, 0.5]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, width: 140 }} />
                <Tooltip 
                  formatter={(val) => [val, 'Correlation (r)']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="correlation" radius={[0, 6, 6, 0]} barSize={18}>
                  {correlationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>Key Finding:</strong> Systolic blood pressure (ap_hi, r = 0.43) is the strongest single predictor of cardiovascular disease, followed by diastolic BP, age, and cholesterol.
          </div>
        </div>

      </div>

    </div>
  );
}
