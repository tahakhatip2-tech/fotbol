import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Mail, Wallet, Clock, UserCheck, UserX } from 'lucide-react';
import { HeroSection } from '../../components/ui/HeroSection';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <HeroSection 
        title={
          <>
            إدارة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">المستخدمين</span>
          </>
        }
        subtitle="متابعة حسابات المستخدمين وأرصدتهم."
        badge="لوحة الإدارة ⚙️"
        minHeight="min-h-[30vh]"
      />

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-48 glass rounded-3xl">
             <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="glass rounded-3xl text-center py-16 text-muted-foreground flex flex-col items-center">
            <Users size={48} className="opacity-20 mb-4" />
            <p>لا يوجد مستخدمين مسجلين.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div key={user.id} className="glass rounded-3xl p-5 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors -z-10 pointer-events-none"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold backdrop-blur-md">
                      <UserCheck size={12} /> نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold backdrop-blur-md">
                      <UserX size={12} /> محظور
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black text-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] shrink-0">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white text-lg truncate group-hover:text-primary transition-colors">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 truncate">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                  <div className="bg-emerald-500/5 rounded-2xl p-3 border border-emerald-500/10">
                    <div className="text-[10px] text-muted-foreground font-medium mb-1 flex items-center gap-1">
                      <Wallet size={10} className="text-emerald-400" /> الرصيد المتاح
                    </div>
                    <div className="font-black text-emerald-400 text-sm">
                      ${user.wallet?.balance?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className="bg-amber-500/5 rounded-2xl p-3 border border-amber-500/10">
                    <div className="text-[10px] text-muted-foreground font-medium mb-1 flex items-center gap-1">
                      <Clock size={10} className="text-amber-500" /> الرصيد المعلق
                    </div>
                    <div className="font-black text-amber-500 text-sm">
                      ${user.wallet?.lockedBalance?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground/50 border-t border-white/5 pt-3 relative z-10 text-center">
                  انضم في: {new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
