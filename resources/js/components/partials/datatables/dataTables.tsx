import { Checkbox } from '@/components/ui/checkbox';
import { renderRowAction, renderRowDate, renderRowHeader } from '@/utils/material-table';
import { usePage } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { DataTableButton } from './datatables-button';
import { DataTableInfo } from './datatables-info';
import { DataTablePageSize } from './datatables-pagesize';
import { DataTablePagination } from './datatables-pagination';
import { DataTableGlobalSearch } from './datatables-search';

export const DataTableComponent = ({ buttonActive }: { buttonActive?: any }) => {
    const { columns, table, isLoading }: any = UseDataTable();

    return (
        <div className="flex flex-col space-y-4 p-4 md:p-6">
            <DataTableButton buttonsActive={buttonActive} />
            <div className="flex flex-row items-center justify-between">
                <DataTablePageSize />
                <DataTableGlobalSearch />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header: any) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="relative">
                        {isLoading && (
                            <TableRow className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                                <TableCell>
                                    <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        )}
                        {table.getRowModel().rows?.length && !isLoading ? (
                            table.getRowModel().rows.map((row: any) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell: any) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length && isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <DataTableInfo />
                <DataTablePagination />
            </div>
        </div>
    );
};

export const DataTableContext = createContext({});

export const UseDataTable = () => useContext(DataTableContext);

export const DataTableProvider = ({
    columns = [],
    filterValue,
    setFilterValue,
    withAction = true,
    refreshData,
    setRefreshData,
    selectedData,
    setSelectedData,
    formatData,
    customButton,
    urlFetchData,
    children,
}: DataTableProviderProps) => {
    const { ziggy } = usePage<any>().props;

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [modalImport, setModalImport] = useState(false);

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
            const response = await axios.get(urlFetchData ? route(urlFetchData) : `${ziggy.location}/data`, {
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

    useEffect(() => {
        if (refreshData) {
            fetchData().finally(() => {
                setRefreshData(false); // reset setelah selesai fetch
            });
        }
    }, [refreshData]);

    const initialColumns = useMemo(() => {
        const baseStartColumns = [
            {
                id: 'select',
                header: ({ table }: any) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }: any) => (
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                header: () => (
                    <div className="flex cursor-pointer flex-row items-center justify-between">
                        <span>No</span>
                    </div>
                ),
                accessorKey: 'id',
                cell: (info: any) => (pagination.page - 1) * pagination.perPage + info.row.index + 1,
            },
        ];

        const baseEndColumns = [
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

        // Cek apakah custom columns punya "Action"
        const hasCustomAction = columns.some((col: any) => col.id === 'actions' || col.accessorKey === 'actions');

        // Kolom action default (jika belum ada)
        const defaultActionColumn =
            withAction && !hasCustomAction
                ? {
                      id: 'actions',
                      header: () => <span>Action</span>,
                      cell: (info: any) => renderRowAction(info, fetchData),
                      enableSorting: false,
                      enableHiding: false,
                  }
                : null;

        // Gabungkan baseStart + custom + baseEnd
        const tempColumns = [
            ...baseStartColumns,
            ...columns.filter(
                (c: any) => c.accessorKey !== 'actions' && c.id !== 'actions', // exclude action dulu
            ),
            ...baseEndColumns,
        ];

        // Hilangkan duplikat accessorKey/id (custom replace base)
        const mergedColumns: any[] = [];
        const seen = new Set();

        tempColumns.forEach((col) => {
            const key = col.accessorKey || col.id;
            if (!seen.has(key)) {
                seen.add(key);
                mergedColumns.push(col);
            } else {
                const idx = mergedColumns.findIndex((c) => (c.accessorKey || c.id) === key);
                mergedColumns[idx] = col; // replace existing
            }
        });

        // Tambahkan kolom Action di paling akhir (custom jika ada, default jika tidak)
        if (hasCustomAction) {
            const customAction = columns.find((c: any) => c.accessorKey === 'actions' || c.id === 'actions');
            mergedColumns.push(customAction);
        } else if (defaultActionColumn) {
            mergedColumns.push(defaultActionColumn);
        }

        return mergedColumns;
    }, [columns, withAction, pagination]);

    const table = useReactTable({
        data,
        columns: initialColumns,
        pageCount: Math.ceil(pagination.total / pagination.perPage),
        state: {
            pagination: {
                pageIndex: pagination.page - 1,
                pageSize: pagination.perPage,
            },
            globalFilter,
            sorting,
        },
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: (updater: any) => {
            const newState =
                typeof updater === 'function'
                    ? updater({
                          pageIndex: pagination.page - 1,
                          pageSize: pagination.perPage,
                      })
                    : updater;

            setPagination((prev) => ({
                ...prev,
                page: newState.pageIndex + 1,
                perPage: newState.pageSize,
            }));
        },
    });

    const selectedRows = useMemo(
        () => table.getSelectedRowModel().rows.map((row: any) => row.original),
        [table.getSelectedRowModel()], // dependency
    );

    useEffect(() => {
        setSelectedData?.(selectedRows);
    }, [selectedRows]);

    const contextValue = {
        columns: initialColumns,
        table,
        isLoading,
        selectedRows,
        pagination,
        setPagination,
        globalFilter,
        setGlobalFilter,
        sorting,
        setSorting,
        fetchData,
        formatData,
        modalImport,
        setModalImport,
        refreshData,
        setRefreshData,
        selectedData,
        setSelectedData,
        customButton,
    };
    return <DataTableContext.Provider value={contextValue}>{children}</DataTableContext.Provider>;
};

interface DataTableProviderProps {
    columns: any;
    filterValue?: any;
    setFilterValue?: any;
    withAction?: boolean;
    refreshData?: boolean;
    setRefreshData?: any;
    selectedData?: any;
    setSelectedData?: any;
    formatData?: any;
    customButton?: any;
    urlFetchData?: string;
    children: ReactNode;
}
