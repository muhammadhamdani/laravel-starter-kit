import { RoleForm } from '@/components/forms/core/role-form';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { role } = usePage<any>().props;

    return (
        <AppLayout>
            <Head title="Role Edit" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="relative min-h-screen flex-1 flex-col space-y-8 overflow-hidden rounded-xl border border-sidebar-border/70 py-4 md:min-h-min md:py-6 dark:border-sidebar-border">
                    <div className="px-4 md:px-6">
                        <RoleForm dataId={role.id} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
