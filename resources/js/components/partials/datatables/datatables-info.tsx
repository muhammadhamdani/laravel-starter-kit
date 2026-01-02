import { UseDataTable } from './dataTables';

export const DataTableInfo = () => {
    const { pagination, table }: any = UseDataTable();

    const selectedCount = table.getSelectedRowModel().rows.length;

    return (
        <span className="text-muted-foreground text-sm">
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
            {selectedCount > 0 && ` | ${selectedCount} data selected`}
        </span>
    );
};
