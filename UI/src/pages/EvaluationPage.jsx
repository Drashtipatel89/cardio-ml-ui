import React from 'react';
import { Link } from 'react-router-dom';
import ModelEvaluation from '../components/ModelEvaluation';
import { Home, ChevronRight, ArrowRight, Database, Activity } from 'lucide-react';

export default function EvaluationPage() {
  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 flex items-center space-x-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-800">Model Evaluation & Metrics</span>
      </nav>

      {/* Main Model Evaluation Component */}
      <ModelEvaluation />

      {/* Bottom Next Page Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Next Evaluation Section</span>
          <span className="text-base font-bold text-slate-900">Explore 70,000 Patient Dataset Distributions & Correlations</span>
        </div>
        <Link
          to="/dataset"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-2 transition"
        >
          <span>Go to Dataset & EDA Page</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
