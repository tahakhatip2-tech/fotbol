import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Mail, Wallet, Clock, UserCheck, UserX } from 'lucide-react';

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
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-primary to-emerald-200 tracking-tight">إدارة المستخدمين</h1>
          <p className="text-muted-foreground mt-2 text-sm">متابعة حسابات المستخدمين وأرصدتهم.</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-2 md:p-6 border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
             <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
            <Users size={48} className="opacity-20 mb-4" />
            <p>لا يوجد مستخدمين مسجلين.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-sm text-right min-w-[900px]">
              <thead className="bg-secondary/40 text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="px-6 py-5 font-bold">المستخدم</th>
                  <th className="px-6 py-5 font-bold">البريد الإلكتروني</th>
                  <th className="px-6 py-5 font-bold text-center">الرصيد المتاح</th>
                  <th className="px-6 py-5 font-bold text-center">الرصيد المعلق</th>
                  <th className="px-6 py-5 font-bold text-center">تاريخ التسجيل</th>
                  <th className="px-6 py-5 font-bold text-center">حالة الحساب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/20">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div className="font-bold text-white group-hover:text-primary transition-colors">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={14} className="opacity-50" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-bold">
                        <Wallet size={14} /> ${user.wallet?.balance?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-sm font-bold">
                        <Clock size={14} /> ${user.wallet?.lockedBalance?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                          <UserCheck size={14} /> نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold">
                          <UserX size={14} /> محظور
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
