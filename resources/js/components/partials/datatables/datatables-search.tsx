import { Input } from '@/components/ui/input';
import { UseDataTable } from './dataTables';

export const DataTableGlobalSearch = () => {
    const { setPagination, globalFilter, setGlobalFilter, table }: any = UseDataTable();

    const handleGlobalSearchChange = (value: any) => {
        setPagination((prev: any) => ({ ...prev, page: 1 }));
        setGlobalFilter(value);
        table.resetRowSelection();
    };

    return <Input className="w-fit" placeholder="Search" value={globalFilter} onChange={(e: any) => handleGlobalSearchChange(e.target.value)} />;
};
