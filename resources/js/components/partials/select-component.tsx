import { cn } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import { Label } from '../ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

export const SelectComponent = ({
    data = Array.from({ length: 5 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `${i + 1}`,
    })),
    dataSelected,
    label,
    errors,
    helperText,
    className,
    placeholder = 'Select option...',
    handleOnChange,
    ...props
}: SelectProps) => {
    return (
        <div className="flex flex-col space-y-3">
            {label && <Label>{label}</Label>}
            <Select
                defaultValue={dataSelected?.toString()}
                onValueChange={(value) => handleOnChange?.(value)}
                {...props}
            >
                <SelectTrigger
                    className={cn(
                        'w-full',
                        className,
                        errors && 'border-red-500',
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {data.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value.toString()}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {helperText && (
                <div
                    className={cn(
                        'flex items-center space-x-2 text-xs',
                        errors ? 'text-red-500' : 'text-gray-500',
                    )}
                >
                    <InfoIcon
                        className={cn(
                            'h-4 w-4',
                            errors ? 'text-red-500' : 'text-yellow-500',
                        )}
                    />
                    <span>{helperText}</span>
                </div>
            )}
        </div>
    );
};

interface SelectProps {
    data?: SelectOption[];
    dataSelected?: any;
    label?: string;
    placeholder?: string;
    errors?: any;
    helperText?: string;
    className?: string;
    multiple?: boolean;
    handleOnChange: (value: any) => void;
    [key: string]: any;
}

interface SelectOption {
    label: string;
    value: string | number;
}
