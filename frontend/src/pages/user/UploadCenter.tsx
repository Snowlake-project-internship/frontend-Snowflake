import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

const UploadCenter = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationStage, setValidationStage] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      simulateValidation();
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

  const simulateValidation = () => {
    setValidationStage('validating');
    setTimeout(() => {
      setValidationStage('success'); // for the sake of demo, always succeed
    }, 2000);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setValidationStage('idle');
      alert('File successfully loaded into Snowflake!');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{t('upload.title')}</h2>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">{t('upload.subtitle')}</p>
        </div>
      </div>

      {/* Dropzone Area */}
      {!file ? (
        <div
          {...getRootProps()}
          className={twMerge(
            clsx(
              'border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group bg-slate-50 dark:bg-slate-800/30',
              isDragActive ? 'border-snowflake bg-snowflake/5' : 'border-slate-300 dark:border-slate-700 hover:border-snowflake dark:hover:border-snowflake hover:bg-slate-100 dark:hover:bg-slate-800/80',
            )
          )}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm dark:shadow-none group-hover:scale-110 group-hover:bg-snowflake/10 dark:group-hover:bg-snowflake/20 transition-all duration-300">
            <UploadCloud className={clsx("w-8 h-8", isDragActive ? "text-snowflake" : "text-slate-400 group-hover:text-snowflake")} />
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
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{(file.size / 1024).toFixed(2)} KB • Modified {new Date(file.lastModified).toLocaleDateString()}</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setValidationStage('idle'); }}
              className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              disabled={isUploading || validationStage === 'validating'}
            >
              {t('upload.cancel')}
            </button>
          </div>

          {/* Validation Status */}
          <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 transition-colors">
            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-300 mb-4 uppercase tracking-wider">{t('upload.validationStatus')}</h4>
            
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
                  <p className="text-sm opacity-80 mt-1">{t('upload.validationFailedDesc')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={validationStage !== 'success' || isUploading}
              className={clsx(
                "px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all shadow-lg",
                validationStage === 'success' && !isUploading
                  ? "bg-snowflake hover:bg-snowflake-light text-white shadow-snowflake/20"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              )}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('upload.pushing')}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>{t('upload.sendToSnowflake')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCenter;
