"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/predict";

const FIELDS = [
  {
    name: "tenure",
    label: "Tenure",
    unit: "months",
    type: "number",
    placeholder: "24",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    description: "Customer lifetime duration",
  },
  {
    name: "MonthlyCharges",
    label: "Monthly Charges",
    unit: "$",
    type: "number",
    placeholder: "75.50",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description: "Amount billed monthly",
  },
  {
    name: "TotalCharges",
    label: "Total Charges",
    unit: "$",
    type: "number",
    placeholder: "1800.00",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    description: "Cumulative amount charged",
  },
  {
    name: "InternetService_Fiber_optic",
    label: "Fiber Optic Internet",
    type: "toggle",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    description: "Uses fiber optic service",
  },
  {
    name: "PaymentMethod_Electronic_check",
    label: "Electronic Check",
    type: "toggle",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    description: "Pays via electronic check",
  },
  {
    name: "Contract_Two_year",
    label: "Two-Year Contract",
    type: "toggle",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    description: "Locked into 2-year plan",
  },
  {
    name: "OnlineSecurity_Yes",
    label: "Online Security",
    type: "toggle",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    description: "Has security add-on",
  },
  {
    name: "TechSupport_Yes",
    label: "Tech Support",
    type: "toggle",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    description: "Has tech support plan",
  },
  {
    name: "PaperlessBilling_Yes",
    label: "Paperless Billing",
    type: "toggle",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    description: "E-billing enabled",
  },
  {
    name: "Partner_Yes",
    label: "Has Partner",
    type: "toggle",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    description: "Customer has a partner",
  },
];

