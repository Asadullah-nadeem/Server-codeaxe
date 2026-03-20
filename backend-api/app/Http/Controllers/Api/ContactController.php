<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ThankYouMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    // ─── GET /contact ──────────────────────────────────────────────────
    public function index()
    {
        try {
            $header = DB::table('contact_page')->where('is_active', 1)->first();
            $directInfo = DB::table('contact_direct_info')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get();
            $responseTimes = DB::table('contact_response_times')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'header' => $header,
                    'direct_info' => $directInfo,
                    'response_times' => $responseTimes
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /contact/submit ──────────────────────────────────────────
    public function submit(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        $submission = [
            'name'    => $request->name,
            'email'   => $request->email,
            'company' => $request->company ?? '',
            'message' => $request->message,
        ];

        // Save to DB
        $id = DB::table('contact_submissions')->insertGetId(array_merge(
            $submission,
            ['submitted_at' => now()]
        ));

        // Load active thank-you template
        $template = DB::table('email_templates')
            ->where('template_key', 'thank_you_contact')
            ->where('is_active', 1)
            ->first();

        // Send thank-you email if template exists
        $emailSent = false;
        if ($template) {
            try {
                Mail::to($submission['email'])
                    ->send(new ThankYouMail($submission, $template));
                $emailSent = true;
            } catch (\Exception $e) {
                \Log::warning("Thank-you email failed for #{$id}: " . $e->getMessage());
            }
        }

        return response()->json([
            'success'    => true,
            'id'         => $id,
            'email_sent' => $emailSent,
            'message'    => 'Your message has been received. We\'ll respond within 48 hours.',
        ], 201);
    }

    // ─── GET /contact/submissions ──────────────────────────────────────
    public function submissions()
    {
        $rows = DB::table('contact_submissions')
            ->orderByDesc('submitted_at')
            ->get();
        return response()->json(['success' => true, 'data' => $rows]);
    }

    // ─── PUT /contact/submissions/{id}/status ──────────────────────────
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:new,read,replied']);
        DB::table('contact_submissions')->where('id', $id)
            ->update(['status' => $request->status]);
        return response()->json(['success' => true]);
    }

    // ─── GET /contact/template ─────────────────────────────────────────
    public function getTemplate()
    {
        $t = DB::table('email_templates')->where('template_key', 'thank_you_contact')->first();
        return response()->json(['success' => true, 'data' => $t]);
    }

    // ─── PUT /contact/template/{id} ────────────────────────────────────
    public function updateTemplate(Request $request, $id)
    {
        DB::table('email_templates')->where('id', $id)->update(
            $request->only('subject', 'headline', 'body_html', 'footer_text',
                           'brand_color', 'accent_color', 'logo_url', 'is_active')
        );
        return response()->json(['success' => true]);
    }

    // ─── GET /contact/template/preview ─────────────────────────────────
    // Returns rendered HTML preview for the admin
    public function previewTemplate()
    {
        $template = DB::table('email_templates')
            ->where('template_key', 'thank_you_contact')
            ->first();

        if (!$template) {
            return response()->json(['success' => false, 'message' => 'Template not found'], 404);
        }

        $dummy = [
            'name'    => 'John Doe',
            'email'   => 'john@example.com',
            'company' => 'Acme Corp',
            'message' => 'We need a full-stack web platform for our business.',
        ];

        $mail = new ThankYouMail($dummy, $template);
        $html = view('emails.thank_you', [
            'submission' => $dummy,
            'template'   => $template,
            'body'       => $mail->build()->getData()['body'] ?? $template->body_html,
        ])->render();

        return response($html)->header('Content-Type', 'text/html');
    }
}
