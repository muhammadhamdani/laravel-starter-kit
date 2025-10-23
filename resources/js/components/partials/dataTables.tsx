import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import axios from 'axios';
import {
    CheckIcon,
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CopyIcon,
    Loader2,
    PlusIcon,
    RefreshCwIcon,
} from 'lucide-react';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export const DataTableContext = createContext({});

export const UseDataTable = () => useContext(DataTableContext);

interface DataTableProviderProps {
    data?: any;
    isLoading?: boolean;
    columns?: any;
    pagination: any;
    setPagination: any;
    globalFilter: any;
    setGlobalFilter: any;
    sorting: any;
    setSorting: any;
    fetchData?: any;
    buttonItems?: any;
    formatDataExport?: any;
    children: ReactNode;
}

export const DataTableProvider = ({
    data,
    columns,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    isLoading,
    buttonItems = [],
    fetchData,
    formatDataExport,
    children,
}: DataTableProviderProps) => {
    const table = useReactTable({
        data,
        columns,
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

            setPagination((prev: any) => ({
                ...prev,
                page: newState.pageIndex + 1,
                perPage: newState.pageSize,
            }));
        },
    });

    const contextValue = {
        isLoading,
        table,
        columns,
        pagination,
        setPagination,
        globalFilter,
        setGlobalFilter,
        sorting,
        setSorting,
        buttonItems,
        fetchData,
        formatDataExport,
    };

    return <DataTableContext.Provider value={contextValue}>{children}</DataTableContext.Provider>;
};

export const DataTableComponent = () => {
    const { table, isLoading, columns }: any = UseDataTable();

    return (
        <section className="flex flex-col space-y-8 p-4 md:space-y-6 md:p-6">
            <DataTableButton />
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
        </section>
    );
};

export const DataTableButton = () => {
    const { fetchData, buttonItems, table, formatDataExport }: any = UseDataTable();

    const { url } = usePage<SharedData>();

    const handleCopyButton = () => {
        const selectedRows = formatDataExport(table.getSelectedRowModel().rows.map((row: any) => row.original));

        if (selectedRows.length === 0) {
            toast.error('Tidak ada data yang dipilih');
            return;
        }

        const headers = Object.keys(selectedRows[0] ?? {});
        const textToCopy = [headers.join('\t'), ...selectedRows.map((row: any) => headers.map((key) => row[key]).join('\t'))].join('\n');

        navigator.clipboard
            .writeText(textToCopy)
            .then(() => toast.success('Data berhasil disalin'))
            .catch(() => toast.error('Gagal menyalin data'));
    };

    const handleVerifyButton = async () => {
        const selectedRows = table.getSelectedRowModel().rows.map((row: any) => row.original.id);

        if (selectedRows.length === 0) {
            toast.error('Tidak ada data yang dipilih');
            return;
        }

        await axios
            .post(`${url}/verify`, { ids: selectedRows })
            .then(() => {
                toast.success('Data berhasil diverifikasi');
                fetchData();
            })
            .finally(() => {
                table.resetRowSelection();
            });
    };

    const initialButtons = useMemo(
        () => [
            {
                key: 'copy',
                label: 'Copy',
                icon: <CopyIcon className="mr-1 h-4 w-4" />,
                onClick: handleCopyButton,
            },
            {
                key: 'create',
                label: 'Create',
                icon: <PlusIcon className="mr-1 h-4 w-4" />,
                onClick: () => router.visit(`${url}/create`),
            },
            {
                key: 'validate',
                label: 'Validate',
                icon: <CheckIcon className="mr-1 h-4 w-4" />,
                onClick: () => handleVerifyButton(),
            },
            {
                key: 'reload',
                label: 'Reload',
                icon: <RefreshCwIcon className="mr-1 h-4 w-4" />,
                onClick: fetchData,
            },
        ],
        [buttonItems, fetchData, handleCopyButton],
    );

    const filteredButtons = initialButtons.filter((btn: any) => buttonItems.includes(btn.key));

    return (
        <div className="inline-flex">
            {filteredButtons.map((btn: any, idx: number) => {
                const isFirst = idx === 0;
                const isLast = idx === filteredButtons.length - 1;

                let roundedClass = 'rounded-none'; // default untuk tengah

                if (isFirst) roundedClass = 'rounded-l-md rounded-r-none';
                if (isLast) roundedClass = 'rounded-r-md rounded-l-none';

                return (
                    <Button key={btn.key} onClick={btn.onClick} className={`flex items-center ${roundedClass}`}>
                        {btn.icon}
                        {btn.label}
                    </Button>
                );
            })}
        </div>
    );
};

export const DataTableGlobalSearch = () => {
    const { setPagination, globalFilter, setGlobalFilter }: any = UseDataTable();

    const handleGlobalSearchChange = (value: any) => {
        setPagination((prev: any) => ({ ...prev, page: 1 }));
        setGlobalFilter(value);
    };

    return <Input className="w-fit" placeholder="Search" value={globalFilter} onChange={(e) => handleGlobalSearchChange(e.target.value)} />;
};

export const DataTablePageSize = () => {
    const [pageSizeOptions, setPageSizeOptions] = useState([10, 25, 50, 100, 250, 500]);

    const { pagination, setPagination }: any = UseDataTable();

    const handlePageSizeChange = (value: any) => {
        localStorage.setItem('pageSize', value);
        setPagination({
            ...pagination,
            page: 1,
            perPage: parseInt(value),
        });
    };

    return (
        <div className="flex flex-row items-center">
            <Select defaultValue={pagination?.perPage?.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder={pagination?.perPage?.toString()} />
                </SelectTrigger>
                <SelectContent>
                    {pageSizeOptions.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export const DataTableInfo = () => {
    const { pagination }: any = UseDataTable();

    return (
        <span>
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
        </span>
    );
};

export const DataTablePagination = () => {
    const { pagination, setPagination, isLoading }: any = UseDataTable();

    return (
        <div className="flex flex-row items-center space-x-2">
            <button
                type="button"
                onClick={() => setPagination((prev: any) => ({ ...prev, page: 1 }))}
                disabled={pagination.page === 1 || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronFirstIcon className="h-6 w-6" />
            </button>
            <button
                type="button"
                onClick={() => setPagination((prev: any) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                disabled={pagination.page === 1 || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
                type="button"
                onClick={() =>
                    setPagination((prev: any) => ({
                        ...prev,
                        page: Math.min(prev.page + 1, Math.ceil(pagination.total / pagination.perPage)),
                    }))
                }
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage) || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronRightIcon className="h-6 w-6" />
            </button>
            <button
                type="button"
                onClick={() =>
                    setPagination((prev: any) => ({
                        ...prev,
                        page: Math.ceil(pagination.total / pagination.perPage),
                    }))
                }
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage) || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronLastIcon className="h-6 w-6" />
            </button>
        </div>
    );
};
