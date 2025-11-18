<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

// Dashboard (root)
Breadcrumbs::for('admin.dashboard', function (BreadcrumbTrail $trail) {
    $trail->push('Admin', route('admin.dashboard'));
});

// Users
Breadcrumbs::for(
    'admin.core.users.index',
    fn($trail) =>
    $trail->parent('admin.dashboard')->push('Users', route('admin.core.users.index'))
);

Breadcrumbs::for(
    'admin.core.users.create',
    fn($trail) =>
    $trail->parent('admin.core.users.index')->push('Create', route('admin.core.users.create'))
);

Breadcrumbs::for(
    'admin.core.users.show',
    fn($trail, $user) =>
    $trail->parent('admin.core.users.index')->push($user->name, route('admin.core.users.show', $user))
);

Breadcrumbs::for(
    'admin.core.users.edit',
    fn($trail, $user) =>
    $trail->parent('admin.core.users.show', $user)->push('Edit', route('admin.core.users.edit', $user))
);

Breadcrumbs::for(
    'admin.core.users.data',
    fn($trail) =>
    $trail->parent('admin.core.users.index')->push('Users Data', route('admin.core.users.data'))
);

// Permissions
Breadcrumbs::for(
    'admin.core.permissions.index',
    fn($trail) =>
    $trail->parent('admin.dashboard')->push('Permissions', route('admin.core.permissions.index'))
);

Breadcrumbs::for(
    'admin.core.permissions.create',
    fn($trail) =>
    $trail->parent('admin.core.permissions.index')->push('Create', route('admin.core.permissions.create'))
);

Breadcrumbs::for(
    'admin.core.permissions.show',
    fn($trail, $permission) =>
    $trail->parent('admin.core.permissions.index')->push($permission->name, route('admin.core.permissions.show', $permission))
);

Breadcrumbs::for(
    'admin.core.permissions.edit',
    fn($trail, $permission) =>
    $trail->parent('admin.core.permissions.show', $permission)->push('Edit', route('admin.core.permissions.edit', $permission))
);

Breadcrumbs::for(
    'admin.core.permissions.data',
    fn($trail) =>
    $trail->parent('admin.core.permissions.index')->push('Permissions Data', route('admin.core.permissions.data'))
);

// Roles
Breadcrumbs::for(
    'admin.core.roles.index',
    fn($trail) =>
    $trail->parent('admin.dashboard')->push('Roles', route('admin.core.roles.index'))
);

Breadcrumbs::for(
    'admin.core.roles.create',
    fn($trail) =>
    $trail->parent('admin.core.roles.index')->push('Create', route('admin.core.roles.create'))
);

Breadcrumbs::for(
    'admin.core.roles.show',
    fn($trail, $permission) =>
    $trail->parent('admin.core.roles.index')->push($permission->name, route('admin.core.roles.show', $permission))
);

Breadcrumbs::for(
    'admin.core.roles.edit',
    fn($trail, $permission) =>
    $trail->parent('admin.core.roles.show', $permission)->push('Edit', route('admin.core.roles.edit', $permission))
);

Breadcrumbs::for(
    'admin.core.roles.data',
    fn($trail) =>
    $trail->parent('admin.core.roles.index')->push('Roles Data', route('admin.core.roles.data'))
);

Breadcrumbs::for(
    'admin.core.roles.access',
    fn($trail) =>
    $trail->parent('admin.core.roles.index')->push('Roles Access', route('admin.core.roles.access'))
);
