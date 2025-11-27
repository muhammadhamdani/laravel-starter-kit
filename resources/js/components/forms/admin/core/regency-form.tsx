import { ButtonComponent } from '@/components/partials/button-component';
import InputTextComponent from '@/components/partials/input-components';
import { SelectSearchComponent } from '@/components/partials/select-component';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ChevronsUpDown, SaveIcon, X } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const RegencyForm = ({ dataId }: { dataId?: number }) => {
    const { regency, provinces } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        saveBack: 'false',
        name: regency?.name || '',
        province_id: regency?.province?.id || '',
    });

    // transformData
    transform((data) => ({
        ...data,
    }));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (dataId) {
            put(route('admin.core.regions.regencies.update', dataId), {
                onSuccess: () => {
                    toast.success('regency berhasil diubah');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat mengubah regency');
                },
            });
        } else {
            post(route('admin.core.regions.regencies.store'), {
                onSuccess: () => {
                    toast.success('regency berhasil ditambahkan');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menambahkan regency');
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputTextComponent
                    type="text"
                    label="Name"
                    name="name"
                    value={data.name}
                    handleOnChange={(value: string) => setData('name', value)}
                    errors={errors.name && errors.name}
                    helperText={errors.name && errors.name}
                />
                <SelectSearchComponent
                    label="Provinces"
                    placeholder="Select Province..."
                    data={provinces?.map((item: any) => {
                        return { label: item.name, value: item.id };
                    })}
                    dataSelected={data?.province_id}
                    handleOnChange={(value) => setData('province_id', value)}
                />
                {/* <InputSelectWithSearch
                    label="Provinces"
                    dataSelected={data.province_id}
                    placeholder="Select Province..."
                    onChange={() => setData('province_id', data.province_id)}
                /> */}
            </div>
            <div className="flex justify-end space-x-4">
                <ButtonComponent
                    buttonText="Save"
                    addonLeft={SaveIcon}
                    buttonType="submit"
                    isProcessing={processing}
                    onClick={() => setData('saveBack', 'true')}
                />
            </div>
        </form>
    );
};

interface OptionItem {
    value: string;
    label: string;
}

export const InputSelectWithSearch = ({
    label,
    placeholder = 'Select...',
    dataSelected,
    onChange,
}: {
    label?: string;
    placeholder?: string;
    dataSelected: any;
    onChange: (value: any) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<OptionItem | null>(null);
    const [searchValue, setSearchValue] = useState('');

    const [data, setData] = useState<OptionItem[]>([]);
    const [loading, setLoading] = useState(false);

    // preload dari parent
    useEffect(() => {
        if (dataSelected) {
            setSelected({
                value: String(dataSelected.value ?? dataSelected.id),
                label: dataSelected.label ?? '',
            });
        } else {
            setSelected(null);
        }
    }, [dataSelected]);

    // debounce
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchValue), 350);
        return () => clearTimeout(handler);
    }, [searchValue]);

    // fetch
    const fetchData = useCallback(() => {
        if (debouncedSearch.length < 2) {
            setData([]);
            return;
        }

        setLoading(true);

        axios
            .get(route('admin.core.regions.provinces.data'), {
                params: { globalSearch: debouncedSearch },
            })
            .then((res) => {
                setData(
                    res.data?.map((item: any) => ({
                        value: String(item.id),
                        label: item.name,
                    })),
                );
            })
            .finally(() => setLoading(false));
    }, [debouncedSearch]);

    useEffect(() => {
        if (open) fetchData();
    }, [open, debouncedSearch, fetchData]);

    // CLEAR
    const clearSelection = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setSelected(null);
        setSearchValue('');
        setData([]);
        setOpen(false);

        onChange(null); // <-- FIX PENTING
    };

    return (
        <div className="flex flex-col space-y-3">
            {label && <Label>{label}</Label>}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="relative w-full justify-between">
                        <span className={!selected ? 'text-muted-foreground' : ''}>{selected?.label || placeholder}</span>

                        {selected && (
                            <X
                                className="absolute right-8 h-4 w-4 cursor-pointer opacity-60 hover:opacity-100"
                                onMouseDown={(e) => clearSelection(e)}
                            />
                        )}

                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
                    <Command>
                        <CommandInput placeholder="Search..." value={searchValue} onValueChange={setSearchValue} className="h-9" />

                        <CommandList className="max-h-60 overflow-auto">
                            {loading && <div className="text-muted-foreground p-3 text-sm">Loading...</div>}

                            {debouncedSearch.length < 2 && <CommandEmpty>Type at least 2 characters...</CommandEmpty>}

                            {debouncedSearch.length >= 2 && !loading && data.length === 0 && <CommandEmpty>No data found.</CommandEmpty>}

                            {data.length > 0 && (
                                <CommandGroup>
                                    {data.map((item) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.label}
                                            onSelect={() => {
                                                setSelected(item);
                                                setSearchValue('');
                                                setOpen(false);
                                                onChange(item); // kirim ke parent
                                            }}
                                        >
                                            {item.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
