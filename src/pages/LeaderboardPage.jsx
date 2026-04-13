import useStore from '../store/useAuthStore';
import { accuracy, xpToLevel } from '../utils/helpers';

// Simulate a "class leaderboard" from current user's attempts
// In a real multi-user setting this would be an API — for static/localStorage
// we generate plausible fictional peers around the real user's score.
function generateLeaderboard(user) {
  const userScore = user?.xp || 0;
  const level     = xpToLevel(userScore);
  const names = [
    'Arjun K.','Priya S.','Rohit M.','Sneha D.','Karan P.',
    'Anjali R.','Vivek T.','Meera B.','Aditya G.','Pooja N.',
  ];
  const peers = names.map((name, i) => ({
    id: `peer_${i}`,
    name,
    xp:     Math.max(0, userScore + Math.round((Math.random()-.4) * 300)),
    streak: Math.floor(Math.random() * 10),
    accuracy: Math.floor(50 + Math.random() * 50),
    isYou: false,
  }));
  peers.push({ id: user?.id, name: user?.name + ' (you)', xp: userScore, streak: user?.streak || 0,
    accuracy: 0, isYou: true });
  return peers.sort((a, b) => b.xp - a.xp);
}

const MEDAL = ['🥇','🥈','🥉'];
const RANK_COLORS = ['#f59e0b','#94a3b8','#b45309'];

export default function LeaderboardPage() {
  const { user } = useStore();
  if (!user) return null;

  const board    = generateLeaderboard(user);
  const yourRank = board.findIndex(u => u.isYou) + 1;

  return (
    <div className="flex-col" style={{ gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: 'clamp(1.4rem,4vw,1.8rem)', fontWeight: 900, marginBottom: '0.25rem' }}>
          🏆 Leaderboard
        </h1>
        <p style={{ color: 'var(--c-text-2)' }}>
          Class {user.classLevel} · Your rank: <strong style={{ color: 'var(--c-primary)' }}>#{yourRank}</strong>
        </p>
      </div>

      {/* Top 3 podium */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', justifyContent: 'center', padding: '1rem 0' }}>
        {[board[1], board[0], board[2]].map((u, podiumIdx) => {
          const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
          const heights = ['80%','100%','70%'];
          const h = heights[podiumIdx];
          return u ? (
            <div key={u.id} style={{
              flex: 1,
              maxWidth: 160,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{u.isYou ? '😊' : '👤'}</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem', color: u.isYou ? 'var(--c-primary)' : 'var(--c-text)' }}>{u.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginBottom: '0.5rem' }}>⭐ {u.xp} XP</div>
              <div style={{
                width: '100%',
                height: rank === 1 ? '90px' : rank === 2 ? '70px' : '55px',
                background: `linear-gradient(to top, ${RANK_COLORS[rank-1]}33, ${RANK_COLORS[rank-1]}11)`,
                border: `2px solid ${RANK_COLORS[rank-1]}`,
                borderRadius: 'var(--radius) var(--radius) 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>{MEDAL[rank-1]}</div>
            </div>
          ) : null;
        })}
      </div>

      {/* Full list */}
      <div className="card anim-up card-flush">
        <div className="table-wrap" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 48 }}>Rank</th>
                <th>Student</th>
                <th>XP</th>
                <th className="hide-mobile">Streak</th>
                <th className="hide-mobile text-right">Level</th>
              </tr>
            </thead>
            <tbody>
              {board.map((u, idx) => (
                <tr key={u.id} style={{ background: u.isYou ? 'var(--c-primary-lt)' : undefined }}>
                  <td style={{ fontWeight: 900, color: idx < 3 ? RANK_COLORS[idx] : 'var(--c-muted)', fontSize: idx < 3 ? '1.1rem' : '0.9rem' }}>
                    {idx < 3 ? MEDAL[idx] : `#${idx + 1}`}
                  </td>
                  <td style={{ fontWeight: u.isYou ? 800 : 500, color: u.isYou ? 'var(--c-primary)' : 'var(--c-text)' }}>
                    {u.isYou ? '👤 ' : ''}{u.name}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--c-accent)' }}>⭐ {u.xp}</td>
                  <td className="hide-mobile" style={{ color: 'var(--c-muted)' }}>🔥 {u.streak}d</td>
                  <td className="hide-mobile text-right">
                    <span className="badge badge-primary">Lv.{xpToLevel(u.xp)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--c-muted)' }}>
        * Peer scores are simulated for demonstration. A real leaderboard requires a backend.
      </p>
    </div>
  );
}
