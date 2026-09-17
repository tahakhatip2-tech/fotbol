import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { Button } from './Button';
import { ShieldCheck, Zap } from 'lucide-react';

export const DynamicPageHero: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  // Home Page
  if (location.pathname === '/') {
    return (
      <HeroSection
        title={
          <>
            توقع. راهن. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              اربح بثقة تامة.
            </span>
          </>
        }
        subtitle="استمتع بتجربة مراهنة لا مثيل لها مع احتمالات فورية، وعوائد سريعة بمجرد انتهاء المباراة."
        backgroundImage="/hero-img.jpg"
        badge="المنصة الأولى للرهانات الرياضية 🏆"
      >
        <div className="flex flex-row gap-2 justify-center items-center w-full">
          {!isLoggedIn ? (
            <>
              <Link to="/register" className="w-full max-w-[160px]">
                <Button className="w-full h-11 text-sm bg-blue-600 hover:bg-blue-700 shadow-md">
                  ابدأ الرهان
                </Button>
              </Link>
              <Link to="/register" className="w-full max-w-[160px]">
                <Button variant="outline" className="w-full h-11 text-sm bg-white/50 backdrop-blur-sm border-blue-200">
                  إنشاء حساب
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/matches" className="w-full max-w-[200px]">
              <Button className="w-full h-11 text-sm bg-blue-600 hover:bg-blue-700 shadow-md">
                تصفح المباريات الآن
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-200/50 w-full max-w-md justify-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
            <ShieldCheck size={16} className="text-green-600" /> تشفير آمن 100%
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
            <Zap size={16} className="text-amber-500" /> دفع فوري
          </div>
        </div>
      </HeroSection>
    );
  }

  // Matches Page
  if (location.pathname === '/matches') {
    return (
      <HeroSection
        title={
          <>
            تابع أقوى <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">المباريات</span>
          </>
        }
        subtitle="استعرض أحدث المباريات، حلل الاحتمالات، وضع رهانك الرابح الآن."
        backgroundImage="/hero-img.jpg"
        badge="مباريات اليوم ⚽"
        minHeight="min-h-[20vh] md:min-h-[25vh]"
      />
    );
  }

  // Wallet Page
  if (location.pathname === '/wallet') {
    return (
      <HeroSection
        title={
          <>
            إدارة أموالك <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">بسهولة</span>
          </>
        }
        subtitle="اشحن رصيدك أو اسحب أرباحك بسرعة البرق وبدون أي تعقيدات."
        backgroundImage="/hero-img.jpg"
        badge="أمان تام 🔒"
        minHeight="min-h-[20vh] md:min-h-[25vh]"
      />
    );
  }

  // Profile Page
  if (location.pathname === '/profile') {
    return (
      <HeroSection
        title={
          <>
            مرحباً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">عالم Goolbet</span>
          </>
        }
        subtitle="تابع سجل رهاناتك، تحكم في إعداداتك، وابقَ على اطلاع دائم."
        backgroundImage="/hero-img.jpg"
        badge="الملف الشخصي 👤"
        minHeight="min-h-[20vh] md:min-h-[25vh]"
      />
    );
  }

  // Fallback for other pages
  return null;
};
