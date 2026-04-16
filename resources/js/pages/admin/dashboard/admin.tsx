import { Card } from '@/components/ui/card';
import { Head, usePage } from '@inertiajs/react';
import { ListIcon, Users } from 'lucide-react';
import { Fragment } from 'react';

export default function Dashboard() {
    return (
        <Fragment>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <StatCounter />
            </div>
        </Fragment>
    );
}

export const StatCounter = () => {
    const { summaries } = usePage<any>().props;

    const stats = [
        {
            title: 'Total Permissions',
            value: summaries.total_permissions ?? 0,
            icon: <ListIcon className="h-4 w-4 text-blue-600" />,
            bg: 'bg-blue-100',
            text: 'text-blue-700',
        },
        {
            title: 'Total Roles',
            value: summaries.total_roles ?? 0,
            icon: <ListIcon className="h-4 w-4 text-blue-600" />,
            bg: 'bg-blue-100',
            text: 'text-blue-700',
        },
        {
            title: 'Total Users',
            value: summaries.total_users ?? 0,
            icon: <Users className="h-4 w-4 text-blue-600" />,
            bg: 'bg-blue-100',
            text: 'text-blue-700',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, i) => (
                <Card
                    key={i}
                    className="rounded-xl border border-neutral-200 p-3 shadow-sm dark:border-neutral-800"
                >
                    <div className="flex items-center gap-3">
                        {/* Icon Circle */}
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg}`}
                        >
                            {item.icon}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                                {item.title}
                            </span>
                            <span
                                className={`text-lg font-semibold ${item.text}`}
                            >
                                {item.value}
                            </span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
