import { clearSensitiveAuthState } from './smartResource';

const LOGGED_OUT_MARKER = 'ecs:auth:logged-out';

const protectedPathPrefixes = [
    '/dashboard/admin',
    '/dashboard/marketing',
    '/dashboard/accounting',
    '/dashboard/client',
    '/profile',
    '/preview/menu',
    '/preview/packages',
];

const isProtectedPath = (path) => protectedPathPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

const checkSession = async () => {
    try {
        const response = await fetch('/api/session/status', {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
            credentials: 'same-origin',
        });

        if (response.status === 401 || response.status === 403) {
            return { authenticated: false, confirmed: true };
        }

        if (!response.ok) {
            return { authenticated: true, error: true }; // Assume authenticated on random 500s/network errors to avoid kicking users out
        }

        return await response.json().catch(() => ({ authenticated: true, error: true }));
    } catch (e) {
        // Network error (e.g., server restarting, offline)
        return { authenticated: true, error: true }; 
    }
};

export const installAuthHistoryGuard = () => {
    if (typeof window === 'undefined' || window.__ecsAuthHistoryGuardInstalled) return;

    window.__ecsAuthHistoryGuardInstalled = true;
    let verifying = false;

    const redirectToLogin = () => {
        clearSensitiveAuthState();
        window.location.replace('/login');
    };

    const verifyProtectedPage = async () => {
        if (!isProtectedPath(window.location.pathname)) return;

        if (verifying) return;
        verifying = true;

        try {
            const status = await checkSession();
            if (status && status.confirmed && !status.authenticated) {
                sessionStorage.setItem(LOGGED_OUT_MARKER, '1');
                redirectToLogin();
            } else if (status && status.authenticated) {
                sessionStorage.removeItem(LOGGED_OUT_MARKER);
            }
        } finally {
            verifying = false;
        }
    };

    if (isProtectedPath(window.location.pathname) && sessionStorage.getItem(LOGGED_OUT_MARKER) === '1') {
        // Instead of blindly redirecting, verify the session first
        // as the user might have logged in via another tab or the marker wasn't cleared.
        checkSession().then((status) => {
            if (!status?.authenticated) {
                redirectToLogin();
            } else {
                sessionStorage.removeItem(LOGGED_OUT_MARKER);
            }
        });
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted || isProtectedPath(window.location.pathname)) {
            verifyProtectedPage();
        }
    });
    window.addEventListener('popstate', verifyProtectedPage);
    window.addEventListener('focus', verifyProtectedPage);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            verifyProtectedPage();
        }
    });
};

export default installAuthHistoryGuard;
