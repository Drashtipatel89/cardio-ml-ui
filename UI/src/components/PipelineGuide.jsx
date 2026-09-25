import React, { useState, useEffect } from 'react';
import { 
  GitBranch, CheckCircle2, FileCode, Layers, ShieldCheck, 
  HelpCircle, ChevronDown, ChevronUp, Cpu, Server, Terminal, BookOpen, Table
} from 'lucide-react';
import { FEATURE_INFO } from '../utils/mlEngine';

export default function PipelineGuide({ activeSubSection = 'pipeline' }) {
  const [selectedSubTab, setSelectedSubTab] = useState(
    activeSubSection === 'viva' ? 'viva' : 'pipeline'
  );
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (activeSubSection === 'viva') {
      setSelectedSubTab('viva');
    } else if (activeSubSection === 'pipeline') {
      setSelectedSubTab('pipeline');
    }
  }, [activeSubSection]);

  const pipelineSteps = [
    {
      step: '01',
      title: 'Data Ingestion & Cleaning',
      desc: 'Loaded cardio_train.csv (70,000 rows, 13 raw attributes). Converted age from days (e.g. 18,396) into integer years (age/365). Removed ID identifier.',
      code: 'df["age"] = (df["age"] / 365).astype(int)\ndf = df.drop("id", axis=1)',
      icon: Terminal,
      color: 'bg-blue-500',
    },
    {
      step: '02',
      title: 'Exploratory Analysis & Outlier Detection',
      desc: 'Visualized boxplots for blood pressure and height/weight. Handled physiologically impossible blood pressure values (ap_hi > 240 or < 40).',
      code: 'sns.boxplot(x=df["height"])\ndf["age"].hist()',
      icon: Layers,
      color: 'bg-amber-500',
    },
    {
      step: '03',
      title: 'Feature Scaling & Transformation',
      desc: 'Applied MinMaxScaler & StandardScaler on continuous variables (age, height, weight, ap_hi, ap_lo) to normalize features for distance-based models.',
      code: 'from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)',
      icon: Cpu,
      color: 'bg-purple-500',
    },
    {
      step: '04',
      title: 'Train-Test Partitioning',
      desc: 'Stratified 80/20 train/test split: 56,000 training instances and 14,000 hold-out test instances with fixed random seed (random_state=42).',
      code: 'X_train, X_test, Y_train, Y_test = train_test_split(\n  X, Y, test_size=0.2, random_state=42\n)',
      icon: GitBranch,
      color: 'bg-indigo-500',
    },
    {
      step: '05',
      title: 'Model Training & Evaluation',
      desc: 'Trained Multiple Classifiers (Random Forest, Logistic Regression, Decision Tree, Linear Regression). Evaluated with Confusion Matrix & ROC-AUC.',
      code: 'model = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, Y_train)\ny_pred = model.predict(X_test)',
      icon: ShieldCheck,
      color: 'bg-emerald-500',
    },
    {
      step: '06',
      title: 'Model Serialization (Joblib)',
      desc: 'Exported trained production model to cardio_model.joblib for lightweight deployment, API serving, and UI integration.',
      code: 'import joblib\njoblib.dump(model, "cardio_model.joblib")',
      icon: Server,
      color: 'bg-rose-500',
    },
  ];

  // Frequently Asked Viva / Project Evaluation Questions
  const vivaQuestions = [
    {
      q: 'Why did you choose Cardiovascular Disease (CVD) prediction for this project?',
      a: 'Cardiovascular disease is the #1 cause of mortality globally. Early detection of asymptomatic high-risk individuals through non-invasive biomarkers (blood pressure, cholesterol, BMI, lifestyle) enables timely clinical interventions before major cardiac events occur.',
    },
    {
      q: 'How did you handle the age feature in the raw dataset?',
      a: 'In the raw cardio_train.csv dataset, age is recorded in days (e.g., 18,396 days). In the notebook preprocessing stage, we converted days to chronological years using integer division by 365 (df["age"] = (df["age"] / 365).astype(int)) to make features clinically interpretable.',
    },
    {
      q: 'Why did you apply StandardScaler & MinMaxScaler?',
      a: 'Features like blood pressure (90-180 mmHg) and weight (40-120 kg) have vastly different numerical scales compared to binary features (smoking: 0/1). Standardizing features ensures linear models (Logistic Regression) and gradient-based algorithms converge efficiently without disproportionately weighting large numbers.',
    },
    {
      q: 'Why is Random Forest / Logistic Regression preferred over a single Decision Tree?',
      a: 'A single Decision Tree achieved ~69.4% accuracy and suffered from variance/overfitting. Random Forest creates an ensemble of decorrelated decision trees, reducing variance and boosting test accuracy to 73.8% and ROC-AUC to 0.795.',
    },
    {
      q: 'What is the most critical metric for evaluating this medical model?',
      a: 'While accuracy (73.8%) provides an overall benchmark, in clinical diagnostic systems, Recall / Sensitivity (72.8%) is paramount because a False Negative (failing to diagnose a patient who has heart disease) carries severe health risks.',
    },
    {
      q: 'What are the future enhancements planned for this project?',
      a: 'Future scope includes incorporating time-series ECG/EHR signals, deploying a FastAPI REST microservice in Docker, integrating SHAP (SHapley Additive exPlanations) for local explainability, and conducting multi-center clinical validation.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner with Sub-Tab Selector */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Architecture & Project Viva Guide</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Machine Learning Pipeline & Presentation Guide
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              End-to-end lifecycle architecture from raw data ingestion to feature engineering, model training, evaluation, and viva defense cards.
            </p>
          </div>

          {/* Sub Navigation Toggle Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedSubTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubTab === 'pipeline'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ML Pipeline (6 Stages)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubTab('features')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubTab === 'features'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Feature Dictionary
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubTab('viva')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedSubTab === 'viva'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Viva Defense Q&A
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: VISUAL ML LIFECYCLE FLOWCHART */}
      {(selectedSubTab === 'pipeline' || selectedSubTab === 'all') && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">End-to-End Machine Learning Pipeline</h2>
            <p className="text-xs text-slate-500">6-stage reproducible workflow implemented in the Jupyter notebook</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelineSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-lg ${step.color} text-white flex items-center justify-center font-bold text-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">STAGE {step.step}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>

                  <div className="bg-slate-900 text-slate-200 rounded-lg p-2.5 font-mono text-[11px] overflow-x-auto">
                    <pre>{step.code}</pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: FEATURE DATA DICTIONARY */}
      {(selectedSubTab === 'features' || selectedSubTab === 'all') && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Dataset Feature Dictionary (11 Input Variables)</h2>
            <p className="text-xs text-slate-500">Complete variable definitions, measurement units, and value ranges</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Variable ID</th>
                  <th className="py-3 px-3">Feature Name</th>
                  <th className="py-3 px-3">Data Type</th>
                  <th className="py-3 px-3">Unit / Scale</th>
                  <th className="py-3 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FEATURE_INFO.map((feat) => (
                  <tr key={feat.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{feat.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{feat.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600 text-[10px]">
                        {feat.unit === 'binary' ? 'Binary (0/1)' : feat.unit === '1-3 scale' ? 'Ordinal (1-3)' : 'Continuous (Int/Float)'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{feat.unit}</td>
                    <td className="py-2.5 px-3 text-slate-600">{feat.description}</td>
                  </tr>
                ))}
                <tr className="bg-rose-50/60 font-semibold">
                  <td className="py-2.5 px-3 font-mono text-rose-700 font-bold">cardio (Target)</td>
                  <td className="py-2.5 px-3 text-rose-900">Cardiovascular Disease</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-rose-100 font-mono text-rose-700 text-[10px]">
                      Target Binary (0/1)
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-rose-800">0: Absent, 1: Present</td>
                  <td className="py-2.5 px-3 text-rose-800">Presence or absence of cardiovascular disease</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: PROJECT EVALUATION / VIVA DEFENSE FLASHCARDS */}
      {(selectedSubTab === 'viva' || selectedSubTab === 'all') && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Project Evaluation & Viva Q&A Guide</h2>
                <p className="text-xs text-slate-500">Key questions and answers for academic or project defense</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                6 Core Topics
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {vivaQuestions.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-slate-200 rounded-xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between p-4 text-left bg-slate-50 hover:bg-slate-100 transition text-sm font-semibold text-slate-900"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        Q{idx + 1}
                      </span>
                      <span>{item.q}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      <div className="flex items-start space-x-2">
                        <span className="font-bold text-indigo-600 uppercase text-xs flex-shrink-0 mt-0.5">Answer:</span>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
