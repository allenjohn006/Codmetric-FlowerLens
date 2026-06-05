import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, Cell, Legend
} from 'recharts';
import { fetchEDA } from '../api';

const SPECIES_COLORS = {
  setosa:     '#09D8C7',
  versicolor: '#BD0927',
  virginica:  '#A78BFA',
};

const FEATURE_COLORS = ['#09D8C7', '#BD0927', '#A78BFA', '#F59E0B'];

const EDAPanel = () => {
  const [edaData, setEdaData] = useState(null);

  useEffect(() => {
    fetchEDA().then(data => setEdaData(data));
  }, []);

  if (!edaData) {
    return (
      <div className="glass-card">
        <div className="loading-pulse">
          <div className="pulse-dot" /><div className="pulse-dot" /><div className="pulse-dot" />
        </div>
      </div>
    );
  }

  // Species Distribution
  const speciesCount = edaData.species.reduce((acc, sp) => {
    acc[sp] = (acc[sp] || 0) + 1;
    return acc;
  }, {});
  const speciesData = Object.keys(speciesCount).map(key => ({ name: key, count: speciesCount[key] }));

  // Summary stats per feature
  const featureStats = edaData.feature_names.map(feat => {
    const vals = edaData.features[feat];
    const sorted = [...vals].sort((a, b) => a - b);
    return {
      name: feat.replace(' (cm)', ''),
      min:  +Math.min(...vals).toFixed(2),
      max:  +Math.max(...vals).toFixed(2),
      mean: +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
    };
  });

  // Petal length histogram buckets
  const petalLengths = edaData.features['petal length (cm)'];
  const buckets = {};
  petalLengths.forEach(v => {
    const b = Math.floor(v * 2) / 2;
    buckets[b] = (buckets[b] || 0) + 1;
  });
  const histData = Object.keys(buckets).sort((a, b) => +a - +b).map(k => ({
    bin: `${k}`,
    count: buckets[k],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'var(--navy-dark)', border: '1px solid var(--card-border)',
          borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem'
        }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
          {payload.map(p => (
            <div key={p.name} style={{ color: p.color || 'var(--cyan)', fontWeight: 600 }}>
              {p.name}: {p.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">
        <span className="icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
        </span>
        Exploratory Data Analysis
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          Iris Dataset — 150 samples, 4 features, 3 classes
        </span>
      </h3>

      <div className="chart-grid">
        {/* 1 — Species Distribution */}
        <div className="chart-box">
          <h4>Species Distribution</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={speciesData} margin={{ top: 4, right: 10, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {speciesData.map((entry, i) => (
                  <Cell key={i} fill={SPECIES_COLORS[entry.name] || '#09D8C7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2 — Petal Length Histogram */}
        <div className="chart-box">
          <h4>Petal Length Distribution</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={histData} margin={{ top: 4, right: 10, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="bin" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
              <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#09D8C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3 — Feature Stats: Min / Mean / Max */}
        <div className="chart-box">
          <h4>Feature Range (Min / Mean / Max)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={featureStats} layout="vertical" margin={{ top: 4, right: 16, left: 20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={90} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} />
              <Bar dataKey="min"  fill="#09D8C7" name="Min"  radius={[0, 3, 3, 0]} />
              <Bar dataKey="mean" fill="#BD0927" name="Mean" radius={[0, 3, 3, 0]} />
              <Bar dataKey="max"  fill="#A78BFA" name="Max"  radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4 — Scatter: Petal Length vs Petal Width by Species */}
        <div className="chart-box">
          <h4>Petal Scatter by Species</h4>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" dataKey="x" name="Petal Length" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
              <YAxis type="number" dataKey="y" name="Petal Width"  stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              {Object.keys(SPECIES_COLORS).map(sp => {
                const pts = edaData.features['petal length (cm)']
                  .map((pl, i) => ({
                    x: pl,
                    y: edaData.features['petal width (cm)'][i],
                    species: edaData.species[i],
                  }))
                  .filter(p => p.species === sp);
                return (
                  <Scatter key={sp} name={sp} data={pts} fill={SPECIES_COLORS[sp]} r={3} />
                );
              })}
              <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EDAPanel;
