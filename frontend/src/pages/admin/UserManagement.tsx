import { Search, ShieldAlert, KeyRound, Power } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
  const { t } = useTranslation();
  const users = [
    { id: 1, name: 'Jane Doe', email: 'jane.doe@company.com', role: 'Admin', status: 'Active', lastLogin: 'Today' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@company.com', role: 'User', status: 'Active', lastLogin: 'Yesterday' },
    { id: 3, name: 'Alice W.', email: 'alice.w@company.com', role: 'User', status: 'Inactive', lastLogin: '2 months ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{t('admin.users')}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t('admin.usersSub')}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by email..." 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg pl-9 pr-4 py-2 w-full md:w-64 focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake text-slate-900 dark:text-white transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold transition-colors duration-300">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 transition-colors duration-300">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/20 transition-colors group">
                  <td className="p-4">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center",
                      user.role === 'Admin' 
                        ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    )}>
                      {user.role === 'Admin' && <ShieldAlert className="w-3 h-3 mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={clsx("w-2 h-2 rounded-full", user.status === 'Active' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-500")} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.lastLogin}</td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-snowflake hover:bg-snowflake/10 transition" title="Reset Password">
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition" title="Deactivate">
                      <Power className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
