import { UserForm } from '@/components/forms/core/user-form';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function CreatePage() {
    return (
        <AppLayout>
            <Head title="User Create" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="relative min-h-screen flex-1 flex-col space-y-8 overflow-hidden rounded-xl border border-sidebar-border/70 py-4 md:min-h-min md:py-6 dark:border-sidebar-border">
                    <div className="px-4 md:px-6">
                        <UserForm />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
