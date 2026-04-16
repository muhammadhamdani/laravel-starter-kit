import { ButtonComponent } from '@/components/partials/button-component';
import { InputComponent } from '@/components/partials/input-component';
import {
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { Head, useForm } from '@inertiajs/react';
import { EyeClosedIcon, EyeIcon, SearchIcon } from 'lucide-react';
import { Fragment, useState } from 'react';

export default function TestPage() {
    return (
        <Fragment>
            <Head title="Test" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-screen flex-1 flex-col space-y-8 overflow-hidden rounded-xl border border-sidebar-border/70 py-4 md:min-h-min md:py-6 dark:border-sidebar-border">
                    <div className="px-4 md:px-6">
                        <TestForm />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export const TestForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, processing, errors, reset, transform }: any =
        useForm({
            saveBack: 'false',
        });

    return (
        <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldDescription>
                This appears on invoices and emails.
            </FieldDescription>
            <FieldGroup className="grid grid-cols-2 gap-2">
                <InputComponent label="Name" placeholder="Full Name" />
                <InputComponent label="Email" placeholder="Email Address" />
                <InputComponent
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Password"
                    group={true}
                    rightAddon={showPassword ? EyeClosedIcon : EyeIcon}
                    handleRightAddon={() => setShowPassword(!showPassword)}
                />
                <InputComponent
                    label="Search"
                    placeholder="Search"
                    group={true}
                    leftAddon={SearchIcon}
                />
                <InputComponent
                    group={true}
                    leftAddon={SearchIcon}
                    rightAddon={SearchIcon}
                />
            </FieldGroup>
            <ButtonComponent />
        </FieldSet>
    );
};
