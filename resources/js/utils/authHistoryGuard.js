import { clearSensitiveAuthState } from './smartResource';

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

    const verifyProtectedPage = async () => {
        if (!isProtectedPath(window.location.pathname)) return;

        const status = await checkSession().catch(() => ({ authenticated: false }));
        if (!status?.authenticated) {
            clearSensitiveAuthState();
            window.location.replace('/login');
        }
    };

    window.addEventListener('pageshow', (event) => {
        if (event.persisted || isProtectedPath(window.location.pathname)) {
            verifyProtectedPage();
        }
    });
};

export default installAuthHistoryGuard;
