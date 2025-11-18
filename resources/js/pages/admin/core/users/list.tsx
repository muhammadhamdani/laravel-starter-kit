import { DataTableComponent, DataTableProvider } from '@/components/partials/dataTables';
import AppLayout from '@/layouts/app-layout';
import {
    renderRowAction,
    renderRowCellCheckbox,
    renderRowDate,
    renderRowHeader,
    renderRowHeaderCheckbox,
    renderRowStatus,
} from '@/utils/material-table';
import { Head } from '@inertiajs/react';
import { SortingState } from '@tanstack/react-table';
import axios from 'axios';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function ListPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filterValue, setFilterValue] = useState();

    const savedPageSize = localStorage.getItem('pageSize');

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: savedPageSize && !isNaN(parseInt(savedPageSize)) ? parseInt(savedPageSize) : 10,
        total: 0,
        from: 0,
        to: 0,
    });

    const fetchData = useCallback(async () => {
        if (isLoading) return; // mencegah loop saat sudah loading

        setIsLoading(true);
        try {
            const response = await axios.get(route('users.data'), {
                params: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    globalSearch: globalFilter,
                    orderDirection: sorting[0]?.desc ? 'desc' : 'asc',
                    orderBy: sorting[0]?.id ?? 'id',
                    filterValue: filterValue,
                },
            });

            setData(response.data.data);
            setPagination({
                ...pagination,
                perPage: response.data.per_page,
                page: response.data.current_page,
                total: response.data.total,
                from: response.data.from,
                to: response.data.to,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.perPage, globalFilter, sorting, filterValue]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            {
                header: (info: any) => renderRowHeaderCheckbox(info),
                cell: (info: any) => renderRowCellCheckbox(info),
                accessorKey: 'select',
            },
            {
                header: (info: any) => 'No',
                accessorKey: 'id',
                cell: (info: any) => (pagination.page - 1) * pagination.perPage + info.row.index + 1,
            },
            {
                header: (info: any) => renderRowHeader(info, 'Name'),
                accessorKey: 'name',
            },
            {
                header: (info: any) => renderRowHeader(info, 'Email'),
                accessorKey: 'email',
            },
            {
                header: (info: any) => renderRowHeader(info, 'Status'),
                accessorKey: 'email_verified_at',
                cell: (info: any) => renderRowStatus(info.getValue()),
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
            {
                header: (info: any) => 'Action',
                accessorKey: 'actions',
                cell: (info: any) => renderRowAction(info, fetchData),
            },
        ],
        [pagination.page, pagination.perPage, globalFilter, sorting],
    );

    const buttonItems = ['copy', 'create', 'validate', 'reload'];

    const formatDataExport = (data: any) => {
        return data.map((item: any, i: number) => ({
            No: i + 1,
            Name: item.name,
            Email: item.email,
            Role: item.roles[0].name,
            'Created At': moment(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
            'Updated At': moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        }));
    };

    return (
        <AppLayout>
            <Head title="Permissions List" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex min-h-[100vh] flex-1 flex-col space-y-4 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTableProvider
                        columns={columns}
                        data={data}
                        pagination={pagination}
                        setPagination={setPagination}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        sorting={sorting}
                        setSorting={setSorting}
                        buttonItems={buttonItems}
                        fetchData={fetchData}
                        isLoading={isLoading}
                        formatDataExport={formatDataExport}
                    >
                        <DataTableComponent />
                    </DataTableProvider>
                </div>
            </div>
        </AppLayout>
    );
}
