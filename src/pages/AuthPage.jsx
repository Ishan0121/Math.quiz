import { useState } from 'react';
import useStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getThemeClass } from '../utils/helpers';

const CLASS_THEMES = [
  { classes: [1,2,3,4,5],      emoji: '🎨', label: 'Kids',         desc: 'Colourful & playful' },
  { classes: [6,7,8],          emoji: '📚', label: 'Middle School', desc: 'Balanced & structured' },
  { classes: [9,10,11,12],     emoji: '🎯', label: 'High School',   desc: 'Dark & focused' },
];

export default function AuthPage() {
  const [name, setName]         = useState('');
  const [classLevel, setClass]  = useState(10);
  const { login }               = useStore();
  const navigate                = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const user = login(name.trim(), classLevel);
    // Apply theme immediately
    document.documentElement.className = getThemeClass(user.classLevel);
    navigate('/dashboard');
  };

  const activeTheme = CLASS_THEMES.find(t => t.classes.includes(Number(classLevel)));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'var(--c-bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="anim-up">
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>🔢</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 900, color: 'var(--c-primary)', margin: '0.5rem 0 0.25rem' }}>
            MathQuiz
          </h1>
          <p style={{ color: 'var(--c-text-2)', fontSize: '0.95rem' }}>
            Class-based quizzes for CBSE & ICSE students · Class 1–12
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleStart} className="flex-col" style={{ gap: '1.25rem' }}>
            {/* Name */}
            <div className="field">
              <label className="label">Your Name</label>
              <input className="input" type="text" placeholder="e.g. Aryan Sharma"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>

            {/* Class slider */}
            <div className="field">
              <label className="label">
                Class Level &nbsp;
                <span style={{ color: 'var(--c-primary)', fontWeight: 800, fontSize: '1rem' }}>
                  {classLevel}
                </span>
              </label>
              <input className="input" type="range" min="1" max="12"
                value={classLevel}
                onChange={e => setClass(Number(e.target.value))}
                style={{ padding: '0.4rem 0', accentColor: 'var(--c-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                  <span key={n} style={{
                    fontSize: '0.65rem',
                    fontWeight: classLevel === n ? 800 : 400,
                    color: classLevel === n ? 'var(--c-primary)' : 'var(--c-muted)',
                    transition: 'all .15s',
                  }}>{n}</span>
                ))}
              </div>
            </div>

            {/* Theme preview tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
              {CLASS_THEMES.map(t => {
                const active = t === activeTheme;
                return (
                  <div key={t.label} style={{
                    padding: '0.7rem 0.5rem',
                    borderRadius: 'var(--radius)',
                    border: `2px solid ${active ? 'var(--c-primary)' : 'var(--c-border)'}`,
                    background: active ? 'var(--c-primary-lt)' : 'var(--c-surface-2)',
                    textAlign: 'center',
                    transition: 'all .2s',
                  }}>
                    <div style={{ fontSize: '1.3rem' }}>{t.emoji}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: active ? 'var(--c-primary)' : 'var(--c-text-2)', marginTop: '0.2rem' }}>{t.label}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--c-muted)', marginTop: '0.1rem' }}>{t.desc}</div>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-primary btn-lg btn-full" type="submit" style={{ marginTop: '0.25rem' }}>
              Start Learning →
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: '1rem' }}>
          🔒 No account needed · All progress saved in your browser
        </p>
      </div>
    </div>
  );
}
