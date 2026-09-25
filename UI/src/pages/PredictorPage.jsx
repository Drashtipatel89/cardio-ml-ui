import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Predictor from '../components/Predictor';
import { Home, ChevronRight, Activity, ArrowRight, BarChart3, Database } from 'lucide-react';

export default function PredictorPage() {
  const navigate = useNavigate();

  const handleSelectTab = (tab) => {
    if (tab === 'evaluation') navigate('/evaluation');
    else if (tab === 'eda') navigate('/dataset');
    else if (tab === 'pipeline') navigate('/pipeline');
    else if (tab === 'presentation') navigate('/viva');
    else navigate('/');
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 flex items-center space-x-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-800">Live Risk Predictor</span>
      </nav>

      {/* Main Predictor Component */}
      <Predictor onSelectTab={handleSelectTab} />

      {/* Bottom Next Page Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Next Evaluation Section</span>
          <span className="text-base font-bold text-slate-900">Check Model Accuracy & Confusion Matrix</span>
        </div>
        <Link
          to="/evaluation"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-2 transition"
        >
          <span>Go to Model Evaluation Page</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
