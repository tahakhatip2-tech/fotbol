import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserLayout } from './layouts/UserLayout';
import { MatchesPage } from './pages/MatchesPage';
import { WalletPage } from './pages/WalletPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminHome } from './pages/admin/AdminHome';
import { AdminMatchesPage } from './pages/admin/AdminMatchesPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminBetsPage } from './pages/admin/AdminBetsPage';
import { AdminBonusPage } from './pages/admin/AdminBonusPage';
import { AdminLeaguesPage } from './pages/admin/AdminLeaguesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { HomePage } from './pages/HomePage';

function App() {
  const { i18n } = useTranslation();

  // Set RTL layout based on language
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="matches" element={<AdminMatchesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="transactions" element={<AdminTransactionsPage />} />
        <Route path="bets" element={<AdminBetsPage />} />
        <Route path="bonus" element={<AdminBonusPage />} />
        <Route path="leagues" element={<AdminLeaguesPage />} />
      </Route>
      <Route path="/*" element={
        <UserLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </UserLayout>
      } />
    </Routes>
  );
}

export default App;
