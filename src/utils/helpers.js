export const getThemeClass = (classLevel) => {
  const n = Number(classLevel);
  if (n >= 1 && n <= 5)  return 'theme-kids';
  if (n >= 9 && n <= 12) return 'theme-hs';
  return '';
};

export const getCategoriesForClass = (classLevel) => {
  const n = Number(classLevel);
  if (n <= 5)  return ['Arithmetic', 'Fractions', 'Geometry', 'Word Problems'];
  if (n <= 8)  return ['Algebra', 'Integers', 'Geometry', 'Ratios', 'Statistics'];
  if (n <= 10) return ['Algebra', 'Trigonometry', 'Geometry', 'Arithmetic Progressions', 'Statistics'];
  return ['Calculus', 'Matrices', 'Vectors', 'Probability', 'Algebra'];
};

export const CLASS_SYLLABUS = {
  1:  ['Counting', 'Addition', 'Subtraction'],
  2:  ['Addition', 'Subtraction', 'Shapes'],
  3:  ['Multiplication', 'Division', 'Fractions'],
  4:  ['Fractions', 'Decimals', 'Geometry'],
  5:  ['Arithmetic', 'Fractions', 'Geometry', 'Word Problems'],
  6:  ['Integers', 'Fractions', 'Algebra', 'Ratio'],
  7:  ['Algebra', 'Integers', 'Geometry', 'Ratios'],
  8:  ['Algebra', 'Linear Equations', 'Geometry', 'Statistics'],
  9:  ['Algebra', 'Geometry', 'Statistics', 'Coordinate Geometry'],
  10: ['Algebra', 'Trigonometry', 'Geometry', 'Arithmetic Progressions', 'Statistics'],
  11: ['Functions', 'Sequences', 'Trigonometry', 'Statistics', 'Probability'],
  12: ['Calculus', 'Matrices', 'Vectors', 'Probability', 'Algebra'],
};

// Fisher-Yates shuffle
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build a randomised quiz from the merged question pool
export const buildQuiz = (allQuestions, classLevel, difficulty = null, category = null, count = 10) => {
  let pool = allQuestions.filter(q => q.classLevel === Number(classLevel));
  if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
  if (category)   pool = pool.filter(q => q.category === category);
  if (pool.length === 0) pool = allQuestions.filter(q => q.classLevel === Number(classLevel));
  
  // Deduplicate by question text to prevent identical generated questions
  const uniquePool = [];
  const seenTexts = new Set();
  for (const q of pool) {
    if (!seenTexts.has(q.text)) {
      seenTexts.add(q.text);
      uniquePool.push(q);
    }
  }

  return shuffle(uniquePool).slice(0, count).map(q => ({
    ...q,
    options: q.options?.length ? shuffle(Array.from(new Set(q.options))) : [],
  }));
};

export const accuracy = (correct, total) =>
  total === 0 ? 0 : Math.round((correct / total) * 100);

export const xpToLevel = (xp) => Math.floor(xp / 100) + 1;

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDuration = (seconds) => {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};
