import { DataTableComponent } from '@/components/partials/dataTables';
import { DataTableProvider } from '@/components/partials/dataTables/hooks/useDataTables';
import {
    renderRowDate,
    renderRowHeader,
} from '@/components/partials/dataTables/utils/dataTable-utils';
import { InputSelectComponent } from '@/components/partials/input-component';
import { Badge } from '@/components/ui/badge';
import users from '@/routes/admin/core/users';
import { router, usePage } from '@inertiajs/react';
import { BadgeCheckIcon, BadgeXIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

export default function ListPage() {
    const { roles } = usePage<any>().props;

    const [refreshData, setRefreshData] = useState(false);
    const [filterValue, setFilterValue] = useState<any>({});

    const columns = [
        {
            header: (info: any) => renderRowHeader(info, 'Name'),
            accessorKey: 'name',
        },
        {
            header: (info: any) => renderRowHeader(info, 'Email'),
            accessorKey: 'email',
        },
        {
            header: (info: any) => renderRowHeader(info, 'Roles'),
            accessorKey: 'roles',
            accessorFn: (row: any) =>
                row.roles.map((item: any) => item.name).join(', '),
        },
        {
            header: (info: any) => renderRowHeader(info, 'Verified'),
            accessorKey: 'email_verified_at',
            cell: (info: any) => renderRowVerify(info),
        },
        {
            header: (info: any) => renderRowHeader(info, 'Created At'),
            accessorKey: 'created_at',
            cell: (info: any) => renderRowDate(info.getValue()),
        },
        {
            header: (info: any) => renderRowHeader(info, 'Updated At'),
            accessorKey: 'updated_at',
            cell: (info: any) => renderRowDate(info.getValue()),
        },
    ];

    const renderRowVerify = (info: any) => {
        const handleVerify = (id: number) => {
            router.put(
                users.verify(id).url,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setRefreshData(true);
                        router.reload({ only: ['flash'] });
                    },
                },
            );
        };

        return info.getValue() ? (
            <Badge
                className="bg-blue-500 text-white dark:bg-blue-600"
                variant="default"
                color="success"
            >
                <BadgeCheckIcon />
                Verified
            </Badge>
        ) : (
            <Badge
                className="cursor-pointer"
                onClick={() => handleVerify(info.row.original.id)}
                variant="destructive"
                color="danger"
            >
                <BadgeXIcon />
                Not Verified
            </Badge>
        );
    };

    const formatDataExport = (data: any) => {
        return data.map((item: any, i: number) => ({
            No: i + 1,
            Name: item.name,
            'Created At': moment(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
            'Updated At': moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        }));
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <DataTableProvider
                    columns={columns}
                    filterValue={filterValue}
                    refreshData={refreshData}
                    setRefreshData={setRefreshData}
                    urlFetchData={users.data().url}
                    formatDataExport={formatDataExport}
                >
                    <div className="flex flex-col space-y-4 px-4 pt-8 md:px-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <InputSelectComponent
                                label="Roles"
                                placeholder="Filter by Roles..."
                                data={roles?.map((item: any) => ({
                                    value: item.id.toString(),
                                    label: item.name,
                                }))}
                                dataSelected={filterValue.roles}
                                handleOnChange={(value: any) =>
                                    setFilterValue((prev: any) => ({
                                        ...prev,
                                        roles: value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <DataTableComponent buttonActive={{ export: false }} />
                </DataTableProvider>
            </div>
        </div>
    );
}
