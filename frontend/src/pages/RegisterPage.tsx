import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0f172a] overflow-hidden">
      
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        
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
            انضم الآن إلى <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              مجتمع الفائزين
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            أنشئ حسابك في ثوانٍ معدودة وابدأ رحلتك في عالم المراهنات الرياضية بكل ثقة وأمان.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm animate-fade-in">
          &copy; {new Date().getFullYear()} Goolbet. جميع الحقوق محفوظة.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full min-h-screen lg:min-h-0 lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white lg:rounded-r-[2.5rem] shadow-[20px_0_40px_rgba(0,0,0,0.3)] z-10">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 right-8 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-sm border border-slate-100">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-md" />
          </div>
          <span className="text-lg font-black text-slate-900">Gool<span className="text-primary">bet</span></span>
        </div>

        <div className="w-full max-w-[420px] animate-fade-in mx-auto mt-12 lg:mt-0">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">إنشاء حساب</h2>
            <p className="text-slate-500 text-sm">أدخل بياناتك لإنشاء حساب جديد مجاناً</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">الاسم الأول</label>
                <input 
                  type="text" 
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900"
                  placeholder="أحمد"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">اسم العائلة</label>
                <input 
                  type="text" 
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900"
                  placeholder="محمد"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">كلمة المرور</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-11 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 text-left"
                  dir="ltr"
                  placeholder="••••••••"
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

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">تأكيد كلمة المرور</label>
                {isMatch && <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full"><CheckCircle2 size={10} /> متطابقة</span>}
                {isMismatch && <span className="text-[11px] font-medium text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full"><XCircle size={10} /> غير متطابقة</span>}
              </div>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 pl-11 outline-none transition-all text-slate-900 text-left ${isMatch ? 'border-emerald-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10' : isMismatch ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'}`}
                  dir="ltr"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <Button disabled={isLoading} className="w-full h-11 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 mt-4 transition-all active:scale-[0.98]" type="submit">
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              {!isLoading && <ArrowRight className="mr-2 rotate-180" size={18} />}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-slate-200 w-full absolute"></div>
            <div className="bg-white px-4 relative text-xs font-semibold text-slate-400 uppercase tracking-wider">أو الدخول بواسطة</div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-11 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium"
            onClick={handleTelegramLogin}
            type="button"
          >
            <svg className="w-5 h-5 mr-2 ml-2 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
            التسجيل باستخدام تيليجرام
          </Button>

          <p className="text-center text-sm text-slate-600 mt-8">
            لديك حساب بالفعل؟ <a href="/login" className="font-semibold text-primary hover:underline transition-all">تسجيل الدخول</a>
          </p>
        </div>
      </div>
    </div>
  );
};
