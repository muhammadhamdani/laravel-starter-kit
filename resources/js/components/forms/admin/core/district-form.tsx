import { ButtonComponent } from '@/components/partials/button-component';
import InputTextComponent from '@/components/partials/input-components';
import { SelectSearchComponent } from '@/components/partials/select-component';
import { useForm, usePage } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

export const DistrictForm = ({ dataId }: { dataId?: number }) => {
    const { district, regencies } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        saveBack: 'false',
        name: district?.name || '',
        regency_id: district?.regency?.id || '',
    });

    // transformData
    transform((data) => ({
        ...data,
    }));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (dataId) {
            put(route('admin.core.regions.districts.update', dataId), {
                onSuccess: () => {
                    toast.success('district berhasil diubah');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat mengubah district');
                },
            });
        } else {
            post(route('admin.core.regions.districts.store'), {
                onSuccess: () => {
                    toast.success('district berhasil ditambahkan');
                    reset(); // reset form
                },
                onError: () => {
                    toast.error('Terjadi kesalahan saat menambahkan district');
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
                    label="Regencies"
                    placeholder="Select Regencies..."
                    data={regencies?.map((item: any) => {
                        return { label: item.name, value: item.id };
                    })}
                    dataSelected={data?.regency_id}
                    handleOnChange={(value) => setData('regency_id', value)}
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
