import { ButtonComponent } from '@/components/partials/button-component';
import {
    InputComponent,
    InputSelectComponent,
} from '@/components/partials/input-component';
import regencies from '@/routes/admin/core/regions/regencies';
import { useForm, usePage } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';

export const RegencyForm = ({ dataId }: { dataId?: string }) => {
    const { regency, provinces } = usePage<any>().props;

    const { data, setData, post, put, processing, errors, reset, transform } =
        useForm({
            saveBack: 'false',
            name: regency?.name || '',
            province_id: regency?.province?.id || '',
        });

    // transformData
    transform((data: any) => ({
        ...data,
        ...(dataId && { _method: 'put' }),
    }));

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (dataId) {
            put(regencies.update(dataId).url, {});
        } else {
            post(regencies.store().url, {});
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
                    label="Provinces"
                    placeholder="Select Province..."
                    data={provinces?.map((item: any) => {
                        return { label: item.name, value: item.id };
                    })}
                    dataSelected={data?.province_id}
                    onChange={(value: string) => setData('province_id', value)}
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
