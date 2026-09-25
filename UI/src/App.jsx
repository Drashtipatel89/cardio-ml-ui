import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Predictor from './components/Predictor';

const DEFAULT_PATIENT = {
  age: 50,
  gender: 1,      // 1: Female, 2: Male
  height: 165,
  weight: 68,
  ap_hi: 120,
  ap_lo: 80,
  cholesterol: 1, // 1: Normal, 2: Above Normal, 3: High
  gluc: 1,        // 1: Normal, 2: Above Normal, 3: High
  smoke: 0,
  alco: 0,
  active: 1,
};

export default function App() {
  const [patient, setPatient] = useState(DEFAULT_PATIENT);

  const handleReset = () => {
    setPatient(DEFAULT_PATIENT);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Clean & Simple Header */}
      <Navbar onReset={handleReset} />

      {/* Main Single Predictor UI */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Predictor 
          patient={patient} 
          setPatient={setPatient} 
          onReset={handleReset} 
        />
      </main>

      {/* Clean Footer */}
      <Footer />

    </div>
  );
}
