<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class AdminSetting extends Settings
{
    public bool $show_analytics;
    public ?string $admin_theme;
    public ?string $dashboard_welcome_text;

    public static function group(): string
    {
        return 'admin';
    }
}
