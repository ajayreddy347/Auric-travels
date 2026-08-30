import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Sparkles,
  Check,
  ArrowRight,
  Shield,
  Info,
  Loader2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { AuthUser } from '../types';
import { saveStoredUser } from '../utils/authStore';

export type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
  customMessage?: string;
  initialMode?: AuthMode;
  initialResetToken?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  customMessage,
  initialMode = 'signin',
  initialResetToken = ''
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(null);

  // Sync mode and token when props change
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialResetToken) {
      setResetToken(initialResetToken);
      setMode('reset');
    }
  }, [initialResetToken]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const performLogin = (userToSave: AuthUser, token?: string) => {
    saveStoredUser(userToSave, token);
    setAuthenticatedUser(userToSave);
    setSubmitted(true);
    setPassword('');

    setTimeout(() => {
      onSuccess?.(userToSave);
      onClose();
      setSubmitted(false);
      setEmail('');
      setName('');
      setErrorMessage(null);
    }, 600);
  };

  const handleTriggerGoogle = () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    // Direct redirect to Google OAuth start endpoint on backend
    window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(window.location.pathname)}`;
  };

  // Password strength calculation for reset mode
  const calculateStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-neutral-200 dark:bg-neutral-800' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-amber-500' };
    return { score, label: 'Strong Sovereign', color: 'bg-emerald-500' };
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const targetEmail = email.trim().toLowerCase();
    const targetPassword = password;

    try {
      if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to send reset link.');
        }

        setSuccessMessage(data.message || 'If an account exists with that email, a password reset link has been sent.');
        setLoading(false);
        return;
      }

      if (mode === 'reset') {
        if (!resetToken.trim()) {
          throw new Error('Missing password reset token. Please request a new link.');
        }
        if (targetPassword !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }
        if (targetPassword.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }

        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: resetToken.trim(),
            password: targetPassword,
            confirmPassword,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to reset password.');
        }

        setSuccessMessage(data.message || 'Your password has been successfully reset.');
        setTimeout(() => {
          setMode('signin');
          setSuccessMessage('Password reset complete! Please sign in with your new password.');
          setPassword('');
          setConfirmPassword('');
          setResetToken('');
        }, 1500);
        setLoading(false);
        return;
      }

      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const body =
        mode === 'signin'
          ? { email: targetEmail, password: targetPassword }
          : { name: name.trim() || targetEmail.split('@')[0], email: targetEmail, password: targetPassword };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Authentication failed');
      }

      const authedUser: AuthUser = {
        id: data.user.id,
        name: data.user.name || 'Valued Member',
        email: data.user.email,
        memberId: `AUR-M-${data.user.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '7721'}`,
        memberTier: 'Founding Sovereign',
        joinedDate: 'August 2026',
        phone: '+91 98450 12345',
        homeCity: 'India',
        preferredCurrency: 'INR',
        avatar:
          data.user.avatar_url ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        travelPreferences: {
          travelStyle: 'Bespoke Heritage & Ultra-Luxury',
          interests: ['Royal Palaces', 'Wildlife Reserves', 'Private Yachting'],
          dietary: 'Gourmet Epicurean',
        },
      };

      performLogin(authedUser, data.token);
    } catch (err: any) {
      console.error('[Auth Form Error]:', err);
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#0D0D0D] border border-neutral-200 dark:border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 my-auto text-neutral-900 dark:text-white transition-colors animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Prompt Banner if booking or action requested */}
        {customMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2.5 font-medium">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{customMessage}</span>
          </div>
        )}

        {/* Logo Badge */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-[#C5A059] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/10">
            {mode === 'forgot' || mode === 'reset' ? <KeyRound className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
            {mode === 'signin' && 'Welcome to Auric Society'}
            {mode === 'signup' && 'Join Auric Society'}
            {mode === 'forgot' && 'Password Recovery'}
            {mode === 'reset' && 'Set Master Key'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-gray-400 mt-1">
            {mode === 'signin' && 'Sign in to access your bespoke itineraries and bookings'}
            {mode === 'signup' && 'Unlock private member rates, dedicated concierge & secret stays'}
            {mode === 'forgot' && 'Enter your registered email to receive private reset instructions'}
            {mode === 'reset' && 'Create a new ultra-secure password for your portfolio'}
          </p>
        </div>

        {/* Form Content */}
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">
              Authenticated as {authenticatedUser?.name || 'Member'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-gray-400">Loading your luxury profile...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-widest text-amber-600 dark:text-[#C5A059] mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus-within:border-amber-500 dark:focus-within:border-[#C5A059]">
                    <User className="w-4 h-4 text-neutral-400 dark:text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Voyager Name"
                      className="w-full bg-transparent text-sm text-neutral-900 dark:text-gray-100 placeholder:text-neutral-400 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-widest text-amber-600 dark:text-[#C5A059] mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus-within:border-amber-500 dark:focus-within:border-[#C5A059]">
                    <Mail className="w-4 h-4 text-neutral-400 dark:text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="member@aurictravels.com"
                      className="w-full bg-transparent text-sm text-neutral-900 dark:text-gray-100 placeholder:text-neutral-400 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {(mode === 'signin' || mode === 'signup') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-mono uppercase font-bold tracking-widest text-amber-600 dark:text-[#C5A059]">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setSuccessMessage(null);
                          setMode('forgot');
                        }}
                        className="text-[11px] text-neutral-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-[#C5A059] transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus-within:border-amber-500 dark:focus-within:border-[#C5A059]">
                    <Lock className="w-4 h-4 text-neutral-400 dark:text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-sm text-neutral-900 dark:text-gray-100 placeholder:text-neutral-400 dark:placeholder:text-gray-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'reset' && (
                <>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold tracking-widest text-amber-600 dark:text-[#C5A059] mb-1">
                      New Password
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus-within:border-amber-500 dark:focus-within:border-[#C5A059]">
                      <Lock className="w-4 h-4 text-neutral-400 dark:text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 chars, uppercase & number"
                        className="w-full bg-transparent text-sm text-neutral-900 dark:text-gray-100 placeholder:text-neutral-400 dark:placeholder:text-gray-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-gray-400">
                          <span>Strength:</span>
                          <span className="font-bold">{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden flex gap-1">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${(strength.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold tracking-widest text-amber-600 dark:text-[#C5A059] mb-1">
                      Confirm New Password
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#050505] border border-neutral-200 dark:border-white/10 focus-within:border-amber-500 dark:focus-within:border-[#C5A059]">
                      <Lock className="w-4 h-4 text-neutral-400 dark:text-gray-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-transparent text-sm text-neutral-900 dark:text-gray-100 placeholder:text-neutral-400 dark:placeholder:text-gray-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Alert Feedback */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                id="auth-submit-button"
                disabled={loading || googleLoading}
                className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-600 dark:bg-gradient-to-r dark:from-[#C5A059] dark:to-[#F3E5AB] text-slate-950 dark:text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'signin' && 'Sign In with Email'}
                      {mode === 'signup' && 'Create Member Account'}
                      {mode === 'forgot' && 'Send Recovery Link'}
                      {mode === 'reset' && 'Update Password'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Google OAuth Option (shown only in signin / signup modes) */}
            {(mode === 'signin' || mode === 'signup') && (
              <>
                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-neutral-200 dark:border-white/10 w-full" />
                  <span className="bg-white dark:bg-[#0D0D0D] px-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold shrink-0">
                    Or
                  </span>
                  <div className="border-t border-neutral-200 dark:border-white/10 w-full" />
                </div>

                <div className="w-full">
                  <button
                    type="button"
                    id="google-signin-button"
                    onClick={handleTriggerGoogle}
                    disabled={loading || googleLoading}
                    className="w-full py-2.5 px-4 rounded-full bg-neutral-50 dark:bg-[#050505] hover:bg-neutral-100 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-amber-500/60 dark:hover:border-[#C5A059]/60 text-neutral-800 dark:text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 text-amber-500 dark:text-[#C5A059] animate-spin" />
                        <span>Redirecting to Google...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Mode Switchers */}
            <div className="text-center pt-2">
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('signup');
                  }}
                  className="text-xs text-neutral-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-[#C5A059] transition-colors"
                >
                  Don't have an Auric profile? Join Society
                </button>
              )}

              {mode === 'signup' && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('signin');
                  }}
                  className="text-xs text-neutral-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-[#C5A059] transition-colors"
                >
                  Already an Auric member? Sign in
                </button>
              )}

              {(mode === 'forgot' || mode === 'reset') && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('signin');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-[#C5A059] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-white/5 flex items-center justify-center gap-2 text-[10px] text-neutral-400 dark:text-gray-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-[#C5A059]" />
          <span>End-to-end encrypted private travel portfolio</span>
        </div>
      </div>
    </div>
  );
};
