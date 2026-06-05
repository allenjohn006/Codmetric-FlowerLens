import React, { useState, useEffect } from 'react';
import { fetchModelsInfo } from '../api';

const MODEL_LABELS = {
  rf:  'Random Forest',
  dt:  'Decision Tree',
  svm: 'SVM',
  knn: 'KNN',
};

const ModelComparison = ({ currentModel, setCurrentModel }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchModelsInfo().then(data => setMetrics(data));
  }, []);

  if (!metrics) {
    return (
      <div className="glass-card">
        <div className="loading-pulse">
          <div className="pulse-dot" /><div className="pulse-dot" /><div className="pulse-dot" />
        </div>
      </div>
    );
  }

  const m = metrics[currentModel];

  return (
    <div className="glass-card">
      <h3 className="card-title">
        <span className="icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </span>
        Model Evaluation
      </h3>

      <select
        className="model-selector"
        value={currentModel}
        onChange={e => setCurrentModel(e.target.value)}
      >
        {Object.entries(MODEL_LABELS).map(([id, label]) => (
          <option key={id} value={id}>{label}</option>
        ))}
      </select>

      <div className="metric-grid">
        {[
          { label: 'Accuracy',  value: m.accuracy },
          { label: 'Precision', value: m.precision },
          { label: 'Recall',    value: m.recall },
          { label: 'F1 Score',  value: m.f1 },
        ].map(({ label, value }) => (
          <div key={label} className="metric-item">
            <div className="metric-value">{(value * 100).toFixed(1)}%</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelComparison;
