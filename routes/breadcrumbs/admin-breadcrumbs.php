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
    'users.create',
    fn($trail) =>
    $trail->parent('admin.core.users.index')->push('Create', route('users.create'))
);

Breadcrumbs::for(
    'users.show',
    fn($trail, $user) =>
    $trail->parent('admin.core.users.index')->push($user->name, route('users.show', $user))
);

Breadcrumbs::for(
    'users.edit',
    fn($trail, $user) =>
    $trail->parent('users.show', $user)->push('Edit', route('users.edit', $user))
);

Breadcrumbs::for(
    'users.data',
    fn($trail) =>
    $trail->parent('admin.core.users.index')->push('Users Data', route('users.data'))
);

// Permissions
Breadcrumbs::for(
    'admin.core.permissions.index',
    fn($trail) =>
    $trail->parent('admin.dashboard')->push('Permissions', route('admin.core.permissions.index'))
);

Breadcrumbs::for(
    'permissions.create',
    fn($trail) =>
    $trail->parent('admin.core.permissions.index')->push('Create', route('permissions.create'))
);

Breadcrumbs::for(
    'permissions.show',
    fn($trail, $permission) =>
    $trail->parent('admin.core.permissions.index')->push($permission->name, route('permissions.show', $permission))
);

Breadcrumbs::for(
    'permissions.edit',
    fn($trail, $permission) =>
    $trail->parent('permissions.show', $permission)->push('Edit', route('permissions.edit', $permission))
);

Breadcrumbs::for(
    'permissions.data',
    fn($trail) =>
    $trail->parent('admin.core.permissions.index')->push('Permissions Data', route('permissions.data'))
);

// Roles
Breadcrumbs::for(
    'admin.core.roles.index',
    fn($trail) =>
    $trail->parent('admin.dashboard')->push('Roles', route('admin.core.roles.index'))
);

Breadcrumbs::for(
    'roles.create',
    fn($trail) =>
    $trail->parent('admin.core.roles.index')->push('Create', route('roles.create'))
);

Breadcrumbs::for(
    'roles.show',
    fn($trail, $permission) =>
    $trail->parent('admin.core.roles.index')->push($permission->name, route('roles.show', $permission))
);

Breadcrumbs::for(
    'roles.edit',
    fn($trail, $permission) =>
    $trail->parent('roles.show', $permission)->push('Edit', route('roles.edit', $permission))
);

Breadcrumbs::for(
    'roles.data',
    fn($trail) =>
    $trail->parent('admin.core.roles.index')->push('Roles Data', route('roles.data'))
);

Breadcrumbs::for(
    'roles.access',
    fn($trail) =>
    $trail->parent('admin.core.roles.index')->push('Roles Access', route('roles.access'))
);
