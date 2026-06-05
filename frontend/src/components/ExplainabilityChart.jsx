import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#09D8C7', '#BD0927', '#A78BFA', '#F59E0B'];

const ExplainabilityChart = ({ featureImportance, predictionLabel }) => {
  if (!featureImportance) {
    return (
      <div className="glass-card">
        <h3 className="card-title">
          <span className="icon icon-red">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          Explainable AI — XAI
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          Feature importance is available for <strong style={{ color: 'var(--cyan)' }}>Random Forest</strong> and <strong style={{ color: 'var(--cyan)' }}>Decision Tree</strong> models only. Switch your model to see why a decision was made.
        </p>
      </div>
    );
  }

  const data = Object.entries(featureImportance)
    .map(([key, val]) => ({
      name: key.replace(' (cm)', ''),
      importance: parseFloat((val * 100).toFixed(1)),
    }))
    .sort((a, b) => b.importance - a.importance);

  const top = data[0];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'var(--navy-dark)',
          border: '1px solid var(--card-border)',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: '0.82rem',
        }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{payload[0].payload.name}</div>
          <div style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '1rem' }}>
            {payload[0].value}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">
        <span className="icon icon-red">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
        </span>
        Why <span style={{ color: 'var(--cyan)', margin: '0 6px' }}>Iris {predictionLabel}</span>?
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        <span style={{ color: 'var(--crimson)', fontWeight: 600 }}>{top.name}</span> contributed{' '}
        <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{top.importance}%</span> to this prediction — the primary deciding factor.
      </p>

      <div className="chart-container" style={{ height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" stroke="var(--text-secondary)" domain={[0, 100]} tickFormatter={v => `${v}%`} />
            <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={110} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExplainabilityChart;
