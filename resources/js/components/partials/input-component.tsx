import { cn } from '@/lib/utils';
import axios from 'axios';
import { Check, ChevronDownIcon, ChevronsUpDown, InfoIcon } from 'lucide-react';
import moment from 'moment';
import {
    createElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command';
import { Field, FieldDescription, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '../ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';

export const InputComponent = ({
    type = 'text',
    placeholder = 'Placeholder',
    className = '',
    label,
    errors,
    helperText,
    group = false,
    leftAddon = false,
    rightAddon = false,
    handleLeftAddon = () => {},
    handleRightAddon = () => {},
    handleOnChange = () => {},
    ...props
}: {
    type?: string;
    placeholder?: string;
    label?: string;
    className?: string;
    leftAddon?: any;
    rightAddon?: any;
    handleLeftAddon?: (e: any) => void;
    handleRightAddon?: (e: any) => void;
    handleOnChange?: (e: any) => void;
    group?: boolean;
    errors?: any;
    helperText?: any;
    [key: string]: any;
}) => {
    return (
        <Field data-invalid={errors}>
            {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
            {group ? (
                <InputGroup>
                    {leftAddon && (
                        <InputGroupAddon align="inline-start">
                            {createElement(leftAddon, {
                                onClick: handleLeftAddon,
                                className: 'w-5 h-5 cursor-pointer',
                            })}
                        </InputGroupAddon>
                    )}
                    <InputGroupInput
                        type={type}
                        placeholder={placeholder}
                        className={cn(
                            className,
                            errors &&
                                'border-red-500 focus:border-red-500 focus:ring-red-500',
                        )}
                        onChange={(e) => handleOnChange(e.target.value)}
                        {...props}
                    />
                    {rightAddon && (
                        <InputGroupAddon align="inline-end">
                            {createElement(rightAddon, {
                                onClick: handleRightAddon,
                                className: 'w-5 h-5 cursor-pointer',
                            })}
                        </InputGroupAddon>
                    )}
                </InputGroup>
            ) : (
                <Input
                    type={type}
                    placeholder={placeholder}
                    className={cn(
                        className,
                        errors &&
                            'border-red-500 focus:border-red-500 focus:ring-red-500',
                    )}
                    onChange={(e) => handleOnChange(e.target.value)}
                    {...props}
                />
            )}
            {helperText && (
                <FieldDescription
                    className={cn(
                        'flex items-center space-x-2',
                        errors ? 'text-destructive' : 'text-yellow-500',
                    )}
                >
                    <InfoIcon
                        className={cn(
                            'h-4 w-4',
                            errors ? 'text-destructive' : 'text-yellow-500',
                        )}
                    />
                    <span>{helperText}</span>
                </FieldDescription>
            )}
        </Field>
    );
};

export const InputTextAreaComponent = ({
    placeholder = 'Placeholder',
    className = '',
    label,
    errors,
    helperText,
    handleOnChange = () => {},
    ...props
}: {
    placeholder?: string;
    label?: string;
    className?: string;
    handleOnChange?: (e: any) => void;
    group?: boolean;
    errors?: any;
    helperText?: any;
    [key: string]: any;
}) => {
    return (
        <Field data-invalid={errors}>
            {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
            <Textarea
                rows={30}
                cols={10}
                placeholder={placeholder}
                className={cn(
                    className,
                    errors &&
                        'border-red-500 focus:border-red-500 focus:ring-red-500',
                )}
                onChange={(e) => handleOnChange(e.target.value)}
                {...props}
            />
            {helperText && (
                <FieldDescription
                    className={cn(
                        'flex items-center space-x-2',
                        errors ? 'text-destructive' : 'text-yellow-500',
                    )}
                >
                    <InfoIcon
                        className={cn(
                            'h-4 w-4',
                            errors ? 'text-destructive' : 'text-yellow-500',
                        )}
                    />
                    <span>{helperText}</span>
                </FieldDescription>
            )}
        </Field>
    );
};

export const InputFileComponent = ({
    placeholder = 'Placeholder',
    className = '',
    label,
    errors,
    helperText,
    group = false,
    leftAddon = false,
    rightAddon = false,
    handleLeftAddon = () => {},
    handleRightAddon = () => {},
    handleOnChange = () => {},
    ...props
}: {
    type?: string;
    placeholder?: string;
    label?: string;
    className?: string;
    leftAddon?: any;
    rightAddon?: any;
    handleLeftAddon?: (e: any) => void;
    handleRightAddon?: (e: any) => void;
    handleOnChange?: (e: any) => void;
    group?: boolean;
    errors?: any;
    helperText?: any;
    [key: string]: any;
}) => {
    return (
        <Field>
            {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
            <Input
                type="file"
                placeholder={placeholder}
                className={cn(className)}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleOnChange?.(file);
                }}
                {...props}
            />
            {helperText && (
                <FieldDescription
                    className={cn(
                        'flex items-center space-x-2',
                        errors ? 'text-destructive' : 'text-yellow-500',
                    )}
                >
                    <InfoIcon
                        className={cn(
                            'h-4 w-4',
                            errors ? 'text-destructive' : 'text-yellow-500',
                        )}
                    />
                    <span>{helperText}</span>
                </FieldDescription>
            )}
        </Field>
    );
};

export const InputSelectComponent = ({
    placeholder = 'Select option...',
    data,
    dataSelected,
    label,
    errors,
    helperText,
    multiple,
    handleOnChange,
    fetchDataUrl,
    ...props
}: {
    placeholder?: string;
    data?: any;
    dataSelected?: any;
    label?: string;
    errors?: any;
    helperText?: any;
    multiple?: boolean;
    handleOnChange?: any;
    fetchDataUrl?: string;
    [key: string]: any;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [resultData, setResultData] = useState(data ?? []);
    const [open, setOpen] = useState(false);

    // ✅ sync kalau data static berubah
    useEffect(() => {
        if (!fetchDataUrl) {
            setResultData(data ?? []);
        }
    }, [data, fetchDataUrl]);

    // ✅ selected checker
    const isSelected = (value: string) => {
        return Array.isArray(dataSelected)
            ? dataSelected.includes(value)
            : dataSelected === value;
    };

    // ✅ toggle select
    const toggleSelect = (value: any) => {
        if (multiple) {
            const selectedArray = Array.isArray(dataSelected)
                ? [...dataSelected]
                : [];

            const index = selectedArray.indexOf(value);

            if (index >= 0) {
                selectedArray.splice(index, 1);
            } else {
                selectedArray.push(value);
            }

            handleOnChange(selectedArray);
        } else {
            handleOnChange(value);
            setOpen(false);
        }
    };

    // ✅ placeholder text
    const renderPlaceholder = useMemo(() => {
        if (multiple) {
            const selectedLabels = resultData
                .filter((item: any) =>
                    Array.isArray(dataSelected)
                        ? dataSelected.includes(item.value)
                        : false,
                )
                .map((item: any) => item.label);

            return selectedLabels.length > 0
                ? selectedLabels.join(', ')
                : placeholder;
        } else {
            const selectedLabel = resultData.find(
                (item: any) => item.value === dataSelected,
            )?.label;

            return selectedLabel || placeholder;
        }
    }, [dataSelected, resultData, multiple, placeholder]);

    // ✅ fetch data (API mode)
    const fetchData = useCallback(async () => {
        if (!fetchDataUrl) return;

        if (searchValue.length < 3) return;

        setIsLoading(true);

        try {
            const response = await axios.get(fetchDataUrl, {
                params: {
                    globalSearch: searchValue,
                },
            });

            // 🔥 penting: sesuaikan response API kamu
            // misal: { data: [{ id, name }] }
            const mapped =
                response.data?.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                })) ?? [];

            setResultData(mapped.slice(0, 10));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchDataUrl, searchValue]);

    // ✅ debounce fetch
    useEffect(() => {
        if (!fetchDataUrl) return;

        const delay = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(delay);
    }, [fetchData, fetchDataUrl]);

    return (
        <Field>
            {/* LABEL */}
            <div className="flex flex-row items-center justify-between">
                {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="relative w-full justify-between text-gray-500"
                    >
                        <span
                            className={
                                !dataSelected ||
                                (Array.isArray(dataSelected) &&
                                    dataSelected.length === 0)
                                    ? 'text-gray-500'
                                    : ''
                            }
                        >
                            {renderPlaceholder}
                        </span>
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command>
                        {/* SEARCH */}
                        <CommandInput
                            placeholder="Search..."
                            className="h-9"
                            onValueChange={(value) => setSearchValue(value)}
                        />

                        <CommandList>
                            {/* LOADING */}
                            {isLoading && (
                                <div className="p-2 text-center text-sm text-gray-500">
                                    Loading...
                                </div>
                            )}

                            {!isLoading && resultData.length === 0 && (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )}

                            <CommandGroup>
                                {/* CLEAR */}
                                <CommandItem onSelect={() => toggleSelect('')}>
                                    Clear Selection
                                </CommandItem>

                                {/* DATA */}
                                {resultData.map((item: any, i: number) => (
                                    <CommandItem
                                        key={i}
                                        value={item.label}
                                        onSelect={() =>
                                            toggleSelect(item.value)
                                        }
                                    >
                                        {item.label}
                                        <Check
                                            className={`ml-auto h-4 w-4 ${
                                                isSelected(item.value)
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            }`}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* HELPER */}
            {helperText && (
                <FieldDescription
                    className={`flex items-center space-x-2 ${
                        errors ? 'text-destructive' : 'text-yellow-500'
                    }`}
                >
                    <InfoIcon className="h-4 w-4" />
                    <span>{helperText}</span>
                </FieldDescription>
            )}
        </Field>
    );
};

export const InputDateComponent = ({
    placeholder = 'Select Date',
    className = '',
    value,
    label,
    errors,
    helperText,
    group = false,
    handleOnChange = () => {},
}: any) => {
    const [open, setOpen] = useState(false);

    const [internalDate, setInternalDate] = useState<Date | undefined>(
        !group ? value : undefined,
    );

    const [range, setRange] = useState<DateRange | undefined>(
        group ? value : undefined,
    );

    const selectedDate = value ?? internalDate;
    const selectedRange = value ?? range;

    const handleSelect = (val: any) => {
        if (group) {
            setRange(val);
            handleOnChange?.(val);

            // close kalau sudah lengkap
            if (val?.from && val?.to) {
                setOpen(false);
            }
        } else {
            setInternalDate(val);
            handleOnChange?.(val);
            setOpen(false);
        }
    };

    const formatDate = () => {
        if (group) {
            if (!selectedRange?.from) return placeholder;

            if (selectedRange.to) {
                return `${moment(selectedRange.from).format('DD MMM YYYY')} - ${moment(selectedRange.to).format('DD MMM YYYY')}`;
            }

            return moment(selectedRange.from).format('DD MMM YYYY');
        }

        if (!selectedDate) return placeholder;

        return moment(selectedDate).format('DD MMM YYYY');
    };

    return (
        <Field data-invalid={errors}>
            {label && <FieldLabel>{label}</FieldLabel>}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-between font-normal',
                            !value && 'text-muted-foreground',
                            errors && 'border-red-500',
                            className,
                        )}
                    >
                        {formatDate()}
                        <ChevronDownIcon className="h-4 w-4 opacity-60" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                    {group ? (
                        <Calendar
                            mode="range"
                            selected={selectedRange}
                            onSelect={(val: DateRange | undefined) =>
                                handleSelect(val)
                            }
                            numberOfMonths={2}
                        />
                    ) : (
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(val: Date | undefined) =>
                                handleSelect(val)
                            }
                        />
                    )}
                </PopoverContent>
            </Popover>

            {helperText && (
                <FieldDescription
                    className={cn(
                        'flex items-center space-x-2',
                        errors ? 'text-destructive' : 'text-yellow-500',
                    )}
                >
                    <InfoIcon className="h-4 w-4" />
                    <span>{helperText}</span>
                </FieldDescription>
            )}
        </Field>
    );
};

export const InputNumberComponent = ({
    type = 'text',
    placeholder = 'Placeholder',
    className = '',
    label,
    errors,
    helperText,
    group = false,
    leftAddon = false,
    rightAddon = false,
    register,
    handleLeftAddon = () => {},
    handleRightAddon = () => {},
    handleOnChange = () => {},
    ...props
}: {
    type?: string;
    placeholder?: string;
    label?: string;
    className?: string;
    leftAddon?: any;
    rightAddon?: any;
    register?: any;
    handleLeftAddon?: (e: any) => void;
    handleRightAddon?: (e: any) => void;
    handleOnChange?: (e: any) => void;
    group?: boolean;
    errors?: any;
    helperText?: any;
    [key: string]: any;
}) => {
    return (
        <Field data-invalid={errors}>
            {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
            {group ? (
                <InputGroup>
                    {leftAddon && (
                        <InputGroupAddon align="inline-start">
                            {createElement(leftAddon, {
                                onClick: handleLeftAddon,
                                className: 'w-5 h-5 cursor-pointer',
                            })}
                        </InputGroupAddon>
                    )}
                    <InputGroupInput
                        type={type}
                        placeholder={placeholder}
                        className={cn(
                            className,
                            errors &&
                                'border-red-500 focus:border-red-500 focus:ring-red-500',
                        )}
                        onChange={(e) => handleOnChange(e.target.value)}
                        {...register}
                        {...props}
                    />
                    {rightAddon && (
                        <InputGroupAddon align="inline-end">
                            {createElement(rightAddon, {
                                onClick: handleRightAddon,
                                className: 'w-5 h-5 cursor-pointer',
                            })}
                        </InputGroupAddon>
                    )}
                </InputGroup>
            ) : (
                <Input
                    type={type}
                    placeholder={placeholder}
                    className={cn(
                        className,
                        errors &&
                            'border-red-500 focus:border-red-500 focus:ring-red-500',
                    )}
                    onChange={(e) => handleOnChange(e.target.value)}
                    {...register}
                    {...props}
                />
            )}
            {helperText && (
                <FieldDescription
                    className={cn(
                        'flex items-center space-x-2',
                        errors ? 'text-destructive' : 'text-yellow-500',
                    )}
                >
                    <InfoIcon
                        className={cn(
                            'h-4 w-4',
                            errors ? 'text-destructive' : 'text-yellow-500',
                        )}
                    />
                    <span>{helperText}</span>
                </FieldDescription>
            )}
        </Field>
    );
};

export const InputCheckboxComponent = () => {
    return <div>InputCheckboxComponent</div>;
};

export const InputRadioComponent = () => {
    return <div>InputRadioComponent</div>;
};
