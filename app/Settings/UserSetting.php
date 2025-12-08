<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class UserSetting extends Settings
{
    public bool $dark_mode;
    public ?string $language;

    public static function group(): string
    {
        return 'user';
    }
}
