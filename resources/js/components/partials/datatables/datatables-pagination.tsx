import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { UseDataTable } from './dataTables';

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
