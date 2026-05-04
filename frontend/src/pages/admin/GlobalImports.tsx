import { Search, Filter, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

const GlobalImports = () => {
  const { t } = useTranslation();
  const globalData = [
    { id: 'IMP-998', user: 'jane.doe@company.com', file: 'Q3_Financials.xlsx', date: '5 mins ago', rows: 14002, status: 'Success' },
    { id: 'IMP-997', user: 'bob.smith@company.com', file: 'HR_Data_Refresh.csv', date: '25 mins ago', rows: 540, status: 'Failed' },
    { id: 'IMP-996', user: 'alice.w@company.com', file: 'Marketing_v2.xlsx', date: '1 hour ago', rows: 2901, status: 'Success' },
    { id: 'IMP-995', user: 'system_cron', file: 'Nightly_Sync_Dump.xls', date: '8 hours ago', rows: 84029, status: 'Success' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white tracking-tight">{t('admin.imports')}</h2>
          <p className="text-slate-400">{t('admin.importsSub')}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search user or file..." 
              className="bg-slate-800 border border-slate-700 text-sm rounded-lg pl-9 pr-4 py-2 w-full md:w-64 focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake text-white"
            />
          </div>
          <button className="bg-slate-800 border border-slate-700 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition">
            <Filter className="w-4 h-4" />
          </button>
          <button className="bg-snowflake flex items-center space-x-2 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-snowflake-light transition">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="p-4">Import ID</th>
                <th className="p-4">User</th>
                <th className="p-4">File Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Rows Loaded</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {globalData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-400">{row.id}</td>
                  <td className="p-4 text-sm font-medium text-white">{row.user}</td>
                  <td className="p-4 text-sm text-slate-300">{row.file}</td>
                  <td className="p-4 text-sm text-slate-400">{row.date}</td>
                  <td className="p-4 text-sm text-slate-300">{row.rows.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      row.status === 'Success' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    )}>
                      {row.status}
                    </span>
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

export default GlobalImports;
