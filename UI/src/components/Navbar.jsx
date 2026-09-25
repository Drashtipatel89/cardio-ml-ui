import React from 'react';
import { Heart, RotateCcw } from 'lucide-react';

export default function Navbar({ onReset }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">Heart Disease Prediction</h1>
              <p className="text-xs text-slate-500">AI-Based Health Risk Assessment</p>
            </div>
          </div>

          {/* Quick Action */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              title="Reset all inputs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Inputs</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
