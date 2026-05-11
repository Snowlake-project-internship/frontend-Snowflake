import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud, FileSpreadsheet, CheckCircle2,
  AlertCircle, RefreshCw, X, AlertTriangle,
  PlusCircle, ArrowDownCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API = 'http://localhost:8000';

// ── Types ──────────────────────────────────────────────────────

interface TableInfo {
  rows:    number;
  columns: string[];
  action:  'CREATE' | 'INSERT';
}

interface AnalyzeResult {
  session_id:      string;
  org_name:        string;
  org_exists:      boolean;
  preview:         Record<string, TableInfo>;
  duplicates:      Record<string, { count: number }>;
  has_duplicates:  boolean;
  existing_tables: string[];
  new_tables:      string[];
}

// ── Popup Component ────────────────────────────────────────────

const ConfirmPopup = ({
  result, onConfirm, onCancel, isLoading
}: {
  result: AnalyzeResult;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Confirmation avant sauvegarde
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 p-6 space-y-4">

        {/* Org status */}
        {result.org_exists ? (
          <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
            <ArrowDownCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300">Organisation existante</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                Le schéma <span className="font-mono font-bold">"{result.org_name}"</span> existe.
                Les données seront <strong>ajoutées</strong> aux tables existantes.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg p-4">
            <PlusCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">Nouvelle organisation</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                Un nouveau schéma <span className="font-mono font-bold">"{result.org_name}"</span> sera créé.
              </p>
            </div>
          </div>
        )}

        {/* Duplicates */}
        {result.has_duplicates && (
          <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-300">Doublons détectés et supprimés</p>
              {Object.entries(result.duplicates).map(([sheet, info]) => (
                <p key={sheet} className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  • <span className="font-mono">{sheet}</span> : {info.count} doublon(s)
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Tables list */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Tables à traiter ({Object.keys(result.preview).length})
          </p>
          <div className="space-y-2">
            {Object.entries(result.preview).map(([sheet, info]) => (
              <div key={sheet} className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                    {sheet.toLowerCase()}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {info.rows} lignes · {info.columns.length} colonnes
                  </p>
                </div>
                <span className={clsx(
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  info.action === 'CREATE'
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                )}>
                  {info.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-lg bg-snowflake hover:bg-snowflake-dark text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-60 shadow-lg shadow-snowflake/20"
        >
          {isLoading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sauvegarde...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4" />Confirmer et sauvegarder</>
          )}
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────

const UploadCenter = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [file,            setFile]            = useState<File | null>(null);
  const [orgName,         setOrgName]         = useState('');
  const [isUploading,     setIsUploading]     = useState(false);
  const [validationStage, setValidationStage] = useState<'idle'|'validating'|'success'|'error'>('idle');
  const [analyzeResult,   setAnalyzeResult]   = useState<AnalyzeResult | null>(null);
  const [showPopup,       setShowPopup]       = useState(false);
  const [errorMsg,        setErrorMsg]        = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setValidationStage('idle');
      setAnalyzeResult(null);
      setErrorMsg('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  // ── Analyze (token envoyé automatiquement via l'interceptor) ──
  const handleAnalyze = async () => {
    if (!file || !orgName.trim()) return;

    setIsUploading(true);
    setValidationStage('validating');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('org_name', orgName.trim());

    try {
      const { data } = await axios.post<AnalyzeResult>(
        `${API}/api/upload/analyze`, formData
        // Pas besoin de headers manuels — l'interceptor ajoute Authorization automatiquement
      );
      setAnalyzeResult(data);
      setValidationStage('success');
      setShowPopup(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setValidationStage('error');
      setErrorMsg(e?.response?.data?.detail ?? 'Erreur lors de l\'analyse.');
    } finally {
      setIsUploading(false);
    }
  };

  // ── Confirm save (token envoyé automatiquement via l'interceptor) ──
  const handleConfirm = async () => {
    if (!analyzeResult) return;

    setIsUploading(true);

    try {
      await axios.post(`${API}/api/save`, {
        session_id: analyzeResult.session_id,
        org_name:   analyzeResult.org_name,
        user_id:    user?.id ? Number(user.id) : null,
      });

      setShowPopup(false);
      setFile(null);
      setOrgName('');
      setValidationStage('idle');
      setAnalyzeResult(null);
      alert('File successfully loaded into Snowflake!');

    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setShowPopup(false);
      setValidationStage('error');
      setErrorMsg(e?.response?.data?.detail ?? 'Erreur lors de la sauvegarde.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {showPopup && analyzeResult && (
        <ConfirmPopup
          result={analyzeResult}
          onConfirm={handleConfirm}
          onCancel={() => setShowPopup(false)}
          isLoading={isUploading}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-900 dark:text-white transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">{t('upload.title')}</h2>
            <p className="text-slate-600 dark:text-slate-400 transition-colors">{t('upload.subtitle')}</p>
          </div>
        </div>

        {/* Champ Organisation */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Nom de l'organisation
          </label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Ex: orange_maroc"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake transition-colors"
          />
        </div>

        {/* Dropzone */}
        {!file ? (
          <div
            {...getRootProps()}
            className={twMerge(clsx(
              'border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group bg-slate-50 dark:bg-slate-800/30',
              isDragActive
                ? 'border-snowflake bg-snowflake/5'
                : 'border-slate-300 dark:border-slate-700 hover:border-snowflake dark:hover:border-snowflake hover:bg-slate-100 dark:hover:bg-slate-800/80',
            ))}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm dark:shadow-none group-hover:scale-110 group-hover:bg-snowflake/10 dark:group-hover:bg-snowflake/20 transition-all duration-300">
              <UploadCloud className={clsx('w-8 h-8', isDragActive ? 'text-snowflake' : 'text-slate-400 group-hover:text-snowflake')} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isDragActive ? t('upload.dropHere') : t('upload.clickOrDrag')}
            </h3>
            <p className="text-slate-500 text-sm">{t('upload.supports')}</p>
          </div>

        ) : (

          <div className="bg-white dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-md dark:shadow-none transition-colors duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-snowflake/10 rounded-xl">
                  <FileSpreadsheet className="text-snowflake w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{file.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    {(file.size / 1024).toFixed(2)} KB · Modified {new Date(file.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setValidationStage('idle'); setErrorMsg(''); }}
                className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                disabled={isUploading || validationStage === 'validating'}
              >
                {t('upload.cancel')}
              </button>
            </div>

            {/* Validation Status */}
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 transition-colors">
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-300 mb-4 uppercase tracking-wider">
                {t('upload.validationStatus')}
              </h4>

              {validationStage === 'validating' && (
                <div className="flex items-center space-x-3 text-snowflake animate-pulse">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{t('upload.validating')}</span>
                </div>
              )}

              {validationStage === 'success' && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-4 flex items-start space-x-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-300">{t('upload.validationPassed')}</p>
                    <p className="text-sm opacity-80 mt-1">{t('upload.validationPassedDesc')}</p>
                  </div>
                </div>
              )}

              {validationStage === 'error' && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 flex items-start space-x-3 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">{t('upload.validationFailed')}</p>
                    <p className="text-sm opacity-80 mt-1">{errorMsg || t('upload.validationFailedDesc')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={!orgName.trim() || isUploading || validationStage === 'validating'}
                className={clsx(
                  'px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all shadow-lg',
                  orgName.trim() && !isUploading
                    ? 'bg-snowflake hover:bg-snowflake-dark text-white shadow-snowflake/20'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                )}
              >
                {isUploading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /><span>{t('upload.pushing')}</span></>
                ) : (
                  <><UploadCloud className="w-4 h-4" /><span>{t('upload.sendToSnowflake')}</span></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadCenter;
