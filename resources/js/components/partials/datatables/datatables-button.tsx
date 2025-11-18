import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import saveAs from 'file-saver';
import { CopyIcon, DownloadIcon, Pickaxe, PlusIcon, RefreshCwIcon, UploadIcon } from 'lucide-react';
import { createElement } from 'react';
import { toast } from 'sonner';
import { UseDataTable } from './dataTables';

export const DataTableButton = ({ buttonsActive = {} }: { buttonsActive?: { [key: string]: boolean } }) => {
    const { table, fetchData, selectedRows, formatData, customButton, setModalImport }: any = UseDataTable();
    const { ziggy } = usePage<any>().props;

    const buttons = [
        {
            key: 'copy',
            label: 'Copy',
            icon: CopyIcon,
            onClick: () => {
                if (selectedRows.length === 0) {
                    toast.error('Tidak ada data yang dipilih');
                    return;
                }

                const formattedRows = formatData(selectedRows);
                const headers = Object.keys(formattedRows[0] ?? {});
                const textToCopy = [headers.join('\t'), ...formattedRows.map((row: any) => headers.map((key) => row[key]).join('\t'))].join('\n');

                navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => toast.success('Data berhasil disalin'))
                    .catch(() => toast.error('Gagal menyalin data'));
            },
            enabled: true,
        },
        {
            key: 'create',
            label: 'Create',
            icon: PlusIcon,
            onClick: () => {
                router.visit(ziggy.location + '/create');
            },
            enabled: true,
        },
        {
            key: 'import',
            label: 'Import',
            icon: UploadIcon,
            onClick: () => {
                setModalImport(true);
            },
            enabled: true,
        },
        {
            key: 'export',
            label: 'Export',
            icon: DownloadIcon,
            children: [
                {
                    key: 'csv',
                    label: 'CSV',
                    onClick: () => {
                        if (!selectedRows || selectedRows.length === 0) {
                            alert('Tidak ada data yang dipilih!');
                            return;
                        }
                    },
                },
                {
                    key: 'pdf',
                    label: 'PDF',
                    onClick: () => {
                        if (!selectedRows || selectedRows.length === 0) {
                            alert('Tidak ada data yang dipilih!');
                            return;
                        }
                    },
                },
            ],
            enabled: true,
        },
        {
            key: 'bulkaction',
            label: 'Bulk Action',
            icon: Pickaxe,
            children: [
                {
                    key: 'delete',
                    label: 'Delete Selected',
                    onClick: () => {
                        if (!selectedRows || selectedRows.length === 0) {
                            toast.error('Tidak ada data yang dipilih!');
                            return;
                        }

                        const ids = selectedRows.map((item: any) => item.id);

                        axios
                            .post(`${ziggy.location}/bulkaction`, { ids: ids, action: 'delete' })
                            .then(() => {
                                toast.success('Deleted Contact Data Successfully.');
                                fetchData();
                                router.reload({ only: ['flash'] });
                                table.resetRowSelection();
                            })
                            .catch((error) => {
                                toast.error('Terjadi kesalahan saat menghapus data');
                            });
                    },
                },
                {
                    key: 'restore',
                    label: 'Restore Selected',
                    onClick: () => {
                        if (!selectedRows || selectedRows.length === 0) {
                            toast.error('Tidak ada data yang dipilih!');
                            return;
                        }

                        const ids = selectedRows.map((item: any) => item.id);

                        axios
                            .post(`${ziggy.location}/bulkaction`, { ids: ids, action: 'restore' })
                            .then(() => {
                                toast.success('Restored Contact Data Successfully.');
                                fetchData();
                                router.reload({ only: ['flash'] });
                                table.resetRowSelection();
                            })
                            .catch((error) => {
                                toast.error('Terjadi kesalahan saat restore data');
                            });
                    },
                },
                {
                    key: 'verify',
                    label: 'Verify Selected',
                    onClick: () => {
                        if (!selectedRows || selectedRows.length === 0) {
                            toast.error('Tidak ada data yang dipilih!');
                            return;
                        }

                        const ids = selectedRows.map((item: any) => item.id);

                        axios
                            .post(`${ziggy.location}/bulkaction`, { ids: ids, action: 'verify' })
                            .then(() => {
                                toast.success('Proccesing Verified Contact Data Successfully.');
                                fetchData();
                                router.reload({ only: ['flash'] });
                                table.resetRowSelection();
                            })
                            .catch((error) => {
                                toast.error('Terjadi kesalahan saat memverifikasi data');
                            });
                    },
                },
            ],
            enabled: true,
        },
        ...(customButton ?? []),
        {
            key: 'reload',
            label: 'Reload',
            icon: RefreshCwIcon,
            onClick: () => {
                fetchData();
                table.resetRowSelection();
            },
            enabled: true,
        },
    ];

    const applyButtonActive = (buttons: any[], buttonsActive: any) => {
        return buttons.map((btn) => {
            const activeConfig = buttonsActive?.[btn.key]; // ✅ perbaikan di sini

            if (btn.children && typeof activeConfig === 'object') {
                return {
                    ...btn,
                    enabled: true,
                    children: btn.children
                        .filter((child: any) => activeConfig?.[child.key] !== false)
                        .map((child: any) => ({
                            ...child,
                            enabled: activeConfig?.[child.key] !== false,
                        })),
                };
            }

            return {
                ...btn,
                enabled: activeConfig !== false,
            };
        });
    };

    const filteredButtons = applyButtonActive(buttons, buttonsActive);
    const activeButtons = filteredButtons.filter((btn) => btn.enabled);

    return (
        <div className="flex flex-row items-center overflow-x-auto" role="group">
            {activeButtons.map((btn, i) =>
                btn.children && btn.children.length > 0 ? (
                    <DropdownMenu key={btn.key}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className={cn(
                                    i === 0 ? 'rounded-l-md' : 'rounded-l-none',
                                    i === activeButtons.length - 1 ? 'rounded-r-md' : 'rounded-r-none',
                                )}
                            >
                                {btn.icon && createElement(btn.icon, { className: 'mr-2 h-4 w-4' })}
                                <span className="hidden md:inline">{btn.label}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {btn.children.map((child: any) => (
                                <DropdownMenuItem className="cursor-pointer" key={child.key} onClick={child.onClick}>
                                    <span>{child.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button
                        key={btn.key}
                        onClick={btn.onClick}
                        className={cn(
                            i === 0 ? 'rounded-l-md' : 'rounded-l-none',
                            i === activeButtons.length - 1 ? 'rounded-r-md' : 'rounded-r-none',
                        )}
                    >
                        {btn.icon && createElement(btn.icon, { className: 'mr-2 h-4 w-4' })}
                        <span className="hidden md:inline">{btn.label}</span>
                    </Button>
                ),
            )}
        </div>
    );
};

export const ImportDataComponent = ({ forms, formatFileLocation }: { forms?: any; formatFileLocation?: string }) => {
    const { modalImport, setModalImport }: any = UseDataTable();

    const downloadFile = async () => {
        if (formatFileLocation) {
            const response = await fetch(formatFileLocation, {
                cache: 'no-store', // atau 'reload' untuk memaksa refresh
            });

            const blob = await response.blob();
            saveAs(blob, 'FORMAT_IMPORT_DATA.csv');
        }
    };

    return (
        <Dialog open={modalImport} onOpenChange={setModalImport}>
            <DialogContent aria-description="">
                <DialogHeader>
                    <DialogTitle>Import Data</DialogTitle>
                    <DialogDescription>Fill out the form below to add new data to the system</DialogDescription>
                </DialogHeader>
                <p className="text-sm">
                    Download Format Import{' '}
                    <span onClick={downloadFile} className="cursor-pointer text-sm font-semibold text-red-500">
                        Disini
                    </span>
                </p>
                <div>{forms && createElement(forms)}</div>
            </DialogContent>
        </Dialog>
    );
};
