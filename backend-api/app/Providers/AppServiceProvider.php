<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('smtp_settings')) {
                $settings = \Illuminate\Support\Facades\DB::table('smtp_settings')->where('is_active', 1)->first();
                if ($settings) {
                    config([
                        'mail.default'                 => 'smtp',
                        'mail.mailers.smtp.host'       => $settings->mail_host,
                        'mail.mailers.smtp.port'       => $settings->mail_port,
                        'mail.mailers.smtp.username'   => $settings->mail_username,
                        'mail.mailers.smtp.password'   => $settings->mail_password,
                        'mail.mailers.smtp.encryption' => $settings->mail_encryption,
                        'mail.from.address'            => $settings->mail_from_address,
                        'mail.from.name'               => $settings->mail_from_name,
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Log or ignore if DB/table not ready
        }
    }
}
