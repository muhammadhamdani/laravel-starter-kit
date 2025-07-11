<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

Breadcrumbs::for('google.redirect', function (BreadcrumbTrail $trail) {
    $trail->push('Google Redirect', route('google.redirect', ['provider' => 'google']));
});

Breadcrumbs::for('google.callback', function (BreadcrumbTrail $trail) {
    $trail->push('Google Callback', route('google.callback', ['provider' => 'google']));
});

Breadcrumbs::for('login', function (BreadcrumbTrail $trail) {
    $trail->push('Login', route('login'));
});

Breadcrumbs::for('register', function (BreadcrumbTrail $trail) {
    $trail->push('Register', route('register'));
});

Breadcrumbs::for('password.request', function (BreadcrumbTrail $trail) {
    $trail->push('Forgot Password', route('password.request'));
});

Breadcrumbs::for('profile.edit', function (BreadcrumbTrail $trail) {
    $trail->push('Profile Settings', route('profile.edit'));
});

Breadcrumbs::for('password.edit', function (BreadcrumbTrail $trail) {
    $trail->push('Profile Settings', route('password.edit'));
});

Breadcrumbs::for('appearance', function (BreadcrumbTrail $trail) {
    $trail->push('Profile Settings', route('appearance'));
});
