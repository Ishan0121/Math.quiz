import useStore from '../store/useAuthStore';
import { accuracy, formatDate, xpToLevel, formatDuration } from '../utils/helpers';
import { BADGES } from '../data/storage';

export default function ProfilePage() {
  const { user } = useStore();
  if (!user) return null;

  const total = user.attempts.length;
  const totalCorrect  = user.attempts.reduce((s, a) => s + a.score, 0);
  const totalAnswered = user.attempts.reduce((s, a) => s + a.total, 0);
  const overall = accuracy(totalCorrect, totalAnswered);
  const level   = xpToLevel(user.xp);
  const xpInLvl = user.xp % 100;

  const sorted = [...user.attempts].reverse();

  return (
    <div className="flex-col" style={{ gap: '1.5rem' }}>
      {/* Header */}
      <div className="card anim-up" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--c-primary-lt)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
          border: '3px solid var(--c-primary)',
          flexShrink: 0,
        }}>🎓</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.3rem,4vw,1.8rem)', fontWeight: 900, margin: 0 }}>{user.name}</h1>
          <p style={{ color: 'var(--c-text-2)', margin: '0.25rem 0' }}>Class {user.classLevel} · Level {level}</p>
          <div style={{ maxWidth: 300, marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--c-muted)', marginBottom: '0.25rem' }}>
              <span>Level {level}</span><span>{xpInLvl}/100 XP to Level {level+1}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${xpInLvl}%` }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { icon: '⭐', val: user.xp, label: 'XP' },
            { icon: '🔥', val: user.streak, label: 'Streak' },
            { icon: '🎯', val: `${overall}%`, label: 'Accuracy' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--c-primary)' }}>{s.val}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--c-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card anim-up">
        <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🏅 Badges</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '0.75rem' }}>
          {BADGES.map(b => {
            const earned = user.badges.includes(b.id);
            return (
              <div key={b.id} style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                border: `2px solid ${earned ? 'var(--c-accent)' : 'var(--c-border)'}`,
                background: earned ? 'var(--c-accent-lt)' : 'var(--c-surface-2)',
                opacity: earned ? 1 : 0.45,
                textAlign: 'center',
                transition: 'all .2s',
              }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>{b.icon}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{b.label}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--c-muted)', marginTop: '0.15rem' }}>{b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attempt history */}
      <div className="card anim-up">
        <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>
          📜 Full History ({total} quiz{total !== 1 ? 'zes' : ''})
        </h2>
        {total === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No quizzes taken yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>XP</th>
                  <th className="hide-mobile">Time</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a, i) => (
                  <tr key={a.id}>
                    <td style={{ color: 'var(--c-muted)', fontSize: '0.8rem' }}>{total - i}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--c-muted)' }}>{formatDate(a.date)}</td>
                    <td><span className={`badge ${a.mode === 'mock' ? 'badge-hard' : 'badge-easy'}`}>{a.mode}</span></td>
                    <td style={{ fontWeight: 700 }}>{a.score}/{a.total}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: accuracy(a.score,a.total) >= 70 ? 'var(--c-correct)' : 'var(--c-wrong)' }}>
                        {accuracy(a.score, a.total)}%
                      </span>
                    </td>
                    <td style={{ color: 'var(--c-accent)', fontWeight: 700 }}>+{a.xpGained}</td>
                    <td className="hide-mobile" style={{ color: 'var(--c-muted)', fontSize: '0.82rem' }}>
                      {formatDuration(a.timeTaken)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
