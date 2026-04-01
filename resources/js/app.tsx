import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title ? title + ' - ' : ''}${appName}`,
    resolve: (name: string) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')) as unknown as ComponentType<any>,
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);

        // Initialize light/dark theme after root render
        initializeTheme();
    },
    progress: {
        color: '#4B5563',
    },
});
