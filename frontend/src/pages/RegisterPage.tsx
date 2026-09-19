import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const isMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const isMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError('يرجى إدخال بريد إلكتروني صحيح.');
    }

    if (formData.password.length < 6) {
      return setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('كلمتا المرور غير متطابقتين.');
    }

    setIsLoading(true);
    try {
      const formattedEmail = formData.email.trim().toLowerCase();
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formattedEmail,
        password: formData.password
      });
      
      const loginRes = await api.post('/auth/login', {
        email: formattedEmail,
        password: formData.password
      });

      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramLogin = () => {
    alert('لإكمال التسجيل عبر تيليجرام، يجب أولاً ربط (Bot Token) من @BotFather في الإعدادات. سيتم محاكاة التسجيل الآن.');
    setTimeout(() => {
      localStorage.setItem('token', 'mock_telegram_jwt_token');
      navigate('/');
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 py-12 relative bg-cover bg-center bg-no-repeat overflow-hidden"
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
      <div className="w-full max-w-[460px] relative z-10 animate-fade-in-up">
        
        {/* Logo outside the card for floating effect */}
        <div className="flex flex-col items-center justify-center mb-6 drop-shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/10 p-1 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-3">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-wide drop-shadow-lg">
            Gool<span className="text-primary">bet</span>
          </h1>
          <p className="text-white/70 text-sm mt-1 font-medium tracking-wide">تسجيل حساب جديد</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white/80">الاسم الأول</label>
                <input 
                  type="text" 
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30"
                  placeholder="أحمد"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white/80">اسم العائلة</label>
                <input 
                  type="text" 
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30"
                  placeholder="محمد"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/80">كلمة المرور</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 outline-none focus:border-primary focus:bg-white/10 transition-all text-white placeholder-white/30 text-left"
                  dir="ltr"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-white/80">تأكيد كلمة المرور</label>
                {isMatch && <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full"><CheckCircle2 size={10} /> متطابقة</span>}
                {isMismatch && <span className="text-[11px] font-medium text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full"><XCircle size={10} /> غير متطابقة</span>}
              </div>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 pl-11 outline-none transition-all text-white placeholder-white/30 text-left ${isMatch ? 'border-emerald-500 focus:border-emerald-500 focus:bg-emerald-500/10' : isMismatch ? 'border-red-500 focus:border-red-500 focus:bg-red-500/10' : 'border-white/10 focus:border-primary focus:bg-white/10'}`}
                  dir="ltr"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <Button disabled={isLoading} className="w-full h-12 text-base font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] mt-4 transition-all active:scale-[0.98]" type="submit">
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              {!isLoading && <ArrowLeft className="mr-2" size={18} />}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-white/10 w-full absolute"></div>
            <div className="bg-[#1a2233] px-3 relative text-xs font-semibold text-white/40 uppercase tracking-wider rounded-full py-1 border border-white/5">أو الدخول بواسطة</div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-11 border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium backdrop-blur-sm"
            onClick={handleTelegramLogin}
            type="button"
          >
            <svg className="w-5 h-5 mr-2 ml-2 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
            التسجيل باستخدام تيليجرام
          </Button>

          <p className="text-center text-sm text-white/60 mt-8">
            لديك حساب بالفعل؟ <Link to="/login" className="font-bold text-primary hover:text-white transition-all">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
