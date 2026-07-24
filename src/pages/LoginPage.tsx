import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const concertBackground =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCdFj3e5duycbvqULmdKb3TMG3K3VWlIshoylDyteXtp6NZ6Y6B4CYGdkJRYAtMy6cnh8gPXyBMD-Iz2OAsm9itWtRNnMAk6_Ai4WcQn3LST6fDIuSQ9Qg2Epi6mi6Tep1c6sGvyto70WJPuTZT5353sUJ9-5y_CXVo-yYzf1maX5sqWayv5yIO4ogwxxk5M_LM256Ty71b5UTXyo9B30NDfEa67eZcXWacZ0XvX2LO8wMHZnH38RG7';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

const filledIconStyle = { fontVariationSettings: "'FILL' 1" } as React.CSSProperties;

const LoginPage: React.FC = () => {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const returnPath = state?.from?.pathname || '/';

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = isSignUp ? 'Auralis - Sign Up' : 'Auralis - Login';

    return () => {
      document.title = 'Auralis Music';
    };
  }, [isSignUp]);

  if (isAuthenticated) {
    return <Navigate to={returnPath} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const username = email.trim();
      if (isSignUp) {
        if (!name.trim()) {
          setError('Name is required');
          setIsSubmitting(false);
          return;
        }
        await register(name.trim(), username, password);
      } else {
        await login(username, password);
      }
      navigate(returnPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg px-container-margin-mobile py-2xl text-on-surface">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${concertBackground})` }}
      >
        <div className="absolute inset-0 bg-brand-bg/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg/40 to-brand-bg" />
      </div>

      <section className="animate-login-fade-in relative z-10 w-full max-w-[560px]">
        <div className="flex flex-col gap-lg rounded-[18px] border border-on-surface/10 bg-surface/70 p-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-[40px]">
          <div className="mb-sm flex flex-col items-center text-center">
            <div className="mb-lg flex flex-col items-center gap-sm">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-primary-container/80">
                <div className="absolute inset-1 rounded-full border border-secondary/70 border-l-transparent border-t-primary" />
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-on-surface/15 bg-surface-container-high shadow-lg">
                  <span
                    className="material-symbols-outlined text-[30px] text-on-surface"
                    style={filledIconStyle}
                  >
                    play_arrow
                  </span>
                </div>
              </div>
              <Link
                to="/"
                className="font-headline-md text-headline-md text-primary no-underline"
              >
                Auralis
              </Link>
            </div>

            <h1 className="mb-xs font-headline-lg text-headline-lg text-on-surface">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isSignUp ? 'Join Auralis to start your musical journey.' : 'Sign in to continue your musical journey.'}
            </p>
          </div>

          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <label className="sr-only" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-[20px] text-outline">
                    person
                  </span>
                  <input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="block w-full rounded-lg border border-on-surface/10 bg-white py-[13px] pl-[48px] pr-md font-body-md text-body-md text-inverse-on-surface transition-all placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/25"
                    placeholder="Full Name"
                    required={isSignUp}
                    type="text"
                    autoComplete="name"
                  />
                </div>
              </>
            )}

            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-[20px] text-outline">
                mail
              </span>
              <input
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block w-full rounded-lg border border-on-surface/10 bg-white py-[13px] pl-[48px] pr-md font-body-md text-body-md text-inverse-on-surface transition-all placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/25"
                placeholder="Username or Email"
                required
                type="text"
                autoComplete="username"
              />
            </div>

            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-[20px] text-outline">
                lock
              </span>
              <input
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-lg border border-on-surface/10 bg-white py-[13px] pl-[48px] pr-md font-body-md text-body-md text-inverse-on-surface transition-all placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/25"
                placeholder="Password"
                required
                type="password"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between py-xs">
              <label
                className="flex cursor-pointer items-center gap-sm font-label-sm text-label-sm text-on-surface"
                htmlFor="remember-me"
              >
                <input
                  id="remember-me"
                  name="remember-me"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-on-surface/20 bg-brand-surface text-primary-container focus:ring-primary-container"
                  type="checkbox"
                />
                Remember me
              </label>

              <button
                type="button"
                className="font-label-sm text-label-sm text-primary transition-colors hover:text-primary-fixed"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="rounded-lg border border-error/30 bg-error-container/40 px-md py-sm font-label-sm text-label-sm text-on-error-container">
                {error}
              </p>
            )}

            <button
              className="mt-sm flex w-full justify-center rounded-[16px] bg-primary-container px-md py-[14px] font-label-md text-label-md text-on-primary-container transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-on-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="relative flex items-center py-sm">
            <div className="flex-grow border-t border-on-surface/10" />
            <span className="mx-md flex-shrink-0 font-label-sm text-label-sm text-outline">
              Or continue with
            </span>
            <div className="flex-grow border-t border-on-surface/10" />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <button
              className="flex items-center justify-center gap-sm rounded-full border border-on-surface/10 bg-on-surface/5 px-md py-[12px] font-label-md text-label-md text-on-surface transition-all hover:-translate-y-0.5 hover:bg-on-surface/10"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              Google
            </button>
            <button
              className="flex items-center justify-center gap-sm rounded-full border border-on-surface/10 bg-on-surface/5 px-md py-[12px] font-label-md text-label-md text-on-surface transition-all hover:-translate-y-0.5 hover:bg-on-surface/10"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">apps</span>
              Apple
            </button>
          </div>

          <p className="mt-sm text-center font-body-md text-body-md text-on-surface-variant">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="ml-xs font-label-md text-label-md text-primary transition-colors hover:text-primary-fixed"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
