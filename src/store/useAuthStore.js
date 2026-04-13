import { create } from 'zustand';
import {
  getUser, saveUser, clearUser, createUser,
  updateUserAfterAttempt, toggleBookmark,
  getCustomQuestions,
} from '../data/storage';

const useStore = create((set, get) => ({
  user:            getUser(),
  customQuestions: getCustomQuestions(),

  login:    (name, classLevel) => { const u = createUser(name, classLevel); set({ user: u }); return u; },
  logout:   () => { clearUser(); set({ user: null }); },
  loadUser: () => set({ user: getUser(), customQuestions: getCustomQuestions() }),

  updateAfterAttempt: (results, mode, timeTaken) => {
    const { user } = get();
    if (!user) return;
    const updated = updateUserAfterAttempt(user, results, mode, timeTaken);
    set({ user: updated });
  },

  toggleBookmark: (qId) => {
    const { user } = get();
    if (!user) return;
    set({ user: toggleBookmark(user, qId) });
  },

  refreshCustomQuestions: () => set({ customQuestions: getCustomQuestions() }),
}));

export default useStore;
