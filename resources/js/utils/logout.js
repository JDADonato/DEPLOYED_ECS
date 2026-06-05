import { router } from '@inertiajs/react';
import { clearSensitiveAuthState } from './smartResource';

export const logoutWithCleanup = (options = {}) => {
    clearSensitiveAuthState();
    router.post('/logout', {}, options);
};

export default logoutWithCleanup;
