import React, { useState, useEffect } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts';
import { fetchScatterData } from '../api';

const SPECIES_COLORS = {
  setosa:     '#09D8C7',
  versicolor: '#BD0927',
  virginica:  '#A78BFA',
};

const DecisionBoundaryMap = ({ currentFeatures }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchScatterData().then(res => setData(res.points));
  }, []);

  if (!data.length) {
    return (
      <div className="glass-card">
        <div className="loading-pulse">
          <div className="pulse-dot" /><div className="pulse-dot" /><div className="pulse-dot" />
        </div>
      </div>
    );
  }

  const userPoint = {
    petal_length: currentFeatures.petalLength,
    petal_width:  currentFeatures.petalWidth,
    species: 'user',
    isUser: true,
  };

  const combined = [...data, userPoint];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      if (d.isUser) {
        return (
          <div style={{
            background: 'var(--navy-dark)', border: '1px solid var(--cyan)',
            borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem'
          }}>
            <div style={{ color: 'var(--cyan)', fontWeight: 700 }}>📍 Your Input</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>PL: {d.petal_length}</div>
            <div style={{ color: 'var(--text-secondary)' }}>PW: {d.petal_width}</div>
          </div>
        );
      }
      return (
        <div style={{
          background: 'var(--navy-dark)', border: '1px solid var(--card-border)',
          borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem'
        }}>
          <div style={{ color: SPECIES_COLORS[d.species] || 'var(--text-primary)', fontWeight: 600 }}>
            {d.species}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>PL: {d.petal_length}</div>
          <div style={{ color: 'var(--text-secondary)' }}>PW: {d.petal_width}</div>
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
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
            <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
          </svg>
        </span>
        Live Decision Boundary
      </h3>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Petal Length vs Petal Width — the two features that separate Iris species most cleanly.
        The <span style={{ color: '#fff', fontWeight: 600 }}>● white dot</span> is your current input.
      </p>

      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {Object.entries(SPECIES_COLORS).map(([sp, color]) => (
          <div key={sp} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {sp}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', border: '2px solid var(--cyan)', display: 'inline-block' }} />
          your input
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number" dataKey="petal_length" name="Petal Length (cm)"
              stroke="var(--text-secondary)" tick={{ fontSize: 11 }}
              label={{ value: 'Petal Length (cm)', position: 'insideBottom', offset: -14, fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <YAxis
              type="number" dataKey="petal_width" name="Petal Width (cm)"
              stroke="var(--text-secondary)" tick={{ fontSize: 11 }}
              label={{ value: 'Petal Width (cm)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={combined}>
              {combined.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isUser ? '#ffffff' : SPECIES_COLORS[entry.species] || '#888'}
                  stroke={entry.isUser ? 'var(--cyan)' : 'transparent'}
                  strokeWidth={entry.isUser ? 3 : 0}
                  r={entry.isUser ? 10 : 4}
                  style={{ filter: entry.isUser ? 'drop-shadow(0 0 8px var(--cyan))' : undefined }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DecisionBoundaryMap;
