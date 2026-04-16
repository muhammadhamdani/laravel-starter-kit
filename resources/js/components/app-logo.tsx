import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { settings } = usePage<any>().props;

    const logoUrl = (() => {
        if (!settings?.logo) {
            return `${window.location.origin}/storage/assets/images/svg/logo_color.svg`;
        }

        // kalau sudah full URL (https://)
        if (settings.logo.startsWith('http')) {
            return settings.logo;
        }

        // kalau relative path dari storage
        return `${window.location.origin}/storage/${settings.logo}`;
    })();

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={logoUrl} alt="Logo" className="rounded bg-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Laravel Starter Kit
                </span>
            </div>
        </>
    );
}
