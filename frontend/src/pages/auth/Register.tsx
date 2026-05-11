import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API = 'http://localhost:8000';

const Register = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post(`${API}/api/auth/register`, { name, email, password });
      alert('Registration successful! Please login with your new credentials.');
      navigate('/login');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail ?? 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('auth.createAccount')}</h2>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('auth.fullNameLabel')}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('auth.emailLabel')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake transition-colors"
              placeholder="you@company.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{t('auth.passwordLabel')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-snowflake focus:ring-1 focus:ring-snowflake transition-colors"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Must be at least 6 characters long.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            "w-full bg-snowflake hover:bg-snowflake-dark text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-snowflake/20 mt-6",
            isSubmitting && "opacity-70 cursor-wait"
          )}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              {t('auth.signUp')}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-medium text-snowflake hover:text-snowflake-dark transition-colors">
          {t('auth.signInInstead')}
        </Link>
      </div>
    </div>
  );
};

export default Register;
