import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type PropsWithChildren } from 'react';
import { toast, Toaster } from 'sonner';

export default function AppHeaderLayout({ children }: PropsWithChildren) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success);
        }

        if (flash?.error) {
            toast.error(flash?.error);
        }
    }, [flash?.success, flash?.error]);

    return (
        <AppShell>
            <AppHeader />
            <AppContent>
                {children}
                <Toaster position="top-right" richColors />
            </AppContent>
        </AppShell>
    );
}
