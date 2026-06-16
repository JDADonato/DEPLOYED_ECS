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

export const csrfFetch = (url, options = {}) => fetch(url, {
    ...options,
    credentials: options.credentials || 'same-origin',
    headers: csrfRequestHeaders(options.headers || {}),
});

export default csrfFetch;
