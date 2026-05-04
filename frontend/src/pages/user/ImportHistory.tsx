import { Undo2, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

const ImportHistory = () => {
  const { t } = useTranslation();
  const historyData = [
    { id: 'IMP-2041', file: 'Q3_Financials_v2.xlsx', date: '2 hours ago', rows: 14002, status: 'Success' },
    { id: 'IMP-2040', file: 'Marketing_Spend_August.xlsx', date: 'Yesterday', rows: 840, status: 'Success' },
    { id: 'IMP-2039', file: 'Employee_Roster_Q2.xlsx', date: 'Oct 12, 2026', rows: 0, status: 'Failed' },
    { id: 'IMP-2038', file: 'Leads_List_EMEA.csv', date: 'Oct 10, 2026', rows: 4590, status: 'Success' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{t('importHistory.title')}</h2>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">{t('importHistory.subtitle')}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t('importHistory.search')}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg pl-9 pr-4 py-2 w-full md:w-64 focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake text-slate-900 dark:text-white transition-colors duration-300 shadow-sm dark:shadow-none"
            />
          </div>
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm dark:shadow-none">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold transition-colors duration-300">
                <th className="p-4">{t('importHistory.colId')}</th>
                <th className="p-4">{t('importHistory.colFile')}</th>
                <th className="p-4">{t('importHistory.colDate')}</th>
                <th className="p-4">{t('importHistory.colRows')}</th>
                <th className="p-4">{t('importHistory.colStatus')}</th>
                <th className="p-4">{t('importHistory.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 transition-colors duration-300">
              {historyData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/20 transition-colors group">
                  <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-300">{row.id}</td>
                  <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{row.file}</td>
                  <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{row.date}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.rows.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      row.status === 'Success' 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                    )}>
                      {row.status === 'Success' ? t('importHistory.statusSuccess') : t('importHistory.statusFailed')}
                    </span>
                  </td>
                  <td className="p-4">
                    {row.status === 'Success' && (
                      <button className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 flex items-center space-x-1.5 text-sm font-medium transition-colors opacity-0 group-hover:opacity-100">
                        <Undo2 className="w-4 h-4" />
                        <span>{t('importHistory.rollback')}</span>
                      </button>
                    )}
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

export default ImportHistory;
