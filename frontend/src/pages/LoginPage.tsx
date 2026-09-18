import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { login, telegramLogin } from '../api/auth';
import { Eye, EyeOff } from 'lucide-react';
import { TelegramLoginWidget } from '../components/TelegramLoginWidget';
import type { TelegramUser } from '../components/TelegramLoginWidget';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
  const [showPassword, setShowPassword] = useState(false);

  const handleTelegramAuth = async (user: TelegramUser) => {
    setError('');
    setIsLoading(true);
    try {
      await telegramLogin(user);
      navigate('/');
    } catch (err: any) {
      console.error('Telegram login error:', err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء تسجيل الدخول عبر تيليجرام');
    } finally {
      setIsLoading(false);
    }
  };

  // Keep the mock button for testing when no bot name is provided
  const handleMockTelegramLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Send a mock user to the backend to test the fallback mock logic
      await telegramLogin({
        id: Math.floor(Math.random() * 100000),
        first_name: 'Test',
        last_name: 'User',
        username: 'test_telegram_user',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'mock'
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error in mock login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    setIsLoading(true);
    try {
      const formattedEmail = email.trim().toLowerCase();
      await login({ email: formattedEmail, password });
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formattedEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      // Extract error message robustly - handle all formats from API
      let errorMessage = 'حدث خطأ، حاول مرة أخرى';
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') errorMessage = data;
        else if (typeof data.error === 'string') errorMessage = data.error;
        else if (typeof data.message === 'string') errorMessage = data.message;
        else errorMessage = JSON.stringify(data);
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(`خطأ: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/auth-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>
      
      <div className="glass w-full max-w-md p-10 rounded-3xl relative z-10 overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md">
        
        {/* App Logo & Name at the top */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 p-1 mb-3 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <img src="/logo.jpg" alt="Goolbet Logo" className="w-full h-full object-cover rounded-full border-2 border-white/80" />
          </div>
          <h1 className="text-3xl font-black text-center text-slate-900 drop-shadow-md">
            Gool<span className="text-primary">bet</span>
          </h1>
          <p className="text-slate-900/80 text-sm mt-1">{t('login')}</p>
        </div>
        
        <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm">{error}</div>}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
              placeholder="example@Goolbet.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">كلمة المرور</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 pl-12 outline-none focus:border-primary transition-colors focus:bg-background text-left"
                dir="ltr"
                placeholder="********"
                required
              />
              <button 
                type="button" 
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-slate-900 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border accent-primary w-4 h-4" 
              />
              <span className="text-muted-foreground select-none">تذكرني</span>
            </label>
            <a href="#" className="text-primary hover:underline">نسيت كلمة المرور؟</a>
          </div>
          
          <Button className="w-full mt-4 h-11" type="submit" disabled={isLoading}>
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-border w-full absolute"></div>
          <div className="bg-card px-4 relative text-sm text-muted-foreground">أو</div>
        </div>

        {/* Telegram Login Widget */}
        <div className="mb-4">
          <TelegramLoginWidget 
            botName="your_bot_username_here" // Replace with actual bot username
            onAuth={handleTelegramAuth}
          />
        </div>
        
        {/* Mock Telegram Login Button (For testing before bot is ready) */}
        <Button 
          variant="outline" 
          className="w-full h-11 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-slate-900 transition-colors"
          onClick={handleMockTelegramLogin}
          type="button"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
          تسجيل دخول وهمي (للتجربة)
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ليس لديك حساب؟ <a href="/register" className="text-primary hover:underline">سجل الآن</a>
        </p>
        {/* Footer with App Name and Version */}
        <div className="mt-8 text-center border-t border-white/10 pt-4">
          <p className="text-slate-900/60 text-xs font-bold tracking-widest">
            Goolbet v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
