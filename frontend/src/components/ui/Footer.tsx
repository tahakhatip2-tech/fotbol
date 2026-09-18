import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail, Shield, ShieldCheck, Gamepad2, Copyright } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 border-t border-slate-200 bg-white/60 backdrop-blur-xl pb-24 md:pb-8 pt-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12 text-center md:text-right">
          
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group mx-auto md:mx-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <img src="/logo.jpg" alt="Goolbet Logo" className="w-full h-full object-cover rounded-[10px]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-800">
                Gool<span className="text-primary">bet</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm mx-auto md:mx-0 leading-relaxed">
              منصتك الأولى للمراهنات الرياضية. استمتع بأفضل الاحتمالات، وتجربة مستخدم لا مثيل لها مع ضمان الأمان والموثوقية التامة في كل خطوة.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/matches" className="text-slate-500 hover:text-primary transition-colors text-sm flex items-center justify-center md:justify-start gap-2">
                  <Gamepad2 size={16} />
                  المباريات
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="text-slate-500 hover:text-primary transition-colors text-sm flex items-center justify-center md:justify-start gap-2">
                  <WalletIcon size={16} />
                  المحفظة
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-500 hover:text-primary transition-colors text-sm flex items-center justify-center md:justify-start gap-2">
                  <UserIcon size={16} />
                  حسابي
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">الدعم الفني</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@Goolbet.com" className="text-slate-500 hover:text-primary transition-colors text-sm flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} />
                  support@Goolbet.com
                </a>
              </li>
              <li>
                <div className="text-slate-500 text-sm flex items-center justify-center md:justify-start gap-2 cursor-default">
                  <Shield size={16} />
                  سياسة الخصوصية
                </div>
              </li>
              <li>
                <div className="text-slate-500 text-sm flex items-center justify-center md:justify-start gap-2 cursor-default">
                  <ShieldCheck size={16} />
                  شروط الاستخدام
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>

        {/* Copyright & Developer Signature */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400 flex items-center gap-1">
            <Copyright size={14} />
            <span>{new Date().getFullYear()} Goolbet. جميع الحقوق محفوظة.</span>
          </div>
          
          {/* Developer Signature */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
            <span className="text-slate-500">تم التطوير بواسطة:</span>
            <a 
              href="https://github.com/tahakhatip2-tech" 
              target="_blank" 
              rel="noreferrer"
              className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-500 hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              طه الخطيب
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper icons
const WalletIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
);
const UserIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
