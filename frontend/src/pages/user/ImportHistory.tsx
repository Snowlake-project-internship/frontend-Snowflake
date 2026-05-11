import { useEffect, useState } from 'react';
import { Undo2, Search, Filter, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API = 'http://localhost:8000';

interface ImportRow {
  id:     string;
  file:   string;
  date:   string;
  rows:   number;
  status: string;
}

const ImportHistory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [historyData, setHistoryData] = useState<ImportRow[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [search,      setSearch]      = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = user?.id ? `?user_id=${user.id}` : '';
      const { data } = await axios.get<ImportRow[]>(`${API}/api/import/history${params}`);
      setHistoryData(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [user?.id]);

  const filtered = historyData.filter(row =>
    row.file.toLowerCase().includes(search.toLowerCase()) ||
    row.id.toLowerCase().includes(search.toLowerCase())
  );

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg pl-9 pr-4 py-2 w-full md:w-64 focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake text-slate-900 dark:text-white transition-colors duration-300 shadow-sm dark:shadow-none"
            />
          </div>
          <button
            onClick={fetchHistory}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm dark:shadow-none"
          >
            <RefreshCw className={clsx('w-4 h-4', isLoading && 'animate-spin')} />
          </button>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                    Aucun import trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/20 transition-colors group">
                    <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-300">{row.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{row.file}</td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{row.date}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{row.rows.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={clsx(
                        'px-2.5 py-1 rounded-full text-xs font-medium border',
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImportHistory;
