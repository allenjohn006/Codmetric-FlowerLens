import React from 'react';

const ClassifierSliders = ({ features, setFeatures }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatures(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const sliderConfig = [
    { name: 'sepalLength', label: 'Sepal Length', unit: 'cm', min: 4.0, max: 8.0, step: 0.1 },
    { name: 'sepalWidth',  label: 'Sepal Width',  unit: 'cm', min: 2.0, max: 4.5, step: 0.1 },
    { name: 'petalLength', label: 'Petal Length', unit: 'cm', min: 1.0, max: 7.0, step: 0.1 },
    { name: 'petalWidth',  label: 'Petal Width',  unit: 'cm', min: 0.1, max: 2.5, step: 0.1 },
  ];

  return (
    <div className="glass-card">
      <h3 className="card-title">
        <span className="icon">
          {/* Sliders icon SVG */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
            <circle cx="10" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="8" cy="18" r="2" fill="currentColor"/>
          </svg>
        </span>
        Input Parameters
      </h3>

      {sliderConfig.map(cfg => (
        <div key={cfg.name} className="slider-group">
          <div className="slider-header">
            <span className="slider-label">{cfg.label}</span>
            <span className="slider-value">{features[cfg.name]} {cfg.unit}</span>
          </div>
          <input
            type="range"
            name={cfg.name}
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={features[cfg.name]}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};

export default ClassifierSliders;
