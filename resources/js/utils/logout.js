import { router } from '@inertiajs/react';
import { clearSensitiveAuthState } from './smartResource';

const LOGGED_OUT_MARKER = 'ecs:auth:logged-out';

export const logoutWithCleanup = (options = {}) => {
    clearSensitiveAuthState();
    sessionStorage.setItem(LOGGED_OUT_MARKER, '1');

    router.post('/logout', {}, {
        replace: true,
        preserveScroll: false,
        ...options,
        onSuccess: (...args) => {
            options.onSuccess?.(...args);
            window.location.replace('/login');
        },
    });
};

export default logoutWithCleanup;
