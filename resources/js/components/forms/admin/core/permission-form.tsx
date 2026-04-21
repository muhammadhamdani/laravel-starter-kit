import { ButtonComponent } from '@/components/partials/button-component';
import { InputComponent } from '@/components/partials/input-component';
import permissions from '@/routes/admin/core/permissions';
import { useForm, usePage } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';

export const PermissionForm = ({ dataId }: { dataId?: number }) => {
    const { permission } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } =
        useForm({
            saveBack: 'false',
            name: permission?.name || '',
        });

    // transformData
    transform((data: any) => ({
        ...data,
        ...(dataId && { _method: 'put' }),
    }));

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (dataId) {
            put(permissions.update(dataId).url, {});
        } else {
            post(permissions.store().url, {});
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputComponent
                    type="text"
                    label="Name"
                    placeholder="Name"
                    name="name"
                    value={data.name}
                    handleOnChange={(value: string) => setData('name', value)}
                    errors={errors.name && errors.name}
                    helperText={errors.name && errors.name}
                />
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
