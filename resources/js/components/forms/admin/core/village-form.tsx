import { ButtonComponent } from '@/components/partials/button-component';
import {
    InputComponent,
    InputSelectComponent,
} from '@/components/partials/input-component';
import villages from '@/routes/admin/core/regions/villages';
import { useForm, usePage } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

export const VillageForm = ({ dataId }: { dataId?: string }) => {
    const { village, districts } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } =
        useForm({
            saveBack: 'false',
            name: village?.name || '',
            district_id: village?.district?.id || '',
        });

    // transformData
    transform((data) => ({
        ...data,
    }));

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (dataId) {
            put(villages.update(dataId).url, {
                onSuccess: () => {
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat mengubah village');
                },
            });
        } else {
            post(villages.store().url, {
                onSuccess: () => {
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menambahkan village');
                },
            });
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
                <InputSelectComponent
                    label="District"
                    placeholder="Select District..."
                    data={districts?.map((item: any) => {
                        return { label: item.name, value: item.id };
                    })}
                    dataSelected={data?.district_id}
                    handleOnChange={(value: string) =>
                        setData('district_id', value)
                    }
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
