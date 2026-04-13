import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useStore from './store/useAuthStore';
import { getThemeClass } from './utils/helpers';

import Layout          from './components/Layout';
import AuthPage        from './pages/AuthPage';
import DashboardPage   from './pages/DashboardPage';
import QuizSetupPage   from './pages/QuizSetupPage';
import QuizPage        from './pages/QuizPage';
import ProfilePage     from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage       from './pages/AdminPage';

const Protected = ({ children }) => {
  const { user } = useStore();
  return user ? children : <Navigate to="/" replace />;
};

export default function App() {
  const { user } = useStore();

  useEffect(() => {
    document.documentElement.className = user ? getThemeClass(user.classLevel) : '';
  }, [user?.classLevel]);

  return (
    <BrowserRouter basename="/Math">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard"   element={<Protected><Layout><DashboardPage /></Layout></Protected>} />
        <Route path="/quiz-setup"  element={<Protected><Layout><QuizSetupPage /></Layout></Protected>} />
        <Route path="/quiz"        element={<Protected><Layout><QuizPage /></Layout></Protected>} />
        <Route path="/profile"     element={<Protected><Layout><ProfilePage /></Layout></Protected>} />
        <Route path="/leaderboard" element={<Protected><Layout><LeaderboardPage /></Layout></Protected>} />
        <Route path="/admin"       element={<Protected><Layout><AdminPage /></Layout></Protected>} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
