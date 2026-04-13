import { useNavigate } from 'react-router-dom';
import useStore from '../store/useAuthStore';
import { accuracy, xpToLevel, formatDate, formatDuration } from '../utils/helpers';

export default function DashboardPage() {
  const { user } = useStore();
  const navigate  = useNavigate();
  if (!user) return null;

  const attempts     = user.attempts;
  const totalQ       = attempts.length;
  const totalCorrect = attempts.reduce((s, a) => s + a.score, 0);
  const totalAnswered= attempts.reduce((s, a) => s + a.total, 0);
  const overall      = accuracy(totalCorrect, totalAnswered);
  const level        = xpToLevel(user.xp);
  const xpInLevel    = user.xp % 100;
  const recentAtt    = [...attempts].reverse().slice(0, 5);

  const stats = [
    { icon: '📝', value: totalQ,     label: 'Quizzes Taken' },
    { icon: '🎯', value: `${overall}%`, label: 'Accuracy' },
    { icon: '⭐', value: user.xp,    label: 'Total XP' },
    { icon: '🔥', value: `${user.streak}d`, label: 'Streak' },
    { icon: '🏅', value: user.badges.length, label: 'Badges' },
    { icon: '🔖', value: user.bookmarks.length, label: 'Bookmarks' },
    { icon: '📉', value: user.weakTopics.length, label: 'Weak Topics' },
    { icon: '🎓', value: `Lv.${level}`, label: 'Level' },
  ];

  return (
    <div className="flex-col" style={{ gap: '1.5rem' }}>
      {/* Welcome */}
      <div className="card anim-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.3rem,4vw,1.8rem)', fontWeight: 900, marginBottom: '0.25rem' }}>
            Welcome back, {user.name}! 👋
          </h1>
          <p style={{ color: 'var(--c-text-2)', fontSize: '0.9rem' }}>
            Class {user.classLevel} · Level {level} · {user.streak}-day streak 🔥
          </p>
          {/* Level progress bar */}
          <div style={{ marginTop: '0.75rem', maxWidth: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--c-muted)', marginBottom: '0.3rem' }}>
              <span>Level {level}</span><span>{xpInLevel}/100 XP</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${xpInLevel}%` }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/quiz-setup?mode=mock')}>
            ⏱ Mock Test
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/quiz-setup?mode=practice')}>
            📖 Practice
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }} className="stat-grid">
        {stats.map((s, i) => (
          <div key={s.label} className="stat-card anim-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
        {/* Weak Topics */}
        <div className="card anim-up">
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>📉 Weak Topics</h2>
          {user.weakTopics.length === 0 ? (
            <div className="empty-state" style={{ padding: '1rem' }}>
              <div className="empty-icon">✅</div>
              <p>No weak areas yet. Keep quizzing!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {user.weakTopics.map(t => (
                <span key={t} className="chip active"
                  onClick={() => navigate(`/quiz-setup?mode=practice&category=${encodeURIComponent(t)}`)}>
                  {t} →
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Topic Accuracy */}
        <div className="card anim-up">
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>📊 Topic Accuracy</h2>
          {Object.entries(user.accuracyByTopic).length === 0 ? (
            <div className="empty-state" style={{ padding: '1rem' }}>
              <div className="empty-icon">📊</div>
              <p>Complete quizzes to see your analytics</p>
            </div>
          ) : (
            <div className="flex-col" style={{ gap: '0.65rem' }}>
              {Object.entries(user.accuracyByTopic).map(([topic, { correct, total }]) => {
                const pct = accuracy(correct, total);
                const colour = pct >= 70 ? 'var(--c-correct)' : pct >= 40 ? 'var(--c-accent)' : 'var(--c-wrong)';
                return (
                  <div key={topic}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{topic}</span>
                      <span style={{ color: 'var(--c-muted)' }}>{correct}/{total} · {pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: colour }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookmarks shortcut */}
        <div className="card anim-up">
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>🔖 Bookmarks</h2>
          {user.bookmarks.length === 0 ? (
            <div className="empty-state" style={{ padding: '1rem' }}>
              <div className="empty-icon">🔖</div>
              <p>Bookmark questions during a quiz to revisit them.</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--c-text-2)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                {user.bookmarks.length} question{user.bookmarks.length > 1 ? 's' : ''} saved for later.
              </p>
              <button className="btn btn-outline btn-full"
                onClick={() => navigate('/quiz-setup?mode=bookmarks')}>
                Practice Bookmarks →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Attempts */}
      {recentAtt.length > 0 && (
        <div className="card anim-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>🕐 Recent Quizzes</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/profile')}>View All</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>XP</th>
                  <th className="hide-mobile">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentAtt.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontSize: '0.82rem', color: 'var(--c-muted)' }}>{formatDate(a.date)}</td>
                    <td><span className={`badge ${a.mode === 'mock' ? 'badge-hard' : 'badge-easy'}`}>{a.mode}</span></td>
                    <td style={{ fontWeight: 700 }}>{a.score}/{a.total}</td>
                    <td>
                      <span style={{ color: accuracy(a.score, a.total) >= 70 ? 'var(--c-correct)' : 'var(--c-wrong)', fontWeight: 700 }}>
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
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '0.75rem' }}>
        {[
          { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
          { icon: '👤', label: 'My Profile',  path: '/profile' },
          { icon: '⚙️', label: 'Admin Panel', path: '/admin' },
        ].map(item => (
          <button key={item.path} className="card anim-up" style={{ cursor: 'pointer', textAlign: 'center', border: '1px dashed var(--c-border)' }}
            onClick={() => navigate(item.path)}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
