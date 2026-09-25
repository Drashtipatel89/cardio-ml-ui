import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center space-x-1.5 font-medium text-slate-700">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Cardiovascular Disease Prediction System</span>
        </div>
        <p className="text-slate-400">Trained with Machine Learning on 70,000 Patient Records</p>
      </div>
    </footer>
  );
}
