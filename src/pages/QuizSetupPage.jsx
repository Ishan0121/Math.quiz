import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../store/useAuthStore';
import { getCategoriesForClass } from '../utils/helpers';

const DIFFICULTIES = ['Any', 'Easy', 'Medium', 'Hard'];
const COUNTS = [5, 10, 15, 20];
const MOCK_TIMES = [30, 45, 60, 90]; // seconds per question

export default function QuizSetupPage() {
  const [params]        = useSearchParams();
  const navigate        = useNavigate();
  const { user }        = useStore();
  const initialMode     = params.get('mode') || 'practice';
  const initialCategory = params.get('category') || 'Any';

  const [mode,       setMode]       = useState(initialMode);
  const [difficulty, setDifficulty] = useState('Any');
  const [category,   setCategory]   = useState(initialCategory);
  const [count,      setCount]      = useState(10);
  const [timePerQ,   setTimePerQ]   = useState(60);

  if (!user) return null;

  const categories = ['Any', ...getCategoriesForClass(user.classLevel)];

  const handleStart = () => {
    const query = new URLSearchParams({
      mode,
      difficulty: difficulty === 'Any' ? '' : difficulty,
      category:   category   === 'Any' ? '' : category,
      count,
      timePerQ,
    });
    navigate(`/quiz?${query.toString()}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(1.4rem,4vw,1.8rem)', fontWeight: 900, marginBottom: '0.25rem' }}>
        🚀 Start a Quiz
      </h1>
      <p style={{ color: 'var(--c-text-2)', marginBottom: '1.5rem' }}>
        Customise your session — then start!
      </p>

      <div className="card anim-up flex-col" style={{ gap: '1.5rem' }}>
        {/* Mode */}
        <div className="field">
          <label className="label">Quiz Mode</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.5rem' }}>
            {['practice','mock','bookmarks'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={mode === m ? 'btn btn-primary' : 'btn btn-ghost'}>
                { m === 'practice' ? '📖 Practice' : m === 'mock' ? '⏱ Mock Test' : '🔖 Bookmarks' }
              </button>
            ))}
          </div>
          {mode === 'mock' && (
            <p style={{ fontSize: '0.8rem', color: 'var(--c-warn)', marginTop: '0.4rem' }}>
              ⏱ Mock Test has a countdown timer per question.
            </p>
          )}
        </div>

        {/* Difficulty */}
        {mode !== 'bookmarks' && (
          <div className="field">
            <label className="label">Difficulty</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`chip ${difficulty === d ? 'active' : ''}`}>
                  {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : d === 'Hard' ? '🔴' : '🎲'} {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category */}
        {mode !== 'bookmarks' && (
          <div className="field">
            <label className="label">Topic / Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`chip ${category === c ? 'active' : ''}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Number of questions */}
        {mode !== 'bookmarks' && (
          <div className="field">
            <label className="label">Number of Questions</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COUNTS.map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={count === n ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
                  {n} Qs
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time per question (mock only) */}
        {mode === 'mock' && (
          <div className="field">
            <label className="label">Time per Question</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {MOCK_TIMES.map(t => (
                <button key={t} onClick={() => setTimePerQ(t)}
                  className={timePerQ === t ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
                  {t}s
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-primary btn-lg btn-full" onClick={handleStart}>
          Start Quiz →
        </button>
      </div>
    </div>
  );
}
