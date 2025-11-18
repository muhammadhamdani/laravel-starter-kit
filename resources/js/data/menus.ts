import permissions from '@/routes/admin/core/permissions';
import roles from '@/routes/admin/core/roles';
import users from '@/routes/admin/core/users';
import { ChevronRight, CpuIcon } from 'lucide-react';

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
                        href: permissions.index().url,
                        // href: route('core.permissions.index'),
                        permission: 'view-permission',
                        icon: ChevronRight,
                    },
                    {
                        title: 'Roles',
                        href: roles.index().url,
                        permission: 'view-role',
                        icon: ChevronRight,
                    },
                    {
                        title: 'Users',
                        href: users.index().url,
                        permission: 'view-user',
                        icon: ChevronRight,
                    },
                ],
            },
        ],
    },
    // {
    //     title: 'CMS',
    //     roles: ['Administrators'],
    //     children: [
    //         {
    //             title: 'Postingan',
    //             roles: ['Administrators'],
    //             icon: Newspaper,
    //             children: [
    //                 {
    //                     title: 'Categories',
    //                     href: categories.index().url,
    //                     permission: 'view-category',
    //                     icon: ChevronRight,
    //                 },
    //                 {
    //                     title: 'Posts',
    //                     href: posts.index().url,
    //                     permission: 'view-post',
    //                     icon: ChevronRight,
    //                 },
    //                 {
    //                     title: 'Tags',
    //                     href: tags.index().url,
    //                     permission: 'view-tag',
    //                     icon: ChevronRight,
    //                 },
    //                 {
    //                     title: 'Pages',
    //                     href: pages.index().url,
    //                     permission: 'view-page',
    //                     icon: ChevronRight,
    //                 },
    //             ],
    //         },
    //         // {
    //         //     title: 'Master Data',
    //         //     roles: ['Administrators'],
    //         //     icon: DatabaseIcon,
    //         //     children: [
    //         //         {
    //         //             title: 'Sliders',
    //         //             href: route('cms.sliders.index'),
    //         //             permission: 'view-category',
    //         //             icon: ChevronRight,
    //         //         },
    //         //     ],
    //         // },
    //         // {
    //         //     title: 'Analytics',
    //         //     roles: ['Administrators'],
    //         //     icon: ChartArea,
    //         //     children: [],
    //         // },
    //     ],
    // },
    // {
    //     title: 'Fundraising',
    //     roles: ['Administrators'],
    //     children: [
    //         {
    //             title: 'Master Data',
    //             roles: ['Administrators'],
    //             icon: DatabaseIcon,
    //             children: [
    //                 {
    //                     title: 'Categories',
    //                     href: categoryCampaigns.index().url,
    //                     permission: 'view-category-campaign',
    //                     icon: ChevronRight,
    //                 },
    //                 {
    //                     title: 'Campaigns',
    //                     href: posts.index().url,
    //                     permission: 'view-post',
    //                     icon: ChevronRight,
    //                 },
    //             ],
    //         },
    //         {
    //             title: 'Payment Methods',
    //             roles: ['Administrators'],
    //             icon: DockIcon,
    //             children: [
    //                 {
    //                     title: 'Provider',
    //                     href: rekeningProviders.index().url,
    //                     permission: 'view-rekening-provider',
    //                     icon: ChevronRight,
    //                 },
    //                 {
    //                     title: 'Rekening',
    //                     href: rekenings.index().url,
    //                     permission: 'view-rekening',
    //                     icon: ChevronRight,
    //                 },
    //             ],
    //         },
    //         // {
    //         //     title: 'Master Data',
    //         //     roles: ['Administrators'],
    //         //     icon: DatabaseIcon,
    //         //     children: [
    //         //         {
    //         //             title: 'Sliders',
    //         //             href: route('cms.sliders.index'),
    //         //             permission: 'view-category',
    //         //             icon: ChevronRight,
    //         //         },
    //         //     ],
    //         // },
    //         // {
    //         //     title: 'Analytics',
    //         //     roles: ['Administrators'],
    //         //     icon: ChartArea,
    //         //     children: [],
    //         // },
    //     ],
    // },
];
