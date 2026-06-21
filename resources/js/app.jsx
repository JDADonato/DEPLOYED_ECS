import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import AppErrorBoundary from './Components/common/AppErrorBoundary';
import DefaultLayout from './Layouts/DefaultLayout';
import installAuthHistoryGuard from './utils/authHistoryGuard';

const pages = import.meta.glob('./Pages/**/*.jsx');

installAuthHistoryGuard();

createInertiaApp({
    title: (title) => title ? `${title} - Eloquente Catering` : 'Eloquente Catering System',
    resolve: async (name) => {
        try {
            const page = await pages[`./Pages/${name}.jsx`]();
            // Assign DefaultLayout (which includes FlashToast) to every page
            // unless the page already defines its own layout
            page.default.layout = page.default.layout || ((p) => <DefaultLayout>{p}</DefaultLayout>);
            return page;
        } catch (error) {
            if (
                error.name === 'TypeError' && 
                (error.message.includes('fetch dynamically imported module') || error.message.includes('importing a dynamically imported module') || error.message.includes('Failed to fetch'))
            ) {
                // The chunk was not found, likely due to a new deployment.
                // We force a full page reload to get the new index.html with new chunk hashes.
                window.location.reload();
                // Return a dummy component so React doesn't crash before reloading
                return { default: () => null };
            }
            throw error;
        }
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <AppErrorBoundary auth={props.initialPage?.props?.auth}>
                <App {...props} />
            </AppErrorBoundary>
        );
    },
});
