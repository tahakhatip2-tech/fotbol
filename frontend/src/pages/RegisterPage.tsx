import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

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

    if (formData.password !== formData.confirmPassword) {
      return setError('كلمتا المرور غير متطابقتين');
    }

    setIsLoading(true);
    try {
      const formattedEmail = formData.email.trim().toLowerCase();
      // Split full name into first and last name if user only typed one field, 
      // but we have two separate logical fields. Here we just take firstName as typed.
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formattedEmail,
        password: formData.password
      });
      
      // Attempt login immediately after registration
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
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center bg-no-repeat py-8"
      style={{ backgroundImage: 'url(/auth-bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>
      
      <div className="glass w-full max-w-md p-8 md:p-10 rounded-3xl relative z-10 overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md my-auto">
        
        {/* App Logo & Name at the top */}
        <div className="flex flex-col items-center justify-center mb-6 mt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 p-1 mb-3 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <img src="/logo.jpg" alt="Goolbet Logo" className="w-full h-full object-cover rounded-full border-2 border-white/80" />
          </div>
          <h1 className="text-3xl font-black text-center text-white drop-shadow-md">
            Gool<span className="text-primary">bet</span>
          </h1>
          <p className="text-white/80 text-sm mt-1">تسجيل حساب جديد</p>
        </div>
        
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">{error}</div>}

        <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">الاسم الأول</label>
              <input 
                type="text" 
                required
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
                placeholder="أحمد"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">اسم العائلة</label>
              <input 
                type="text" 
                required
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
                placeholder="محمد"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
              placeholder="example@fotbol.com"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">كلمة المرور</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 pl-12 outline-none focus:border-primary transition-colors focus:bg-background text-left"
                dir="ltr"
                placeholder="********"
              />
              <button 
                type="button" 
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm text-muted-foreground">تأكيد كلمة المرور</label>
              {isMatch && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> متطابقة</span>}
              {isMismatch && <span className="text-xs text-red-400 flex items-center gap-1"><XCircle size={12} /> غير متطابقة</span>}
            </div>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className={`w-full bg-background/50 border rounded-xl px-4 py-3 pl-12 outline-none transition-colors focus:bg-background text-left ${isMatch ? 'border-emerald-500/50 focus:border-emerald-500' : isMismatch ? 'border-red-500/50 focus:border-red-500' : 'border-border/50 focus:border-primary'}`}
                dir="ltr"
                placeholder="********"
              />
              <button 
                type="button" 
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button disabled={isLoading} className="w-full mt-6 h-11 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]" type="submit">
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-border w-full absolute"></div>
          <div className="bg-card px-4 relative text-sm text-muted-foreground">أو</div>
        </div>

        {/* Telegram Login Widget */}
        <Button 
          variant="outline" 
          className="w-full h-11 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
          onClick={handleTelegramLogin}
          type="button"
        >
          <svg className="w-5 h-5 mr-2 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
          التسجيل باستخدام تيليجرام
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          لديك حساب بالفعل؟ <a href="/login" className="text-primary hover:underline">تسجيل الدخول</a>
        </p>
        {/* Footer with App Name and Version */}
        <div className="mt-8 text-center border-t border-white/10 pt-4">
          <p className="text-white/60 text-xs font-bold tracking-widest">
            Goolbet v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
