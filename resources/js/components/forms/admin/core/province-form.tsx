import { ButtonComponent } from '@/components/partials/button-component';
import InputTextComponent from '@/components/partials/input-components';
import { useForm, usePage } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

export const ProvinceForm = ({ dataId }: { dataId?: number }) => {
    const { province } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        saveBack: 'false',
        name: province?.name || '',
    });

    // transformData
    transform((data) => ({
        ...data,
    }));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (dataId) {
            put(route('admin.core.regions.provinces.update', dataId), {
                onSuccess: () => {
                    toast.success('Province berhasil diubah');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat mengubah Province');
                },
            });
        } else {
            post(route('admin.core.regions.provinces.store'), {
                onSuccess: () => {
                    toast.success('Province berhasil ditambahkan');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menambahkan Province');
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
