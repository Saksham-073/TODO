import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout, clearError, selectAuth } from '../redux/authSlice';
import { Fingerprint, AlertCircle, X, Eye, EyeOff, LogIn, UserPlus, LogOut, Loader2, Sparkles } from 'lucide-react';

const DEMO_USERNAME = 'demo';
const DEMO_PASSWORD = 'demo1234';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(selectAuth);

  const isRegister = mode === 'register';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    if (isRegister) {
      dispatch(register(username, password));
    } else {
      dispatch(login(username, password));
    }
  };

  const handleDemoLogin = () => {
    if (error) dispatch(clearError());
    dispatch(login(DEMO_USERNAME, DEMO_PASSWORD));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isAuthenticated) {
    return (
      <div className="card-organic overflow-hidden animate-fade-in-up">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sage-soft flex items-center justify-center font-display text-xl font-semibold text-sage-dark uppercase">
              {user.username?.charAt(0)}
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-ink">
                Hi, {user.username}
              </h3>
              <p className="text-muted text-sm mt-0.5">
                Let's make today count.
              </p>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-ghost" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Signing out…
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign out
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-organic overflow-hidden max-w-md mx-auto animate-fade-in-up">
      <div className="p-8">
        <div className="flex w-full p-1 bg-cream rounded-2xl mb-8">
          {[
            { key: 'login', label: 'Sign in' },
            { key: 'register', label: 'Create account' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setMode(tab.key);
                if (error) dispatch(clearError());
              }}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                mode === tab.key ? 'bg-paper text-clay shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-clay-soft rounded-2xl flex items-center justify-center mb-4">
            {isRegister
              ? <UserPlus className="h-8 w-8 text-clay" strokeWidth={2} />
              : <Fingerprint className="h-8 w-8 text-clay" strokeWidth={2} />}
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-muted text-sm mt-1">
            {isRegister
              ? 'Pick a username and password to get started.'
              : 'Sign in to pick up where you left off.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-clay-soft/70 rounded-xl flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-clay-dark mr-2 flex-shrink-0" />
              <span className="text-clay-dark text-sm">{error}</span>
            </div>
            <button
              type="button"
              className="text-clay-dark/70 hover:text-clay-dark"
              onClick={() => dispatch(clearError())}
              aria-label="Dismiss error"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-ink mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="field-organic"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="field-organic pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? "At least 6 characters" : "Enter your password"}
                minLength={isRegister ? 6 : undefined}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-clay w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                {isRegister ? 'Creating account…' : 'Signing in…'}
              </>
            ) : isRegister ? (
              <>
                <UserPlus className="h-5 w-5" />
                Create account
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign in
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted pt-1">
            {isRegister
              ? 'New here? Creating an account logs you in right away.'
              : 'No account yet? Switch to “Create account” above.'}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn-ghost w-full"
            disabled={loading}
          >
            <Sparkles className="h-4 w-4 text-clay" />
            Try the demo account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
