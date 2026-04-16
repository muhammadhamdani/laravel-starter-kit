import { ButtonComponent } from '@/components/partials/button-component';
import {
    InputComponent,
    InputFileComponent,
} from '@/components/partials/input-component';
import { Card, CardContent } from '@/components/ui/card';
import { router, useForm, usePage } from '@inertiajs/react';

import { useState } from 'react';

export const SiteForm = () => {
    const { settings } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        saveBack: 'false',
        site_name: settings?.site_name || '',
        site_description: settings?.site_description || '',
        email: settings?.email || '',
        phone: settings?.phone || '',
        address: settings?.address || '',
        logo: null, // file
        favicon: null, // file
        facebook: settings?.facebook || '',
        instagram: settings?.instagram || '',
        twitter: settings?.twitter || '',
        youtube: settings?.youtube || '',
        linkedin: settings?.linkedin || '',
        whatsapp: settings?.whatsapp || '',
        tiktok: settings?.tiktok || '',
        _method: 'PUT',
    });

    // PREVIEW
    const [logoPreview, setLogoPreview] = useState(
        (settings?.logo && `/storage/${settings?.logo}`) ||
            'https://picsum.photos/300/300',
    );
    const [faviconPreview, setFaviconPreview] = useState(
        (settings?.favicon && `/storage/${settings?.favicon}`) ||
            'https://picsum.photos/300/300',
    );

    /** FILE HANDLER WITH PREVIEW **/
    const handleLogoChange = (file: any) => {
        setData('logo', file);

        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFavichandleOnChange = (file: any) => {
        setData('favicon', file);

        if (file) {
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        post('/admin/settings/site', {
            forceFormData: true,
        });

        router.reload({ only: ['flash'] });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex w-56 flex-col space-y-4">
                    <Card className="p-1">
                        <CardContent className="flex flex-col space-y-2 p-1 text-center text-xs">
                            {logoPreview && (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="rounded-lg border object-contain"
                                />
                            )}
                            <span className="font-normal">Logo</span>
                        </CardContent>
                    </Card>
                    <Card className="p-1">
                        <CardContent className="flex flex-col space-y-2 p-1 text-center text-xs">
                            {faviconPreview && (
                                <img
                                    src={faviconPreview}
                                    alt="Favicon Preview"
                                    className="rounded-lg border object-contain"
                                />
                            )}
                            <span className="font-normal">Favicon</span>
                        </CardContent>
                    </Card>
                </div>
                <Card className="w-full">
                    <CardContent>
                        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                            <InputComponent
                                type="text"
                                label="Name"
                                name="site_name"
                                value={data.site_name}
                                handleOnChange={(value: string) =>
                                    setData('site_name', value)
                                }
                                errors={errors.site_name}
                                helperText={
                                    errors.site_name && errors.site_name
                                }
                            />
                            <InputComponent
                                type="text"
                                label="Description"
                                name="site_description"
                                value={data.site_description}
                                handleOnChange={(value: string) =>
                                    setData('site_description', value)
                                }
                                errors={errors.site_description}
                            />
                            <InputComponent
                                type="text"
                                label="Email"
                                name="email"
                                value={data.email}
                                handleOnChange={(value: string) =>
                                    setData('email', value)
                                }
                                errors={errors.email}
                            />
                            <InputComponent
                                type="text"
                                label="Phone"
                                name="phone"
                                value={data.phone}
                                handleOnChange={(value: string) =>
                                    setData('phone', value)
                                }
                                errors={errors.phone}
                            />
                            <InputComponent
                                type="text"
                                label="Address"
                                name="address"
                                value={data.address}
                                handleOnChange={(value: string) =>
                                    setData('address', value)
                                }
                                errors={errors.address}
                            />
                            <InputComponent
                                type="text"
                                label="Whatsapp"
                                name="whatsapp"
                                value={data.whatsapp}
                                handleOnChange={(value: string) =>
                                    setData('whatsapp', value)
                                }
                                errors={errors.whatsapp}
                            />
                            <InputComponent
                                type="text"
                                label="Facebook"
                                name="facebook"
                                value={data.facebook}
                                handleOnChange={(value: string) =>
                                    setData('facebook', value)
                                }
                                errors={errors.facebook}
                            />
                            <InputComponent
                                type="text"
                                label="Instagram"
                                name="instagram"
                                value={data.instagram}
                                handleOnChange={(value: string) =>
                                    setData('instagram', value)
                                }
                                errors={errors.instagram}
                            />
                            <InputComponent
                                type="text"
                                label="Twitter"
                                name="twitter"
                                value={data.twitter}
                                handleOnChange={(value: string) =>
                                    setData('twitter', value)
                                }
                                errors={errors.twitter}
                            />
                            <InputComponent
                                type="text"
                                label="Youtube"
                                name="youtube"
                                value={data.youtube}
                                handleOnChange={(value: string) =>
                                    setData('youtube', value)
                                }
                                errors={errors.youtube}
                            />
                            <InputComponent
                                type="text"
                                label="Tiktok"
                                name="tiktok"
                                value={data.tiktok}
                                handleOnChange={(value: string) =>
                                    setData('tiktok', value)
                                }
                                errors={errors.tiktok}
                            />
                            <InputFileComponent
                                type="file"
                                label="Logo"
                                name="logo"
                                handleOnChange={handleLogoChange}
                                errors={errors.logo}
                            />
                            <InputFileComponent
                                type="file"
                                label="Favicon"
                                name="favicon"
                                handleOnChange={handleFavichandleOnChange}
                                errors={errors.favicon}
                            />
                            {/*

                             */}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-end">
                <ButtonComponent
                    buttonText={processing ? 'Saving...' : 'Save'}
                    buttonType="submit"
                    isProcessing={processing}
                />
            </div>
        </form>
    );
};
