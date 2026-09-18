import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { login, telegramLogin } from '../api/auth';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0f172a] overflow-hidden">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}></div>

        <div className="relative z-10 flex items-center gap-3 animate-fade-in-down">
          <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-lg shadow-primary/20">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <span className="text-2xl font-black text-white tracking-wide">Gool<span className="text-primary">bet</span></span>
        </div>

        <div className="relative z-10 my-auto animate-fade-in-up">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            مرحباً بك في <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              المنصة الأولى
            </span> للمراهنات الرياضية
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            استمتع بتجربة مراهنات آمنة، سريعة، وموثوقة. تابع أحدث المباريات واربح جوائز قيمة بخطوات بسيطة.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm animate-fade-in">
          &copy; {new Date().getFullYear()} Goolbet. جميع الحقوق محفوظة.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full min-h-screen lg:min-h-0 lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white lg:rounded-l-[2.5rem] shadow-[-20px_0_40px_rgba(0,0,0,0.3)] z-10">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-sm border border-slate-100">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-md" />
          </div>
          <span className="text-lg font-black text-slate-900">Gool<span className="text-primary">bet</span></span>
        </div>

        <div className="w-full max-w-[380px] animate-fade-in mx-auto">
          <div className="text-center lg:text-right mb-8 mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">تسجيل الدخول</h2>
            <p className="text-slate-500 text-sm">أدخل بياناتك للوصول إلى حسابك</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">كلمة المرور</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-11 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 text-left"
                  dir="ltr"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 transition-colors" 
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">تذكرني</span>
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">نسيت كلمة المرور؟</a>
            </div>
            
            <Button className="w-full h-11 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 mt-2 transition-all active:scale-[0.98]" type="submit" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              {!isLoading && <ArrowRight className="mr-2 rotate-180" size={18} />}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="border-t border-slate-200 w-full absolute"></div>
            <div className="bg-white px-4 relative text-xs font-semibold text-slate-400 uppercase tracking-wider">أو الدخول بواسطة</div>
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
              className="w-full h-11 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium"
              onClick={handleMockTelegramLogin}
              type="button"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2 ml-2 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
              متابعة كضيف (تجريبي)
            </Button>
          </div>

          <p className="text-center text-sm text-slate-600 mt-8">
            ليس لديك حساب؟ <a href="/register" className="font-semibold text-primary hover:underline transition-all">إنشاء حساب جديد</a>
          </p>
        </div>
      </div>
    </div>
  );
};
