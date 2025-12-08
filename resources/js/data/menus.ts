import { ChevronRight, CogIcon, CpuIcon, MapIcon } from 'lucide-react';

export const NavigationList = [
    {
        title: 'Platform',
        roles: ['Administrators'],
        children: [
            {
                title: 'System Core',
                roles: ['Administrators'],
                icon: CpuIcon,
                children: [
                    {
                        title: 'Permissions',
                        href: route('admin.core.permissions.index'),
                        permission: 'view-permission',
                        icon: ChevronRight,
                    },
                    {
                        title: 'Roles',
                        href: route('admin.core.roles.index'),
                        permission: 'view-role',
                        icon: ChevronRight,
                    },
                    {
                        title: 'Users',
                        href: route('admin.core.users.index'),
                        permission: 'view-user',
                        icon: ChevronRight,
                    },
                    {
                        title: 'Regions',
                        roles: ['Administrators'],
                        icon: MapIcon,
                        children: [
                            {
                                title: 'Provinces',
                                href: route('admin.core.regions.provinces.index'),
                                permission: 'view-region',
                                icon: ChevronRight,
                            },
                            {
                                title: 'Regencies',
                                href: route('admin.core.regions.regencies.index'),
                                permission: 'view-region',
                                icon: ChevronRight,
                            },
                            {
                                title: 'Districts',
                                href: route('admin.core.regions.districts.index'),
                                permission: 'view-region',
                                icon: ChevronRight,
                            },
                            {
                                title: 'Villages',
                                href: route('admin.core.regions.villages.index'),
                                permission: 'view-region',
                                icon: ChevronRight,
                            },
                        ],
                    },
                ],
            },
            {
                title: 'Settings',
                roles: ['Administrators'],
                icon: CogIcon,
                children: [
                    {
                        title: 'Site',
                        href: route('admin.settings.site.edit'),
                        permission: 'view-settings-site',
                        icon: ChevronRight,
                    },
                ],
            },
        ],
    },
];
