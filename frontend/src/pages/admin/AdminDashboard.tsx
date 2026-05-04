import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Users, AlertTriangle, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const data = [
    { name: 'Jan', usage: 4000, errors: 240 },
    { name: 'Feb', usage: 3000, errors: 139 },
    { name: 'Mar', usage: 2000, errors: 980 },
    { name: 'Apr', usage: 2780, errors: 390 },
    { name: 'May', usage: 1890, errors: 480 },
    { name: 'Jun', usage: 2390, errors: 380 },
    { name: 'Jul', usage: 3490, errors: 430 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto text-slate-900 dark:text-white transition-colors">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">{t('admin.title')}</h2>
        <p className="text-slate-600 dark:text-slate-400 transition-colors">{t('admin.subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Users', value: '142', icon: Users, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Global Imports Today', value: '3,842', icon: Activity, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'System Error Rate', value: '1.2%', icon: AlertTriangle, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
          { label: 'Total Volume Loaded', value: '45.2 GB', icon: Database, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 flex items-start space-x-4 shadow-lg shadow-slate-200/50 dark:shadow-black/10 transition-colors duration-300">
            <div className={`p-3 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">{kpi.label}</p>
              <h4 className="text-2xl font-bold mt-1">{kpi.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors duration-300 shadow-md dark:shadow-none">
          <h3 className="text-lg font-semibold mb-6">Platform Data Volume (MB)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-base, #ffffff)', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="usage" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors duration-300 shadow-md dark:shadow-none">
          <h3 className="text-lg font-semibold mb-6">Error Rate Tracking</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                  contentStyle={{ backgroundColor: 'var(--bg-base, #ffffff)', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Bar dataKey="errors" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
