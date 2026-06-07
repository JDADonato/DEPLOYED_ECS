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
    const response = await fetch('/api/session/status', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'same-origin',
    });

    if (!response.ok) return { authenticated: false };

    return response.json().catch(() => ({ authenticated: false }));
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
        if (sessionStorage.getItem(LOGGED_OUT_MARKER) === '1') {
            redirectToLogin();
            return;
        }

        if (verifying) return;
        verifying = true;

        try {
            const status = await checkSession().catch(() => ({ authenticated: false }));
            if (!status?.authenticated) {
                sessionStorage.setItem(LOGGED_OUT_MARKER, '1');
                redirectToLogin();
            } else {
                sessionStorage.removeItem(LOGGED_OUT_MARKER);
            }
        } finally {
            verifying = false;
        }
    };

    if (isProtectedPath(window.location.pathname) && sessionStorage.getItem(LOGGED_OUT_MARKER) === '1') {
        redirectToLogin();
        return;
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
