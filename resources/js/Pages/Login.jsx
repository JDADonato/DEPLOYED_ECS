import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell from '../Components/auth/AuthShell';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, reactivate } = useAuth();

    const [requiresReactivation, setRequiresReactivation] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(username, password, rememberMe);

            if (!result.success) {
                if (result.requires_reactivation) {
                    setRequiresReactivation(true);
                    setError('');
                } else {
                    setError(result.message);
                }
                setLoading(false);
            }
        } catch (err) {
            setError('We could not sign you in. Please try again.');
            setLoading(false);
        }
    };

    const handleReactivate = async () => {
        setLoading(true);
        try {
            const result = await reactivate(username, password, rememberMe);
            if (!result.success) {
                setError(result.message);
                setRequiresReactivation(false);
            }
        } catch (err) {
            setError('We could not reactivate your account.');
            setRequiresReactivation(false);
        }
        setLoading(false);
    };

    return (
        <AuthShell
            mode="login"
            compact
            simple
            brandTitle="Welcome back."
            brandCopy="Continue managing your event details, messages, and payments."
            title="Sign in"
            subtitle="Use your account details to continue."
            features={[]}
            footer={(
                <p className="text-sm text-slate-500">
                    Do not have an account?{' '}
                    <Link href="/register" prefetch="mount" className="font-bold text-red-900 transition hover:text-amber-700 hover:underline underline-offset-4">
                        Create one
                    </Link>
                </p>
            )}
        >
            <form className="auth-login-form space-y-3.5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username" className="auth-label">Username</label>
                    <div className="auth-field auth-field-compact">
                        <input
                            id="username"
                            type="text"
                            required
                            className="auth-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="auth-label">Password</label>
                    <div className="auth-field auth-field-compact">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="auth-input pr-11"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="auth-login-options flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-red-900 focus:ring-red-900"
                        />
                        <span className="text-xs font-medium text-slate-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-xs font-bold text-red-900 transition hover:text-amber-700 hover:underline underline-offset-4">
                        Forgot password?
                    </Link>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit auth-submit-compact"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing in...
                        </span>
                    ) : 'Sign in'}
                </button>
            </form>

            {requiresReactivation && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                            <span className="text-xl font-bold text-amber-700">!</span>
                        </div>
                        <h3 className="mb-2 text-xl font-black text-slate-900">Reactivate Account?</h3>
                        <p className="mb-6 text-sm text-slate-600 font-medium">
                            You previously deactivated this account. Do you want to reactivate it and log in?
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setRequiresReactivation(false)}
                                disabled={loading}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleReactivate}
                                disabled={loading}
                                className="w-full rounded-xl bg-amber-600 py-3 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Reactivate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthShell>
    );
};

export default Login;
