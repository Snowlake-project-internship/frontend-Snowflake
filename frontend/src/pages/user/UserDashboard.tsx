import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, CheckCircle, XCircle, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const data = [
  { name: 'Mon', success: 4000, error: 2400 },
  { name: 'Tue', success: 3000, error: 1398 },
  { name: 'Wed', success: 2000, error: 9800 },
  { name: 'Thu', success: 2780, error: 3908 },
  { name: 'Fri', success: 1890, error: 4800 },
  { name: 'Sat', success: 2390, error: 3800 },
  { name: 'Sun', success: 3490, error: 4300 },
];

const UserDashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto text-slate-900 dark:text-white transition-colors duration-300">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">{t('userDashboard.title')}</h2>
        <p className="text-slate-600 dark:text-slate-400 transition-colors">{t('userDashboard.subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('userDashboard.kpiTotal'), value: '1,248', icon: Activity, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: t('userDashboard.kpiSuccess'), value: '94.2%', icon: CheckCircle, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: t('userDashboard.kpiFailed'), value: '3,492', icon: XCircle, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
          { label: t('userDashboard.kpiVolume'), value: '1.2 GB', icon: Database, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 flex items-start space-x-4 shadow-md dark:shadow-none transition-colors duration-300">
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
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-md dark:shadow-none transition-colors duration-300">
          <h3 className="text-lg font-semibold mb-6">{t('userDashboard.chartVolume')}</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                  contentStyle={{ backgroundColor: 'var(--bg-base, #ffffff)', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Bar dataKey="success" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="error" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-md dark:shadow-none transition-colors duration-300">
          <h3 className="text-lg font-semibold mb-6">{t('userDashboard.chartQuality')}</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-base, #ffffff)', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="success" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
