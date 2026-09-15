import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../api/axios';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('كلمتا المرور غير متطابقتين');
    }

    setIsLoading(true);
    try {
      // Split full name into first and last name if user only typed one field, 
      // but we have two separate logical fields. Here we just take firstName as typed.
      const res = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      // Attempt login immediately after registration
      const loginRes = await api.post('/auth/login', {
        email: formData.email,
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10"></div>
      <div className="glass w-full max-w-md p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <h1 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent">{t('register')}</h1>
        
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
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
              placeholder="********"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">تأكيد كلمة المرور</label>
            <input 
              type="password" 
              required
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
              placeholder="********"
            />
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
      </div>
    </div>
  );
};
