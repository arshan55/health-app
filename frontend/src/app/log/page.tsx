"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function LogPage() {
  const [food, setFood] = useState("");
  const [status, setStatus] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!food.trim()) return;
    setStatus(`Searching database for: ${food}...`);
    // Mock API delay
    setTimeout(() => {
      const macros = { calories: 350, protein: 15, carbs: 45, fats: 10 };
      setStatus(`Successfully logged 1 serving of ${food}! (+350 kcal)`);
      saveToStorage(food, macros);
      setFood("");
    }, 1000);
  };

  const saveToStorage = (name: string, data: any) => {
    const existingStr = localStorage.getItem('daily-macros');
    const existing = existingStr ? JSON.parse(existingStr) : { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    existing.calories += data.calories || 0;
    existing.protein += data.protein || 0;
    existing.carbs += data.carbs || 0;
    existing.fats += data.fats || 0;

    localStorage.setItem('daily-macros', JSON.stringify(existing));

    const listStr = localStorage.getItem('food-log');
    const list = listStr ? JSON.parse(listStr) : [];
    list.push({ name, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ...data });
    localStorage.setItem('food-log', JSON.stringify(list));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result as string);
        setStatus("Analyzing image macros using AI Scanner...");
        
        try {
          const formData = new FormData();
          formData.append("file", file);

          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
          const res = await fetch(`${apiUrl}/ai/recognize`, {
            method: "POST",
            body: formData
          });
          
          if (!res.ok) throw new Error("API failed");
          const data = await res.json();
          setStatus(`Detected: ${data.food_name} (${data.calories} kcal). Macros: P:${data.protein}g C:${data.carbs}g F:${data.fats}g. Logged!`);
          saveToStorage(data.food_name, data);
        } catch (err) {
          setStatus("AI Scanner Failed (Backend Offline or Error). Trying again later.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Log Meal</h1>
        <Link href="/" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Back</Link>
      </div>

      {status && (
        <div className="animate-in" style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: '500', border: '1px solid #10b981' }}>
          {status}
        </div>
      )}
      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Search Food Database</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type a food (e.g., '1 cup of rice')" 
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
          <button className="btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
           <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', margin: 0 }}>Smart Plate Scanner</h2>
           <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>AI Powered</span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Take a picture of your dish and we will estimate the calories and macros automatically.</p>
        
        {/* Hidden file input for capturing image */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImageUpload}
        />

        <div className="upload-zone" onClick={() => fileInputRef.current?.click()} style={{ 
          width: '100%', height: '250px', 
          border: '2px dashed var(--border)', 
          borderRadius: 'var(--radius-lg)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          margin: '1.5rem 0', background: '#f9fafb', color: 'var(--text-muted)',
          cursor: 'pointer', overflow: 'hidden'
        }}>
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Dish preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <svg style={{ width: '48px', height: '48px', marginBottom: '1rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Tap to open camera
            </>
          )}
        </div>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={() => fileInputRef.current?.click()} aria-label="Upload photo from device">
          Upload Photo
        </button>
      </section>

    </main>
  );
}
