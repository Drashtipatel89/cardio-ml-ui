import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend, Cell 
} from 'recharts';
import { 
  Award, CheckCircle2, AlertCircle, TrendingUp, Sliders, 
  Layers, Check, HelpCircle, Activity 
} from 'lucide-react';
import { 
  MODEL_BENCHMARKS, 
  CONFUSION_MATRIX, 
  ROC_CURVE_DATA 
} from '../utils/mlEngine';

export default function ModelEvaluation() {
  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  const [threshold, setThreshold] = useState(0.5);

  // Dynamic metrics simulated based on classification threshold slider
  const simulatedThresholdMetrics = {
    sensitivity: (CONFUSION_MATRIX.sensitivity * (1 + (0.5 - threshold) * 0.4)).toFixed(1),
    specificity: (CONFUSION_MATRIX.specificity * (1 - (0.5 - threshold) * 0.4)).toFixed(1),
    precision: (CONFUSION_MATRIX.precision * (1 - (0.5 - threshold) * 0.2)).toFixed(1),
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200">
              <Award className="w-3.5 h-3.5" />
              <span>Project Evaluation & Benchmarks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Machine Learning Model Evaluation
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Trained on 56,000 records and rigorously tested on 14,000 unseen cardiovascular test samples with standard 80/20 train/test split.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">Test Set Size</span>
              <span className="font-bold text-slate-900 text-sm">14,000 Patients</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block">Best Algorithm</span>
              <span className="font-bold text-emerald-600 text-sm">Random Forest / LogReg</span>
            </div>
          </div>
        </div>

        {/* 5 Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Accuracy</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">73.8%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Overall Correctness</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Precision</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">74.2%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Positive Pred. Value</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Recall (Sensitivity)</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-600">72.8%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">True Positive Rate</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">F1-Score</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600">73.5%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Harmonic Mean</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center col-span-2 sm:col-span-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">ROC-AUC</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-600">0.795</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Area Under Curve</span>
          </div>
        </div>
      </div>

      {/* Grid: Confusion Matrix (Left) + Multi-Algorithm Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ========================================= */}
        {/* CONFUSION MATRIX CARD (5 COLS)            */}
        {/* ========================================= */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Confusion Matrix (14,000 Test Set)</h2>
              <p className="text-xs text-slate-500">Predicted vs Actual Cardiovascular Status</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
              N = 14,000
            </span>
          </div>

          {/* 2x2 Matrix Visual */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-500 pb-1">
              <span>Predicted: HEALTHY (0)</span>
              <span>Predicted: CARDIO (1)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* True Negative */}
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">True Negative (TN)</span>
                <span className="text-2xl font-black text-emerald-900">{CONFUSION_MATRIX.trueNegative.toLocaleString()}</span>
                <span className="text-[11px] text-emerald-700 block">38.0% of test data</span>
                <span className="text-[10px] text-slate-500 block">Healthy correctly identified</span>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200 text-center space-y-1">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">False Positive (FP)</span>
                <span className="text-2xl font-black text-amber-900">{CONFUSION_MATRIX.falsePositive.toLocaleString()}</span>
                <span className="text-[11px] text-amber-700 block">12.0% Type I Error</span>
                <span className="text-[10px] text-slate-500 block">Healthy labeled as Cardio</span>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-center space-y-1">
                <span className="text-[11px] font-bold text-rose-800 uppercase block">False Negative (FN)</span>
                <span className="text-2xl font-black text-rose-900">{CONFUSION_MATRIX.falseNegative.toLocaleString()}</span>
                <span className="text-[11px] text-rose-700 block">14.2% Type II Error</span>
                <span className="text-[10px] text-slate-500 block">Cardio missed as Healthy</span>
              </div>

              {/* True Positive */}
              <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-center space-y-1">
                <span className="text-[11px] font-bold text-blue-800 uppercase block">True Positive (TP)</span>
                <span className="text-2xl font-black text-blue-900">{CONFUSION_MATRIX.truePositive.toLocaleString()}</span>
                <span className="text-[11px] text-blue-700 block">35.8% of test data</span>
                <span className="text-[10px] text-slate-500 block">Cardio correctly detected</span>
              </div>
            </div>
          </div>

          {/* Clinical Interpretation Guide */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block">Clinical Significance:</span>
            <p>
              • In medical diagnostics, minimizing <strong>False Negatives</strong> (missed disease) is prioritized so high-risk patients receive early intervention.
            </p>
            <p>
              • Model achieves <strong>{CONFUSION_MATRIX.specificity}% Specificity</strong> (avoiding unnecessary clinical anxiety for healthy patients).
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* MULTI-ALGORITHM BENCHMARK CHART (7 COLS) */}
        {/* ========================================= */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Algorithm Comparison & Benchmarks</h2>
              <p className="text-xs text-slate-500">Cross-comparing models evaluated in the notebook</p>
            </div>

            {/* Metric Selector Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'accuracy', label: 'Accuracy' },
                { id: 'precision', label: 'Precision' },
                { id: 'recall', label: 'Recall' },
                { id: 'f1Score', label: 'F1-Score' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetric(m.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    selectedMetric === m.id
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODEL_BENCHMARKS} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[60, 80]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="model" type="category" tick={{ fontSize: 11, width: 140 }} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, selectedMetric.toUpperCase()]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey={selectedMetric} radius={[0, 6, 6, 0]} barSize={24}>
                  {MODEL_BENCHMARKS.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.highlight ? '#10b981' : index === 1 ? '#3b82f6' : '#94a3b8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Benchmark Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-2">Accuracy</th>
                  <th className="py-2.5 px-2">Precision</th>
                  <th className="py-2.5 px-2">Recall</th>
                  <th className="py-2.5 px-2">F1</th>
                  <th className="py-2.5 px-2">ROC-AUC</th>
                  <th className="py-2.5 px-2">Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MODEL_BENCHMARKS.map((b, i) => (
                  <tr key={i} className={b.highlight ? 'bg-emerald-50/50 font-semibold' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 flex items-center space-x-1.5">
                      {b.highlight && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                      <span>{b.model}</span>
                    </td>
                    <td className="py-2.5 px-2 text-indigo-600 font-bold">{b.accuracy}%</td>
                    <td className="py-2.5 px-2">{b.precision}%</td>
                    <td className="py-2.5 px-2">{b.recall}%</td>
                    <td className="py-2.5 px-2">{b.f1Score}%</td>
                    <td className="py-2.5 px-2 font-mono text-purple-700">{b.rocAuc}</td>
                    <td className="py-2.5 px-2 text-slate-500">{b.trainingTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grid: ROC-AUC Curve (Left) + Interactive Threshold Tuning (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ROC Curve Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">ROC Curve (Receiver Operating Characteristic)</h2>
              <p className="text-xs text-slate-500">True Positive Rate vs False Positive Rate (AUC = 0.795)</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
              AUC 0.795
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ROC_CURVE_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={{ fontSize: 11 }} label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                <YAxis type="number" domain={[0, 1]} tick={{ fontSize: 11 }} label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <Tooltip 
                  formatter={(v, name) => [`${(v * 100).toFixed(0)}%`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="tpr" name="Model ROC" stroke="#7c3aed" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="linear" dataKey="fpr" name="Random Guess (0.50)" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Threshold Tuning Slider (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Decision Threshold Tuning Simulator</h2>
              <p className="text-xs text-slate-500">Simulate how adjusting classification cut-off alters clinical trade-offs</p>
            </div>
            <Sliders className="w-5 h-5 text-indigo-600" />
          </div>

          {/* Slider */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-slate-700">Classification Threshold (P<sub>cutoff</sub>)</span>
              <span className="font-bold text-indigo-600 text-base">{threshold}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.2 (High Sensitivity)</span>
              <span>0.5 (Balanced Default)</span>
              <span>0.8 (High Specificity)</span>
            </div>
          </div>

          {/* Dynamic Trade-off Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] text-slate-600 block">Sensitivity</span>
              <span className="text-lg font-black text-rose-700">{simulatedThresholdMetrics.sensitivity}%</span>
              <span className="text-[10px] text-slate-500 block">Disease Catch Rate</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] text-slate-600 block">Specificity</span>
              <span className="text-lg font-black text-emerald-700">{simulatedThresholdMetrics.specificity}%</span>
              <span className="text-[10px] text-slate-500 block">Healthy True Rate</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[11px] text-slate-600 block">Precision</span>
              <span className="text-lg font-black text-blue-700">{simulatedThresholdMetrics.precision}%</span>
              <span className="text-[10px] text-slate-500 block">Confidence in Positive</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            💡 <strong>Evaluation Note:</strong> Lowering threshold to ~0.4 increases Sensitivity to catch more cardiac cases in hospital screening environments, while default 0.5 provides optimal F1-score.
          </p>
        </div>

      </div>
    </div>
  );
}
