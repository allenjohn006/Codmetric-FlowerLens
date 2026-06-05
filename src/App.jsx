import React, { useState, useEffect } from 'react';
import EDAPanel from './components/EDAPanel';
import ClassifierSliders from './components/ClassifierSliders';
import ExplainabilityChart from './components/ExplainabilityChart';
import DecisionBoundaryMap from './components/DecisionBoundaryMap';
import ModelComparison from './components/ModelComparison';
import { predictSpecies } from './api';
import './index.css';

function App() {
  const [features, setFeatures] = useState({
    sepalLength: 5.1,
    sepalWidth: 3.5,
    petalLength: 1.4,
    petalWidth: 0.2,
  });

  const [modelType, setModelType] = useState('rf');
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      predictSpecies(features, modelType).then(res => {
        setPredictionResult(res);
      }).catch(console.error);
    }, 150);
    return () => clearTimeout(timer);
  }, [features, modelType]);

  const speciesColors = ['species-0', 'species-1', 'species-2'];

  return (
    <div className="app-container">

      {/* ── Header ────────────────────────────── */}
      <header className="header">
        <div className="header-badge">
          <span>🌸</span>
          <span>Interactive ML Explainability Tool</span>
        </div>
        <h1>FlowerLens</h1>
        <p>
          Iris species classifier powered by real-time machine learning.
          Move the sliders and watch the model explain its reasoning live.
        </p>
        <div className="header-divider" />
      </header>

      {/* ── Main Dashboard ────────────────────── */}
      <div className="dashboard-grid">

        {/* LEFT — Controls + Metrics */}
        <div className="left-column">
          <ClassifierSliders features={features} setFeatures={setFeatures} />

          {/* Prediction result */}
          <div className="glass-card prediction-box">
            <div className="prediction-label">Live Prediction</div>
            {predictionResult ? (
              <>
                <div className={`prediction-result ${speciesColors[predictionResult.prediction_index] || ''}`}>
                  Iris {predictionResult.prediction}
                </div>
                {/* Probability pills */}
                {predictionResult.probabilities && (
                  <div className="prob-pills">
                    {Object.entries(predictionResult.probabilities).map(([sp, prob], i) => (
                      <div key={sp} className="prob-pill">
                        <span className="prob-pill-name">{sp}</span>
                        <span
                          className={`prob-pill-value ${speciesColors[i]}`}
                          style={{ color: i === predictionResult.prediction_index ? undefined : 'var(--text-secondary)' }}
                        >
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="loading-pulse">
                <div className="pulse-dot" />
                <div className="pulse-dot" />
                <div className="pulse-dot" />
              </div>
            )}
          </div>

          <ModelComparison currentModel={modelType} setCurrentModel={setModelType} />
        </div>

        {/* RIGHT — XAI + Decision Boundary */}
        <div className="right-column">
          {predictionResult && (
            <ExplainabilityChart
              featureImportance={predictionResult.feature_importance}
              predictionLabel={predictionResult.prediction}
            />
          )}
          {predictionResult && (
            <DecisionBoundaryMap
              currentFeatures={features}
              predictionIndex={predictionResult.prediction_index}
            />
          )}
        </div>
      </div>

      {/* ── EDA Section ───────────────────────── */}
      <div className="section-divider">Exploratory Data Analysis</div>
      <EDAPanel />

    </div>
  );
}

export default App;
