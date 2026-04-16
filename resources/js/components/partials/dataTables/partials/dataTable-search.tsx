import { Input } from '@/components/ui/input';
import { UseDataTable } from '../hooks/useDataTables';

export const DataTableGlobalSearch = () => {
    const { setPagination, globalFilter, setGlobalFilter, table }: any =
        UseDataTable();

    const handleSearch = (value: string) => {
        setGlobalFilter(value);
        setPagination((prev: any) => ({ ...prev, page: 1 }));
        table.resetRowSelection();
    };

    return (
        <Input
            className="w-fit"
            placeholder="Search"
            type="search"
            onChange={(e: any) => handleSearch(e.target.value)}
        />
    );
};
