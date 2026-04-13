import { useState } from 'react';
import {
  getCustomQuestions, saveCustomQuestions,
  addCustomQuestion, deleteCustomQuestion, updateCustomQuestion,
} from '../data/storage';
import useStore from '../store/useAuthStore';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TYPES        = ['MCQ', 'Numerical'];
const CLASSES      = Array.from({ length: 12 }, (_, i) => i + 1);

const BLANK = {
  classLevel: 10, category: '', difficulty: 'Medium',
  type: 'MCQ', text: '', options: ['','','',''],
  solution: '', explanation: '', examSource: '', tags: '',
};

export default function AdminPage() {
  const { refreshCustomQuestions } = useStore();
  const [questions, setQs]  = useState(getCustomQuestions());
  const [form,  setForm]    = useState(BLANK);
  const [editId,setEditId]  = useState(null);
  const [tab,   setTab]     = useState('list'); // 'list' | 'add'
  const [msg,   setMsg]     = useState('');

  const refresh = () => {
    const qs = getCustomQuestions();
    setQs(qs);
    refreshCustomQuestions?.();
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      classLevel: Number(form.classLevel),
      options: form.type === 'MCQ'
        ? form.options.filter(o => o.trim())
        : [],
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (editId) {
      updateCustomQuestion(editId, payload);
      flash('✅ Question updated!');
    } else {
      addCustomQuestion(payload);
      flash('✅ Question added!');
    }
    setForm(BLANK);
    setEditId(null);
    setTab('list');
    refresh();
  };

  const handleEdit = (q) => {
    setForm({ ...q, tags: (q.tags || []).join(', '), options: q.options?.length ? q.options : ['','','',''] });
    setEditId(q.id);
    setTab('add');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this question?')) return;
    deleteCustomQuestion(id);
    flash('🗑 Question deleted.');
    refresh();
  };

  return (
    <div className="flex-col" style={{ gap: '1.5rem' }}>
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.3rem,4vw,1.8rem)', fontWeight: 900, margin: 0 }}>⚙️ Admin Panel</h1>
          <p style={{ color: 'var(--c-text-2)', marginTop: '0.25rem' }}>
            Manage custom questions stored locally. {questions.length} custom question{questions.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <button className="btn btn-primary"
          onClick={() => { setForm(BLANK); setEditId(null); setTab('add'); }}>
          + Add Question
        </button>
      </div>

      {msg && <div className="alert-correct"><strong>{msg}</strong></div>}

      <div className="tabs">
        <button className={`tab-btn ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
          📋 Questions ({questions.length})
        </button>
        <button className={`tab-btn ${tab === 'add' ? 'active' : ''}`} onClick={() => { setForm(BLANK); setEditId(null); setTab('add'); }}>
          {editId ? '✏️ Edit Question' : '➕ Add Question'}
        </button>
      </div>

      {/* List tab */}
      {tab === 'list' && (
        questions.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No custom questions yet. Click <strong>+ Add Question</strong> to create one.</p>
            </div>
          </div>
        ) : (
          <div className="flex-col" style={{ gap: '0.75rem' }}>
            {questions.map(q => (
              <div key={q.id} className="card anim-up" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex-row" style={{ gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span className="badge badge-primary">Class {q.classLevel}</span>
                    <span className={`badge badge-${q.difficulty?.toLowerCase()}`}>{q.difficulty}</span>
                    <span className="badge" style={{ background: 'var(--c-surface-2)', color: 'var(--c-muted)' }}>{q.type}</span>
                    <span className="badge" style={{ background: 'var(--c-primary-lt)', color: 'var(--c-primary)' }}>{q.category}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.text}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)', margin: '0.25rem 0 0' }}>
                    Answer: <strong>{q.solution}</strong>
                  </p>
                </div>
                <div className="flex-row" style={{ flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(q)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q.id)}>🗑 Del</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add/Edit tab */}
      {tab === 'add' && (
        <form onSubmit={handleSubmit} className="card anim-up flex-col" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
            {/* Class */}
            <div className="field">
              <label className="label">Class Level</label>
              <select className="select" value={form.classLevel}
                onChange={e => setForm(f => ({ ...f, classLevel: e.target.value }))}>
                {CLASSES.map(n => <option key={n} value={n}>Class {n}</option>)}
              </select>
            </div>
            {/* Difficulty */}
            <div className="field">
              <label className="label">Difficulty</label>
              <select className="select" value={form.difficulty}
                onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {/* Type */}
            <div className="field">
              <label className="label">Type</label>
              <select className="select" value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {/* Category */}
            <div className="field">
              <label className="label">Category</label>
              <input className="input" type="text" placeholder="e.g. Algebra" required
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
          </div>

          {/* Question text */}
          <div className="field">
            <label className="label">Question Text</label>
            <textarea className="textarea" required placeholder="Type the question here…"
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))} />
          </div>

          {/* MCQ Options */}
          {form.type === 'MCQ' && (
            <div className="field">
              <label className="label">Answer Options (4 options)</label>
              <div className="flex-col" style={{ gap: '0.5rem' }}>
                {form.options.map((opt, i) => (
                  <input key={i} className="input" type="text"
                    placeholder={`Option ${['A','B','C','D'][i]}`}
                    value={opt}
                    onChange={e => {
                      const opts = [...form.options];
                      opts[i] = e.target.value;
                      setForm(f => ({ ...f, options: opts }));
                    }} />
                ))}
              </div>
            </div>
          )}

          {/* Solution */}
          <div className="field">
            <label className="label">Correct Answer</label>
            <input className="input" type="text" required
              placeholder={form.type === 'MCQ' ? 'Paste the exact correct option text' : 'e.g. 42'}
              value={form.solution}
              onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} />
          </div>

          {/* Explanation */}
          <div className="field">
            <label className="label">Explanation</label>
            <textarea className="textarea" placeholder="Step-by-step explanation…"
              value={form.explanation}
              onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="field">
              <label className="label">Exam Source (optional)</label>
              <input className="input" type="text" placeholder="e.g. CBSE 2023"
                value={form.examSource}
                onChange={e => setForm(f => ({ ...f, examSource: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Tags (comma-separated)</label>
              <input className="input" type="text" placeholder="e.g. algebra, quadratic"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>
              {editId ? '✅ Update Question' : '➕ Add Question'}
            </button>
            <button type="button" className="btn btn-ghost"
              onClick={() => { setForm(BLANK); setEditId(null); setTab('list'); }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
