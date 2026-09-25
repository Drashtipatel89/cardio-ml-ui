import React from 'react';
import { 
  Heart, Activity, BarChart3, Database, GitBranch, 
  Award, ArrowRight, ShieldCheck, Zap, Users, CheckCircle2, 
  Sparkles, Gauge, Stethoscope, ChevronRight 
} from 'lucide-react';

export default function HomePage({ onSelectTab }) {
  const features = [
    {
      title: 'Live Patient Risk Predictor',
      description: 'Interactive simulator evaluating 11 clinical biomarkers with real-time BMI, BP staging, and risk percentage gauge.',
      icon: Activity,
      tab: 'predictor',
      badge: 'Interactive AI',
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Model Performance & Evaluation',
      description: 'Confusion Matrix on 14,000 test cases, 73.8% accuracy benchmarks, ROC-AUC curve, and threshold simulator.',
      icon: BarChart3,
      tab: 'evaluation',
      badge: 'Evaluation Ready',
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Dataset & Exploratory Analysis',
      description: '70,000 patient records exploratory analytics, age group progression, cholesterol risk surge, and correlation heatmap.',
      icon: Database,
      tab: 'eda',
      badge: '70k Instances',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'ML Pipeline & Architecture',
      description: '6-stage lifecycle architecture from data cleaning, outlier handling, and scaling to Joblib production export.',
      icon: GitBranch,
      tab: 'pipeline',
      badge: 'Architecture',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Project Viva & Defense Guide',
      description: 'Structured Q&A flashcards addressing core examiner questions on methodology, metrics, scaling, and future scope.',
      icon: Award,
      tab: 'presentation',
      badge: 'Viva Flashcards',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-rose-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Machine Learning Academic Project • Single Page App</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Cardiovascular Disease Risk Prediction & Analytics
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            An end-to-end clinical machine learning solution trained on <strong>70,000 real-world medical records</strong> to predict heart disease risk using non-invasive biomarkers with <strong>73.8% test accuracy</strong> and <strong>0.795 ROC-AUC</strong>.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('predictor')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50 flex items-center space-x-2 active:scale-95 transition"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Live Predictor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('evaluation')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-slate-100 border border-white/20 flex items-center space-x-2 active:scale-95 transition"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Evaluation Metrics</span>
            </button>
          </div>
        </div>

        {/* 4 Key Stat Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
          <div>
            <span className="text-slate-400 text-xs block">Training Dataset</span>
            <span className="text-2xl font-black text-white">70,000</span>
            <span className="text-[11px] text-slate-400 block">Patient Records</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Model Accuracy</span>
            <span className="text-2xl font-black text-emerald-400">73.8%</span>
            <span className="text-[11px] text-slate-400 block">On 14k Test Set</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block">ROC-AUC Score</span>
            <span className="text-2xl font-black text-purple-300">0.795</span>
            <span className="text-[11px] text-slate-400 block">Discriminative Power</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block">Clinical Features</span>
            <span className="text-2xl font-black text-amber-300">11</span>
            <span className="text-[11px] text-slate-400 block">Non-Invasive Markers</span>
          </div>
        </div>
      </section>

      {/* Explore Project Modules Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Explore Project Modules
          </h2>
          <p className="text-sm text-slate-500">
            Navigate through dedicated interactive modules in this single page application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => onSelectTab && onSelectTab(item.tab)}
                className="group text-left bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-200 flex flex-col justify-between space-y-4 focus:outline-none"
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.bgColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-rose-600 w-full">
                  <span>Open Section</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Problem Statement & Clinical Relevance */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
          <Stethoscope className="w-5 h-5" />
          <span>Clinical Problem Statement & Impact</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Why Machine Learning for Cardiovascular Detection?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm block">1. Global Healthcare Burden</span>
            <p>Cardiovascular disease causes 17.9 million deaths annually. Asymptomatic onset makes early predictive screening critical for preventing heart attacks and strokes.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm block">2. Non-Invasive Biomarkers</span>
            <p>Our model utilizes easily accessible clinical parameters (Blood Pressure, Age, BMI, Cholesterol, Glucose, Lifestyle) without requiring costly angiograms or CT scans.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm block">3. High Practical Utility</span>
            <p>With a 73.8% test accuracy and balanced sensitivity (72.8%), the tool serves as an intelligent clinical triage assistant in primary healthcare centers.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
