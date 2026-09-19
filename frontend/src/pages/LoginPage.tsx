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
      className="h-[100dvh] w-full flex items-center justify-center p-3 relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: 'url(/stadium-bg.jpg)' }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0f172a]/90 z-0"></div>

      {/* Back button */}
      <Link to="/" className="absolute top-4 right-4 z-20 flex items-center gap-1.5 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10">
        <ArrowRight size={16} />
        <span className="text-xs font-medium">الرئيسية</span>
      </Link>

      {/* Glassmorphic Modal taking full possible space compressed */}
      <div className="w-full h-full max-w-md max-h-[95vh] relative z-10 flex flex-col justify-center animate-fade-in-up">
        
        {/* Logo outside the card */}
        <div className="flex flex-col items-center justify-center mb-2 drop-shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/10 p-1 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(34,197,94,0.3)] mb-2">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide drop-shadow-lg leading-none">
            Gool<span className="text-primary">bet</span>
          </h1>
          <p className="text-white/70 text-[10px] mt-1 font-medium tracking-wide">المنصة الأولى للمراهنات</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-center flex-1 max-h-full overflow-y-auto custom-scrollbar">
          
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-1">تسجيل الدخول</h2>
            <p className="text-white/50 text-xs">أدخل بياناتك للوصول إلى حسابك</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg text-xs mb-4 flex items-start gap-1.5">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/80">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-white/80">كلمة المرور</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 pl-10 text-sm outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30 text-left"
                  dir="ltr"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary w-3.5 h-3.5 transition-colors" 
                />
                <span className="text-xs text-white/60 group-hover:text-white transition-colors">تذكرني</span>
              </label>
              <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">نسيت كلمة المرور؟</a>
            </div>
            
            <Button className="w-full h-10 text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] mt-2 transition-all active:scale-[0.98]" type="submit" disabled={isLoading}>
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
              {!isLoading && <ArrowLeft className="mr-1.5" size={16} />}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full absolute"></div>
            <div className="bg-[#1a2233] px-2 relative text-[10px] font-semibold text-white/40 uppercase tracking-wider rounded-full py-0.5 border border-white/5">أو الدخول بواسطة</div>
          </div>

          <div className="space-y-2">
            <div className="[&>div]:w-full [&>div>iframe]:w-full flex justify-center scale-90 origin-top">
              <TelegramLoginWidget 
                botName="your_bot_username_here"
                onAuth={handleTelegramAuth}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full h-9 text-xs border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium backdrop-blur-sm"
              onClick={handleMockTelegramLogin}
              type="button"
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-1.5 ml-1.5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
              متابعة كضيف
            </Button>
          </div>

          <p className="text-center text-xs text-white/60 mt-4">
            ليس لديك حساب؟ <Link to="/register" className="font-bold text-primary hover:text-white transition-all">إنشاء حساب</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