// ========== Donut Chart ==========
function DonutChart({ probability }) {
  const churnPct = probability * 100;
  const retainPct = 100 - churnPct;
  const circumference = 2 * Math.PI * 70;
  const churnDash = (churnPct / 100) * circumference;
  const retainDash = (retainPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
          <circle
            cx="90" cy="90" r="70"
            fill="none" stroke="#e2e8f0" strokeWidth="18"
          />
          <circle
            cx="90" cy="90" r="70"
            fill="none" stroke="#10b981" strokeWidth="18"
            strokeDasharray={`${retainDash} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          <circle
            cx="90" cy="90" r="70"
            fill="none" stroke="#ef4444" strokeWidth="18"
            strokeDasharray={`${churnDash} ${circumference}`}
            strokeDashoffset={`${-retainDash}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{churnPct.toFixed(1)}%</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">churn risk</span>
        </div>
      </div>
      <div className="flex gap-5 text-xs font-medium">
        <span className="flex items-center gap-1.5 text-red-600">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          Churn {churnPct.toFixed(1)}%
        </span>
        <span className="flex items-center gap-1.5 text-emerald-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Retain {retainPct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

// ========== SHAP Feature Impact Chart ==========
function ShapChart({ shapValues, baseValue }) {
  if (!shapValues || shapValues.length === 0) return null;

  const maxAbs = Math.max(...shapValues.map((s) => Math.abs(s.value)), 0.001);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">SHAP — Feature Impact</p>
          <p className="text-[10px] text-gray-400">How each feature pushes the prediction</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
          Pushes toward churn
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
          Pushes toward retention
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-1.5">
        {shapValues.map((item, idx) => {
          const pct = (Math.abs(item.value) / maxAbs) * 100;
          const isChurn = item.value > 0;
          return (
            <div key={idx} className="group">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-600 font-medium w-[120px] truncate text-right shrink-0">
                  {item.feature}
                </span>
                <div className="flex-1 flex items-center h-6 relative">
                  {/* center line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 z-10" />
                  {/* bar */}
                  {isChurn ? (
                    <div className="absolute left-1/2 h-5 rounded-r-md bg-red-500 transition-all duration-700 ease-out"
                      style={{ width: `${pct / 2}%` }}
                    />
                  ) : (
                    <div className="absolute right-1/2 h-5 rounded-l-md bg-emerald-500 transition-all duration-700 ease-out"
                      style={{ width: `${pct / 2}%` }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-bold w-[50px] text-right shrink-0 ${
                  isChurn ? "text-red-600" : "text-emerald-600"
                }`}>
                  {item.value > 0 ? "+" : ""}{item.value.toFixed(4)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 text-center pt-1">
        Positive values increase churn risk, while negative values support customer retention.
      </p>

      {/* Base value note */}
      {baseValue !== undefined && (
        <div className="text-[10px] text-gray-400 text-center pt-1 border-t border-gray-100 mt-2">
          Base value (avg. model output): <span className="font-semibold text-gray-500">{baseValue.toFixed(4)}</span>
        </div>
      )}
    </div>
  );
}

// ========== Spinner ==========
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-[3px] border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-[3px] border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
      <span className="text-sm text-gray-500 font-medium animate-pulse">Analyzing customer data...</span>
    </div>
  );
}

// ========== Toggle Switch ==========
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ========== Main Page ==========
export default function Home() {
  const [formData, setFormData] = useState({
    tenure: "",
    MonthlyCharges: "",
    TotalCharges: "",
    InternetService_Fiber_optic: 0,
    PaymentMethod_Electronic_check: 0,
    Contract_Two_year: 0,
    OnlineSecurity_Yes: 0,
    TechSupport_Yes: 0,
    PaperlessBilling_Yes: 0,
    Partner_Yes: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getProbabilityDescription = (confidence) => {
    if (confidence > 70) return "High churn likelihood: this customer may leave soon without intervention.";
    if (confidence > 40) return "Moderate churn likelihood: proactive follow-up is advised.";
    return "Low churn likelihood: this customer is likely to stay.";
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    const numericFields = ["tenure", "MonthlyCharges", "TotalCharges"];
    for (const f of numericFields) {
      if (formData[f] === "" || isNaN(Number(formData[f])) || Number(formData[f]) < 0) {
        setError(`Please enter a valid positive number for ${FIELDS.find(x => x.name === f)?.label || f}`);
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...formData,
      tenure: parseFloat(formData.tenure),
      MonthlyCharges: parseFloat(formData.MonthlyCharges),
      TotalCharges: parseFloat(formData.TotalCharges),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the prediction server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      tenure: "",
      MonthlyCharges: "",
      TotalCharges: "",
      InternetService_Fiber_optic: 0,
      PaymentMethod_Electronic_check: 0,
      Contract_Two_year: 0,
      OnlineSecurity_Yes: 0,
      TechSupport_Yes: 0,
      PaperlessBilling_Yes: 0,
      Partner_Yes: 0,
    });
    setResult(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ===== Navbar ===== */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">ChurnDetecter</span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Model Online
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Random Forest ML Model
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Customer Churn Prediction
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
            Enter customer attributes to predict retention risk. Get instant probability scores and actionable insights.
          </p>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* -------- Form Panel -------- */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Customer Profile
              </h2>
              <p className="text-xs text-gray-400 mb-6 ml-9">Fill in the 10 feature inputs below</p>

              {/* Numeric Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {FIELDS.filter(f => f.type === "number").map((field) => (
                  <div key={field.name}>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                      </svg>
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      />
                      {field.unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{field.unit}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-0.5">{field.description}</p>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Service Features</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Toggle Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FIELDS.filter(f => f.type === "toggle").map((field) => (
                  <div
                    key={field.name}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      formData[field.name] === 1
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        formData[field.name] === 1 ? "bg-blue-100" : "bg-white border border-gray-200"
                      }`}>
                        <svg className={`w-3.5 h-3.5 ${formData[field.name] === 1 ? "text-blue-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800 block leading-tight">{field.label}</span>
                        <span className="text-[10px] text-gray-400">{field.description}</span>
                      </div>
                    </div>
                    <Toggle
                      checked={formData[field.name] === 1}
                      onChange={(v) => handleChange(field.name, v ? 1 : 0)}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Run Prediction
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* -------- Results Panel -------- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 sticky top-6">
              <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Analysis Results
              </h2>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Loading */}
              {loading && <Spinner />}

              {/* Empty State */}
              {!loading && !result && !error && (
                <div className="text-center py-14">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-400">Awaiting Input</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">Fill in the customer profile and click Run Prediction</p>
                </div>
              )}

              {/* ===== Results ===== */}
              {result && !loading && (
                <div className="space-y-5">
                  {/* Status Badge */}
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold ${
                        result.prediction === 1
                          ? "bg-red-50 border border-red-200 text-red-700"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      }`}
                    >
                      {result.prediction === 1 ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {result.prediction === 1 ? "Likely to Churn" : "Likely to Stay"}
                    </div>
                  </div>

                  {/* Probability Bar */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center text-sm mb-2.5">
                      <span className="font-medium text-gray-600">Churn Probability</span>
                      <span className={`text-lg font-black ${result.confidence > 50 ? "text-red-600" : "text-emerald-600"}`}>
                        {result.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          result.confidence > 50 ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {getProbabilityDescription(result.confidence)}
                    </p>
                  </div>

                  {/* Donut Chart */}
                  <DonutChart probability={result.probability} />

                  {/* SHAP Feature Impact */}
                  {result.shap_values && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <ShapChart shapValues={result.shap_values} baseValue={result.shap_base_value} />
                    </div>
                  )}

                  {/* Risk Assessment */}
                  <div className={`rounded-lg p-4 text-center border ${
                    result.confidence > 70
                      ? "bg-red-50 border-red-200"
                      : result.confidence > 40
                      ? "bg-amber-50 border-amber-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Risk Assessment</p>
                    <p className={`text-lg font-black ${
                      result.confidence > 70
                        ? "text-red-600"
                        : result.confidence > 40
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}>
                      {result.confidence > 70 ? "HIGH RISK" : result.confidence > 40 ? "MEDIUM RISK" : "LOW RISK"}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {result.confidence > 70
                        ? "Immediate intervention recommended"
                        : result.confidence > 40
                        ? "Monitor and engage proactively"
                        : "Customer appears satisfied"}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Status</p>
                      <p className={`text-sm font-bold mt-0.5 ${result.prediction === 1 ? "text-red-600" : "text-emerald-600"}`}>
                        {result.churn === "Yes" ? "Churning" : "Retained"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Confidence</p>
                      <p className="text-sm font-bold mt-0.5 text-blue-600">
                        {result.confidence > 50 ? result.confidence : (100 - result.confidence).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-500">ChurnDetecter</span>
            </div>
            <span>FastAPI &middot; Next.js &middot; Random Forest</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
