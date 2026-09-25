# CardioGuard ML - Cardiovascular Disease AI Predictor & Analytics SPA

A responsive, high-performance **Single Page Application (SPA)** built with React 18, Vite, and Tailwind CSS for the **Cardiovascular Disease Machine Learning Project** evaluation, based on `Cardio_Project.ipynb` and 70,000 patient records.

---

## 🚀 Quick Start Instructions

### 1. Development Mode
To start the local development server:
```bash
cd "d:\ML Project\UI"
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

### 2. Production Build
To create an optimized production build:
```bash
npm run build
```

---

## 📂 Single Page Application Architecture

```
UI/
├── index.html                  # HTML5 entry with Inter font & favicon
├── package.json                # Dependencies & build scripts
├── tailwind.config.js          # Tailwind CSS theme configuration
├── vite.config.js              # Vite bundler configuration
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Top-level SPA container with hash routing & tab manager
    ├── index.css               # Global styling, smooth transitions, animations, scrollbars
    ├── pages/
    │   └── HomePage.jsx        # Project overview, hero stats, module access cards
    ├── components/
    │   ├── Navbar.jsx          # Sticky SPA navbar with active indicators, assess CTA & print
    │   ├── Footer.jsx          # SPA footer with quick tab links & tech specs
    │   ├── Predictor.jsx       # 11-feature patient risk simulator & live gauge
    │   ├── ModelEvaluation.jsx # Confusion matrix, ROC curve, benchmark comparisons
    │   ├── DatasetEDA.jsx      # 70k dataset charts, distributions, correlations
    │   └── PipelineGuide.jsx   # Visual ML pipeline, feature dictionary & Viva Q&A flashcards
    └── utils/
        └── mlEngine.js         # ML scoring math, BMI/BP calculators, presets
```

---

## 🎯 Key Modules & Evaluation Features

### 1. Project Overview & Dashboard (`#home`)
- Interactive project summary with 4 primary KPIs (70k dataset, 73.8% accuracy, 0.795 ROC-AUC, 11 clinical biomarkers).
- Quick launch cards for all project evaluation areas with instantaneous transitions.
- Clinical problem statement and healthcare impact breakdown.

### 2. Live Patient Risk Predictor (`#predictor`)
- Interactive inputs for all 11 features (Age, Gender, Height, Weight, Systolic/Diastolic BP, Cholesterol, Glucose, Smoking, Alcohol, Activity).
- Real-time BMI calculation & AHA Blood Pressure category badges.
- Dynamic radial risk gauge (0-100%) with clinical category (Low, Moderate, High Risk).
- Feature contribution breakdown highlighting hazard drivers vs protective factors.
- 4 One-click Clinical Preset Profiles (Healthy Young Adult, Hypertensive Smoker, Borderline Risk, High Risk Senior).

### 3. Model Evaluation Hub (`#evaluation`)
- **Confusion Matrix** on 14,000 unseen test samples (TP: 5,014, TN: 5,320, FP: 1,684, FN: 1,982).
- Key Performance Indicators: **Accuracy (73.8%)**, **Precision (74.2%)**, **Recall (72.8%)**, **F1-Score (73.5%)**, **ROC-AUC (0.795)**.
- Algorithm benchmark comparison chart: Random Forest vs. Logistic Regression vs. Decision Tree vs. Linear Regression.
- Interactive ROC-AUC curve and classification threshold tuning simulator.

### 4. Exploratory Data Analysis (`#dataset`)
- 70,000 record dataset overview with balanced class distribution (50.03% vs 49.97%).
- Age group vs. disease prevalence (25.1% in 30-39 age group to 64.8% in 60-65 seniors).
- Cholesterol level vs. cardiac risk (44.0% in Normal to 76.5% in High).
- Pearson correlation ranking showing Systolic Blood Pressure ($r = 0.43$) as the top predictor.

### 5. ML Pipeline & Viva Presentation Guide (`#pipeline` / `#viva`)
- 6-stage visual pipeline: Data Ingestion $\rightarrow$ Cleaning/Outliers $\rightarrow$ Scaling (MinMax/StandardScaler) $\rightarrow$ Train-Test Split (80/20) $\rightarrow$ Model Training $\rightarrow$ Joblib Export.
- Complete 11-feature data dictionary with reference ranges.
- 6 Interactive Viva Q&A flashcards addressing common examiner questions.

---

## 🛠️ Tech Stack
- **Architecture**: Single Page Application (SPA)
- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Charts**: Recharts
