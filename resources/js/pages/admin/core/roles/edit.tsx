import { RoleForm } from '@/components/forms/admin/core/role-form';
import { usePage } from '@inertiajs/react';

export default function EditPage() {
    const { role } = usePage<any>().props;

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-screen flex-1 flex-col space-y-8 overflow-hidden rounded-xl border py-4 md:min-h-min md:py-6">
                <div className="px-4 md:px-6">
                    <RoleForm dataId={role.id} />
                </div>
            </div>
        </div>
    );
}
