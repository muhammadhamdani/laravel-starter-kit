<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.site_name', 'Laravel Starter Kit');
        $this->migrator->add('site.site_description', 'Laravel Starter Kit Panels');
        $this->migrator->add('site.logo', null);
        $this->migrator->add('site.favicon', null);
        $this->migrator->add('site.address', null);
        $this->migrator->add('site.phone', null);
        $this->migrator->add('site.email', null);
        $this->migrator->add('site.facebook', null);
        $this->migrator->add('site.instagram', null);
        $this->migrator->add('site.twitter', null);
        $this->migrator->add('site.youtube', null);
        $this->migrator->add('site.whatsapp', null);
        $this->migrator->add('site.tiktok', null);
        $this->migrator->add('site.maintenance_mode', false);
    }
};
