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
    rightAddon?: any;
    [key: string]: any;
}

export const ButtonComponent = ({
    buttonType = 'button',
    buttonText = 'Button',
    className = '',
    isProcessing = false,
    addonLeft,
    rightAddon,
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
            {rightAddon && createElement(rightAddon, { className: 'w-5 h-5' })}
            {isProcessing && <Spinner className="animate-spin" />}
        </Button>
    );
};

export const ButtonIconComponent = ({
    buttonType = 'button',
    icons = 'Button',
    className = '',
    pill = false,
    ...props
}: ButtonProps) => {
    return (
        <Button type={buttonType} className={cn(className)} {...props}>
            {icons && createElement(icons, { className: 'w-5 h-5' })}
        </Button>
    );
};
