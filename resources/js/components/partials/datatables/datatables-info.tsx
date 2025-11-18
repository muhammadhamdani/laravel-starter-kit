import { UseDataTable } from './dataTables';

export const DataTableInfo = () => {
    const { pagination }: any = UseDataTable();

    return (
        <span>
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
        </span>
    );
};
