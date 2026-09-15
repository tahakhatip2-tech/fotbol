import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { login } from '../api/auth';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramLogin = () => {
    // In a real app, this would open the Telegram OAuth popup
    alert('لإكمال تسجيل الدخول عبر تيليجرام، يجب أولاً ربط (Bot Token) من @BotFather في الإعدادات. سيتم محاكاتها الآن.');
    setTimeout(() => {
      localStorage.setItem('token', 'mock_telegram_jwt_token');
      navigate('/');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من البيانات.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10"></div>
      <div className="glass w-full max-w-md p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <h1 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-primary to-green-300 bg-clip-text text-transparent">{t('login')}</h1>
        
        <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm">{error}</div>}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
              placeholder="example@fotbol.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors focus:bg-background"
              placeholder="********"
              required
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-muted-foreground">تذكرني</span>
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
        <Button 
          variant="outline" 
          className="w-full h-11 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
          onClick={handleTelegramLogin}
          type="button"
        >
          <svg className="w-5 h-5 mr-2 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.613-.6.125-.89l10.736-4.133c.5-.186.953.106.825.99z"/></svg>
          المتابعة باستخدام تيليجرام
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ليس لديك حساب؟ <a href="/register" className="text-primary hover:underline">سجل الآن</a>
        </p>
      </div>
    </div>
  );
};
