import { usePage, router } from '@inertiajs/react';
import logoutWithCleanup from '../utils/logout';

const LOGGED_OUT_MARKER = 'ecs:auth:logged-out';

export const useAuth = () => {
    const { auth } = usePage().props;
    const user = auth?.user || null;

    const login = async (username, password, remember = false) => {
        return new Promise((resolve, reject) => {
            sessionStorage.removeItem(LOGGED_OUT_MARKER);

            router.post('/login', { username, password, remember }, {
                onSuccess: () => resolve({ success: true }),
                onError: (errors) => {
                    if (errors.reactivation_required) {
                        resolve({ success: false, requires_reactivation: true, message: errors.reactivation_required });
                        return;
                    }
                    const msg = errors.username || errors.password || 'The username or password is incorrect.';
                    resolve({ success: false, message: msg });
                },
                onFinish: () => {},
                // Prevent Inertia from preserving scroll on login redirect
                preserveScroll: false,
            });
        });
    };

    const reactivate = async (username, password, remember = false) => {
        return new Promise((resolve, reject) => {
            sessionStorage.removeItem(LOGGED_OUT_MARKER);
            router.post('/reactivate-account', { username, password, remember }, {
                onSuccess: () => resolve({ success: true }),
                onError: (errors) => {
                    const msg = errors.username || errors.password || 'Failed to reactivate account.';
                    resolve({ success: false, message: msg });
                },
                preserveScroll: false,
            });
        });
    };

    const logout = () => {
        logoutWithCleanup();
    };

    const loading = false;

    return { user, login, reactivate, logout, loading };
};

// Default export for compatibility with `import { AuthProvider } from ...`
export const AuthProvider = ({ children }) => children;
