import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { UseDataTable } from './dataTables';

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
