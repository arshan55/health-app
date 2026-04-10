"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function SimulatorPage() {
  const [currentWeight, setCurrentWeight] = useState("75");
  const [dailyTDEE, setDailyTDEE] = useState("2500");
  const [plannedIntake, setPlannedIntake] = useState("2000");
  const [projections, setProjections] = useState<{ day: number; date: string; estimated_weight: number }[]>([]);

  const handleSimulate = async () => {
    const weight = parseFloat(currentWeight);
    const tdee = parseFloat(dailyTDEE);
    const intake = parseFloat(plannedIntake);

    if (isNaN(weight) || isNaN(tdee) || isNaN(intake)) return;

    const data = [];
    let w = weight;
    for (let i = 0; i < 30; i++) {
        const delta = intake - tdee;
        const diff = delta / 7700;
        w += diff;
        
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        data.push({
            day: i + 1,
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            estimated_weight: Number(w.toFixed(2))
        });
    }
    
    setProjections(data);
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
           <h1>AI Impact Simulator</h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Predict your 30-day biometric trajectory based on daily habits.</p>
        </div>
        <Link href="/" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        
        {/* Input Parameters */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Simulation Parameters</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Current Weight (kg)</label>
              <input type="number" className="input-field" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Daily TDEE (kcal)</label>
              <input type="number" className="input-field" value={dailyTDEE} onChange={(e) => setDailyTDEE(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>Planned Intake (kcal)</label>
              <input type="number" className="input-field" value={plannedIntake} onChange={(e) => setPlannedIntake(e.target.value)} />
            </div>
            <button className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} onClick={handleSimulate}>Run Simulation</button>
          </div>
        </div>

        {/* Results List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: '#f9fafb' }}>
             <h2 style={{ fontSize: '1.25rem', color: 'var(--foreground)', margin: 0 }}>Trajectory Results</h2>
          </div>
          
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {projections.length > 0 ? (
               <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'white', position: 'sticky', top: 0, borderBottom: '1px solid var(--border)' }}>
                      <tr>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Day</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                          <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Est. Weight</th>
                      </tr>
                  </thead>
                  <tbody>
                      {projections.map((p, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#f9fafb' }}>
                              <td style={{ padding: '0.875rem 1.5rem', color: 'var(--text-muted)' }}>{p.day}</td>
                              <td style={{ padding: '0.875rem 1.5rem', color: 'var(--foreground)' }}>{p.date}</td>
                              <td style={{ padding: '0.875rem 1.5rem', fontWeight: '600', color: 'var(--primary)' }}>{p.estimated_weight.toFixed(2)} kg</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Run the simulation to see your 30-day projection here.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
