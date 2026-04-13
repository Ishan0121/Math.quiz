import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useAuthStore';
import allQuestionsRaw from '../data/questions.json';
import { buildQuiz, accuracy } from '../utils/helpers';
import { getCustomQuestions } from '../data/storage';

export default function QuizPage() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { user, updateAfterAttempt, toggleBookmark } = useStore();

  const mode       = params.get('mode') || 'practice';
  const difficulty = params.get('difficulty') || null;
  const category   = params.get('category') || null;
  const count      = Number(params.get('count')) || 10;
  const timePerQ   = Number(params.get('timePerQ')) || 60;

  const allQuestions = [...allQuestionsRaw, ...getCustomQuestions()];

  const [questions, setQuestions] = useState([]);
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [textInput, setTextInput] = useState('');
  const [revealed,  setRevealed]  = useState(false);
  const [results,   setResults]   = useState([]);
  const [timeLeft,  setTimeLeft]  = useState(timePerQ);
  const [finished,  setFinished]  = useState(false);
  const [startTime, setStartTime] = useState(null);
  const totalTime = useRef(0);

  useEffect(() => {
    if (!user) return;
    let pool;
    if (mode === 'bookmarks') {
      pool = allQuestions.filter(q => user.bookmarks.includes(q.id));
      if (!pool.length) { navigate('/dashboard'); return; }
    } else {
      pool = buildQuiz(allQuestions, user.classLevel, difficulty, category, count);
    }
    setQuestions(pool);
    setStartTime(Date.now());
  }, []);

  // ── Timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'mock' || revealed || finished || !questions.length) return;
    if (timeLeft <= 0) { handleReveal(true); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, mode, revealed, finished, questions.length]);

  const q = questions[current];

  const handleReveal = useCallback((autoReveal = false) => {
    if (!q) return;
    const answer = q.type === 'MCQ' ? selected : textInput.trim();
    const isCorrect = autoReveal ? false : (answer === q.solution);
    setResults(r => [...r, { category: q.category, isCorrect }]);
    setRevealed(true);
  }, [q, selected, textInput]);

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      updateAfterAttempt(results, mode, elapsed);
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setTextInput('');
      setRevealed(false);
      setTimeLeft(timePerQ);
    }
  };

  // ── Results ───────────────────────────────────────────────────
  if (finished) {
    const correct = results.filter(r => r.isCorrect).length;
    const pct     = accuracy(correct, results.length);
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎯' : pct >= 50 ? '👍' : '💪';
    const color = pct >= 70 ? 'var(--c-correct)' : pct >= 40 ? 'var(--c-warn)' : 'var(--c-wrong)';

    return (
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="card anim-up text-center flex-col" style={{ gap: '1rem' }}>
          <div style={{ fontSize: '4rem', lineHeight: 1 }}>{emoji}</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Quiz Complete!</h2>
          <div style={{ fontSize: '3rem', fontWeight: 900, color }}>{pct}%</div>
          <p style={{ color: 'var(--c-text-2)' }}>{correct} out of {results.length} correct</p>

          <div className="progress-bar" style={{ height: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
          </div>

          {/* Per-question breakdown */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {results.map((r, i) => (
              <span key={i} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: r.isCorrect ? 'var(--c-correct-lt)' : 'var(--c-wrong-lt)',
                color: r.isCorrect ? 'var(--c-correct)' : 'var(--c-wrong)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700,
              }}>{i + 1}</span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="btn btn-outline" onClick={() => navigate('/quiz-setup')}>Try Again</button>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/leaderboard')}>
            🏆 Leaderboard
          </button>
        </div>
      </div>
    );
  }

  if (!q) return (
    <div className="flex-center" style={{ minHeight: '60vh', color: 'var(--c-muted)', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '2rem' }}>📭</div>
      <p>No questions found for your selection.</p>
      <button className="btn btn-outline" onClick={() => navigate('/quiz-setup')}>Back to Setup</button>
    </div>
  );

  const timerPct   = (timeLeft / timePerQ) * 100;
  const timerColor = timeLeft <= 10 ? 'var(--c-wrong)' : timeLeft <= 20 ? 'var(--c-warn)' : 'var(--c-correct)';
  const isBookmarked = user?.bookmarks?.includes(q.id);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }} className="flex-col" style={{ gap: '1rem' }}>
      {/* Top bar */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/quiz-setup')}>← Back</button>
        <div className="flex-row" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{current + 1} / {questions.length}</span>
          <span className="badge badge-primary">
            {mode === 'mock' ? '⏱ Mock' : mode === 'bookmarks' ? '🔖 Bookmarks' : '📖 Practice'}
          </span>
          {mode === 'mock' && (
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: timerColor, minWidth: 45, textAlign: 'right' }}>
              {timeLeft}s
            </span>
          )}
        </div>
      </div>

      {/* Overall progress */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      {/* Timer bar (mock) */}
      {mode === 'mock' && (
        <div className="progress-bar" style={{ height: '0.35rem' }}>
          <div className="progress-fill" style={{ width: `${timerPct}%`, background: timerColor, transition: 'width 1s linear, background .3s' }} />
        </div>
      )}

      {/* Question card */}
      <div className="card anim-up" key={current}>
        {/* Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="flex-row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
            <span className="badge badge-primary">{q.category}</span>
            <span className="badge" style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)' }}>
              {q.type}
            </span>
          </div>
          <button onClick={() => toggleBookmark(q.id)}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>
            {isBookmarked ? '🔖' : '🏷️'}
          </button>
        </div>

        {/* Question text */}
        <p style={{ fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.25rem' }}>
          {q.text}
        </p>

        {/* MCQ options */}
        {q.type === 'MCQ' && (
          <div className="flex-col" style={{ gap: '0.55rem' }}>
            {q.options.map((opt, i) => {
              let cls = 'option-btn';
              if (revealed) {
                if (opt === q.solution) cls += ' correct';
                else if (opt === selected) cls += ' wrong';
              } else if (opt === selected) cls += ' selected';
              return (
                <button key={opt} className={cls} disabled={revealed} onClick={() => setSelected(opt)}>
                  <span style={{ opacity: 0.5, marginRight: '0.5rem', fontSize: '0.85rem' }}>
                    {['A','B','C','D'][i]}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Numerical input */}
        {q.type === 'Numerical' && (
          <input className="input" type="text"
            placeholder="Type your answer here…"
            value={textInput}
            disabled={revealed}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !revealed && textInput.trim()) handleReveal(); }}
            style={revealed ? {
              borderColor: textInput.trim() === q.solution ? 'var(--c-correct)' : 'var(--c-wrong)',
              background:  textInput.trim() === q.solution ? 'var(--c-correct-lt)' : 'var(--c-wrong-lt)',
            } : {}}
          />
        )}

        {/* Explanation block */}
        {revealed && (
          <div className={`${results[results.length-1]?.isCorrect ? 'alert-correct' : 'alert-warn'} anim-in`}
            style={{ marginTop: '1.25rem' }}>
            <div style={{ fontWeight: 800, marginBottom: '0.35rem' }}>
              {results[results.length-1]?.isCorrect ? '✅ Correct!' : `❌ Correct answer: ${q.solution}`}
            </div>
            <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{q.explanation}</p>
            {q.examSource && (
              <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0', color: 'var(--c-muted)' }}>
                📄 Source: {q.examSource}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: revealed ? '1fr' : '1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
          {!revealed ? (
            <button className="btn btn-primary btn-lg btn-full"
              disabled={q.type === 'MCQ' ? !selected : !textInput.trim()}
              onClick={() => handleReveal()}>
              Check Answer
            </button>
          ) : (
            <button className="btn btn-primary btn-lg btn-full" onClick={handleNext}>
              {current + 1 < questions.length ? 'Next Question →' : 'Finish & See Results 🏆'}
            </button>
          )}
        </div>
      </div>

      {/* Mini progress dots */}
      <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: i < results.length
              ? (results[i].isCorrect ? 'var(--c-correct)' : 'var(--c-wrong)')
              : i === current ? 'var(--c-primary)' : 'var(--c-border)',
            transition: 'background .3s',
          }} />
        ))}
      </div>
    </div>
  );
}
