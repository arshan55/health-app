"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [macros, setMacros] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [log, setLog] = useState<any[]>([]);

  useEffect(() => {
    const macroData = localStorage.getItem('daily-macros');
    if (macroData) setMacros(JSON.parse(macroData));

    const logData = localStorage.getItem('food-log');
    if (logData) setLog(JSON.parse(logData));
  }, []);

  const handleReset = () => {
    localStorage.removeItem('daily-macros');
    localStorage.removeItem('food-log');
    setMacros({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    setLog([]);
  };

  const PROT_GOAL = 150;
  const CARB_GOAL = 200;
  const FAT_GOAL = 70;
  const CAL_GOAL = 2200;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Daily Overview</h1>
        <button className="btn-secondary" onClick={handleReset} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          Reset Daily Intake
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Calorie Progress */}
        <section className="card animate-in delay-1">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Energy Balance</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', margin: '1rem 0', color: 'var(--foreground)' }}>
            {macros.calories} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {CAL_GOAL} kcal</span>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${Math.min((macros.calories / CAL_GOAL) * 100, 100)}%` }}></div>
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Remaining: {Math.max(CAL_GOAL - macros.calories, 0)} kcal
          </p>
        </section>

        {/* Macro Breakdown */}
        <section className="card animate-in delay-2">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Macronutrients</h2>
          <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                <span>Protein</span><span>{macros.protein}g / {PROT_GOAL}g</span>
              </div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: `${Math.min((macros.protein / PROT_GOAL) * 100, 100)}%`, background: '#3b82f6' }}></div></div>
            </li>
            <li>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                <span>Carbs</span><span>{macros.carbs}g / {CARB_GOAL}g</span>
              </div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: `${Math.min((macros.carbs / CARB_GOAL) * 100, 100)}%`, background: '#f59e0b' }}></div></div>
            </li>
            <li>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
                <span>Fats</span><span>{macros.fats}g / {FAT_GOAL}g</span>
              </div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: `${Math.min((macros.fats / FAT_GOAL) * 100, 100)}%`, background: '#ef4444' }}></div></div>
            </li>
          </ul>
        </section>

        {/* Logged Foods List */}
        <section className="card animate-in delay-3" style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Today's Log</h2>
          {log.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {log.map((item, i) => (
                <li key={i} className="food-log-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontWeight: '500', color: 'var(--foreground)' }}>{item.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{item.time}</span>
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{item.calories} kcal</div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No meals logged today yet.</div>
          )}
        </section>

      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link href="/log" className="btn-primary" aria-label="Navigate to log a meal page">Log a Meal</Link>
      </div>
    </div>
  );
}
