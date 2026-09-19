import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { login, telegramLogin } from '../api/auth';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
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

  const handleMockTelegramLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
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
      className="min-h-screen w-full flex items-center justify-center p-4 relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: 'url(/stadium-bg.jpg)' }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0f172a]/90 z-0"></div>

      {/* Back button */}
      <Link to="/" className="absolute top-6 right-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
        <ArrowRight size={18} />
        <span className="text-sm font-medium">العودة للرئيسية</span>
      </Link>

      {/* Glassmorphic Card */}
      <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
        
        {/* Logo outside the card for floating effect */}
        <div className="flex flex-col items-center justify-center mb-6 drop-shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-white/10 p-1 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-4">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-wide drop-shadow-lg">
            Gool<span className="text-primary">bet</span>
          </h1>
          <p className="text-white/70 text-sm mt-2 font-medium tracking-wide">المنصة الأولى للمراهنات الرياضية</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
            <p className="text-white/50 text-sm">أدخل بياناتك للوصول إلى حسابك</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">كلمة المرور</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30 text-left"
                  dir="ltr"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary w-4 h-4 transition-colors" 
                />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">تذكرني</span>
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">نسيت كلمة المرور؟</a>
            </div>
            
            <Button className="w-full h-12 text-base font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] mt-4 transition-all active:scale-[0.98]" type="submit" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              {!isLoading && <ArrowLeft className="mr-2" size={18} />}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-white/10 w-full absolute"></div>
            <div className="bg-[#1a2233] px-3 relative text-xs font-semibold text-white/40 uppercase tracking-wider rounded-full py-1 border border-white/5">أو الدخول بواسطة</div>
          </div>

          <div className="space-y-3">
            <div className="[&>div]:w-full [&>div>iframe]:w-full flex justify-center">
              <TelegramLoginWidget 
                botName="your_bot_username_here"
                onAuth={handleTelegramAuth}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full h-11 border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium backdrop-blur-sm"
              onClick={handleMockTelegramLogin}
              type="button"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2 ml-2 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
              متابعة كضيف (تجريبي)
            </Button>
          </div>

          <p className="text-center text-sm text-white/60 mt-8">
            ليس لديك حساب؟ <Link to="/register" className="font-bold text-primary hover:text-white transition-all">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
