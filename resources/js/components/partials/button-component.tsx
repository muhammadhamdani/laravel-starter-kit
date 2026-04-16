import { cn } from '@/lib/utils';
import { createElement } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface ButtonProps {
    buttonText?: string;
    className?: string;
    buttonType?: 'button' | 'submit' | 'reset';
    isProcessing?: boolean;
    addonLeft?: any;
    addonRight?: any;
    [key: string]: any;
}

export const ButtonComponent = ({
    buttonType = 'button',
    buttonText = 'Button',
    className = '',
    isProcessing = false,
    addonLeft,
    addonRight,
    ...props
}: ButtonProps) => {
    return (
        <Button
            type={buttonType}
            disabled={isProcessing}
            className={cn(className)}
            {...props}
        >
            {addonLeft && createElement(addonLeft, { className: 'w-5 h-5' })}
            <span>{buttonText}</span>
            {addonRight && createElement(addonRight, { className: 'w-5 h-5' })}
            {isProcessing && <Spinner className="animate-spin" />}
        </Button>
    );
};
