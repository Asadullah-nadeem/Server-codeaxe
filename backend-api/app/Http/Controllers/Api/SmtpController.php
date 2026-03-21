<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class SmtpController extends Controller
{
    // GET /admin/smtp/settings
    public function getSettings()
    {
        $settings = DB::table('smtp_settings')->first();
        return response()->json(['success' => true, 'data' => $settings]);
    }

    // PUT /admin/smtp/settings
    public function updateSettings(Request $request)
    {
        $request->validate([
            'mail_host' => 'required',
            'mail_port' => 'required|numeric',
            'mail_username' => 'nullable',
            'mail_password' => 'nullable',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required'
        ]);

        DB::table('smtp_settings')->where('id', 1)->update($request->only(
            'mail_host', 'mail_port', 'mail_username', 'mail_password', 
            'mail_encryption', 'mail_from_address', 'mail_from_name', 'is_active'
        ));

        return response()->json(['success' => true, 'message' => 'SMTP settings updated!']);
    }

    // POST /admin/smtp/test
    public function testSmtp(Request $request) {
        $email = $request->email ?: 'hello@codeaxe.co.in';

        // Set config temporarily for this request
        $this->applySmtpConfig();

        try {
            Mail::raw("SMTP Test Successful manually configured via Admin Panel.", function ($message) use ($email) {
                $message->to($email)
                        ->subject("SMTP Configuration Test");
            });

            return response()->json(['success' => true, 'message' => "Test email sent to $email successfully."]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => "SMTP Error: " . $e->getMessage()], 500);
        }
    }

    /** 
     * Applies SMTP settings from DB to Laravel's config helper 
     * This is only for the Current Request if used here.
     * We should integrate this into a ServiceProvider for Global use.
     */
    public static function applySmtpConfig() {
        $settings = DB::table('smtp_settings')->where('is_active', 1)->first();
        if ($settings) {
            Config::set('mail.mailers.smtp.host',       $settings->mail_host);
            Config::set('mail.mailers.smtp.port',       $settings->mail_port);
            Config::set('mail.mailers.smtp.username',   $settings->mail_username);
            Config::set('mail.mailers.smtp.password',   $settings->mail_password);
            Config::set('mail.mailers.smtp.encryption', $settings->mail_encryption);
            Config::set('mail.from.address',            $settings->mail_from_address);
            Config::set('mail.from.name',               $settings->mail_from_name);
        }
    }
}
