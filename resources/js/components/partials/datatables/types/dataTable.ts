import { ReactNode } from 'react';

export interface DataTableProviderProps {
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
