import { DataTableComponent, DataTableProvider } from '@/components/partials/datatables/dataTables';
import AppLayout from '@/layouts/app-layout';
import { renderRowHeader } from '@/utils/material-table';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function VillageList() {
    const [filterValue, setFilterValue] = useState();
    const [refreshData, setRefreshData] = useState(false);

    const columns = [
        {
            header: (info: any) => renderRowHeader(info, 'Name'),
            accessorKey: 'name',
        },
        {
            header: (info: any) => renderRowHeader(info, 'District'),
            accessorKey: 'district.name',
        },
    ];

    return (
        <AppLayout>
            <Head title="Village List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex min-h-screen flex-1 flex-col space-y-4 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTableProvider
                        columns={columns}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                    >
                        <DataTableComponent buttonActive={{ import: false, export: false, bulkaction: false }} />
                    </DataTableProvider>
                </div>
            </div>
        </AppLayout>
    );
}
