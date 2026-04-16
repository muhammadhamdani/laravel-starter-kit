import { usePage } from '@inertiajs/react';
import moment from 'moment-timezone';

export default function DetailPage() {
    const { regency } = usePage<any>().props;

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold">
                            Name
                        </label>
                        <p className="text-sm">{regency.name}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold">
                            Province
                        </label>
                        <p className="text-sm">{regency.province.name}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold">
                            Created At
                        </label>
                        <p className="text-sm">
                            {moment(regency.created_at)
                                .tz('Asia/Jakarta')
                                .format('DD MMMM YYYY')}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold">
                            Updated At
                        </label>
                        <p className="text-sm">
                            {moment(regency.updated_at)
                                .tz('Asia/Jakarta')
                                .format('DD MMMM YYYY')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
