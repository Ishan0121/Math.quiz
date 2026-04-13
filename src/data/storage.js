// ─── STORAGE KEYS ──────────────────────────────────────────────────────
const KEYS = {
  USER:      'mq_user',
  QUESTIONS: 'mq_extra_questions',
};

// ─── USER ───────────────────────────────────────────────────────────────
export const getUser   = () => { try { const r = localStorage.getItem(KEYS.USER); return r ? JSON.parse(r) : null; } catch { return null; } };
export const saveUser  = (u) => localStorage.setItem(KEYS.USER, JSON.stringify(u));
export const clearUser = ()  => localStorage.removeItem(KEYS.USER);

export const createUser = (name, classLevel) => {
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    classLevel: Number(classLevel),
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    weakTopics: [],
    accuracyByTopic: {},   // { Algebra: { correct, total } }
    attempts: [],          // { id, date, score, total, xpGained, mode, timeTaken }
    bookmarks: [],         // question IDs
    badges: [],            // earned badge ids
  };
  saveUser(user);
  return user;
};

// ─── STREAK ─────────────────────────────────────────────────────────────
const updateStreak = (user) => {
  const today = new Date().toDateString();
  if (user.lastActiveDate === today) return user; // already active today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return {
    ...user,
    streak: user.lastActiveDate === yesterday ? user.streak + 1 : 1,
    lastActiveDate: today,
  };
};

// ─── BADGES ─────────────────────────────────────────────────────────────
export const BADGES = [
  { id: 'first_quiz',   icon: '🎉', label: 'First Quiz',     desc: 'Completed your first quiz' },
  { id: 'streak_3',     icon: '🔥', label: 'On Fire',        desc: '3-day streak' },
  { id: 'streak_7',     icon: '⚡', label: 'Week Warrior',   desc: '7-day streak' },
  { id: 'xp_100',       icon: '⭐', label: 'Rising Star',    desc: 'Earned 100 XP' },
  { id: 'xp_500',       icon: '🏅', label: 'Math Champion',  desc: 'Earned 500 XP' },
  { id: 'xp_1000',      icon: '🏆', label: 'Grand Master',   desc: 'Earned 1000 XP' },
  { id: 'perfect',      icon: '💯', label: 'Perfect Score',  desc: 'Scored 100% in a quiz' },
  { id: 'bookworm',     icon: '🔖', label: 'Bookworm',       desc: 'Bookmarked 5 questions' },
  { id: 'accuracy_80',  icon: '🎯', label: 'Sharpshooter',   desc: 'Overall accuracy ≥ 80%' },
  { id: 'quizzes_10',   icon: '📚', label: 'Dedicated',      desc: 'Completed 10 quizzes' },
];

const checkBadges = (user, quizScore, quizTotal) => {
  const earned = new Set(user.badges);
  const totalXP = user.xp;
  const totalQ  = user.attempts.length;
  const totalCorrect = user.attempts.reduce((s, a) => s + a.score, 0);
  const totalAnswered= user.attempts.reduce((s, a) => s + a.total, 0);
  const overallAcc   = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

  if (totalQ >= 1)                          earned.add('first_quiz');
  if (user.streak >= 3)                     earned.add('streak_3');
  if (user.streak >= 7)                     earned.add('streak_7');
  if (totalXP >= 100)                       earned.add('xp_100');
  if (totalXP >= 500)                       earned.add('xp_500');
  if (totalXP >= 1000)                      earned.add('xp_1000');
  if (quizScore === quizTotal && quizTotal > 0) earned.add('perfect');
  if (user.bookmarks.length >= 5)           earned.add('bookworm');
  if (overallAcc >= 80 && totalAnswered >= 10)  earned.add('accuracy_80');
  if (totalQ >= 10)                         earned.add('quizzes_10');

  return Array.from(earned);
};

// ─── UPDATE AFTER QUIZ ──────────────────────────────────────────────────
export const updateUserAfterAttempt = (user, results, mode, timeTaken) => {
  const topicMap = { ...user.accuracyByTopic };
  results.forEach(({ category, isCorrect }) => {
    if (!topicMap[category]) topicMap[category] = { correct: 0, total: 0 };
    topicMap[category].total += 1;
    if (isCorrect) topicMap[category].correct += 1;
  });

  const weakTopics = Object.entries(topicMap)
    .filter(([, v]) => v.total >= 2 && v.correct / v.total < 0.6)
    .map(([k]) => k);

  const correctCount = results.filter(r => r.isCorrect).length;
  const xpGained     = correctCount * 10 + (mode === 'mock' ? 5 : 0);

  let updated = updateStreak({
    ...user,
    xp: user.xp + xpGained,
    accuracyByTopic: topicMap,
    weakTopics,
    attempts: [
      ...user.attempts,
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        score: correctCount,
        total: results.length,
        xpGained,
        mode,
        timeTaken: timeTaken || 0,
      },
    ],
  });

  updated.badges = checkBadges(updated, correctCount, results.length);
  saveUser(updated);
  return updated;
};

// ─── BOOKMARKS ──────────────────────────────────────────────────────────
export const toggleBookmark = (user, questionId) => {
  const bookmarks = user.bookmarks.includes(questionId)
    ? user.bookmarks.filter(id => id !== questionId)
    : [...user.bookmarks, questionId];
  const updated = { ...user, bookmarks };
  updated.badges = checkBadges(updated, 0, 0);
  saveUser(updated);
  return updated;
};

// ─── ADMIN: CUSTOM QUESTIONS ─────────────────────────────────────────────
export const getCustomQuestions = () => {
  try {
    const r = localStorage.getItem(KEYS.QUESTIONS);
    return r ? JSON.parse(r) : [];
  } catch { return []; }
};
export const saveCustomQuestions = (qs) => localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(qs));

export const addCustomQuestion = (q) => {
  const existing = getCustomQuestions();
  const newQ = { ...q, id: 'cq_' + crypto.randomUUID(), custom: true };
  saveCustomQuestions([...existing, newQ]);
  return newQ;
};

export const deleteCustomQuestion = (id) => {
  const existing = getCustomQuestions().filter(q => q.id !== id);
  saveCustomQuestions(existing);
};

export const updateCustomQuestion = (id, data) => {
  const existing = getCustomQuestions().map(q => q.id === id ? { ...q, ...data } : q);
  saveCustomQuestions(existing);
};
