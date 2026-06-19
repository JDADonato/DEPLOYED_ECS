/**
 * Get the XSRF token from cookie (set by Laravel automatically).
 */
const getXsrfToken = () => {
    const match = document.cookie.split(';').find(c => c.trim().startsWith('XSRF-TOKEN='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
};

export const csrfRequestHeaders = (headers = {}) => {
    const xsrf = getXsrfToken();
    return {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
        ...headers,
    };
};

export const csrfFetch = async (url, options = {}) => {
    const makeRequest = () => fetch(url, {
        ...options,
        credentials: options.credentials || 'same-origin',
        headers: csrfRequestHeaders(options.headers || {}),
    });

    let response = await makeRequest();

    // If CSRF token expired (419), try refreshing it once
    if (response.status === 419 && !options._retry) {
        options._retry = true;
        // Fetch a new CSRF token
        await fetch('/session/csrf-token', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
        });
        
        // Retry the original request
        response = await makeRequest();
    }

    return response;
};

export default csrfFetch;
