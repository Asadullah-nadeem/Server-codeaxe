<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ThankYouMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmailTemplateController extends Controller
{
    // List all templates
    public function index()
    {
        $templates = DB::table('email_templates')->get();
        return response()->json(['success' => true, 'data' => $templates]);
    }

    // Show a specific template with its sections
    public function show($id)
    {
        $template = DB::table('email_templates')->where('id', $id)->first();
        if (!$template) {
            return response()->json(['success' => false, 'message' => 'Template not found'], 404);
        }

        $sections = DB::table('email_template_sections')
            ->where('template_id', $id)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'template' => $template,
                'sections' => $sections
            ]
        ]);
    }

    // Create a NEW template
    public function store(Request $request)
    {
        $request->validate([
            'template_key' => 'required|string|unique:email_templates',
            'subject'      => 'required|string',
            'headline'     => 'required|string',
        ]);

        $id = DB::table('email_templates')->insertGetId([
            'template_key' => $request->template_key,
            'subject'      => $request->subject,
            'headline'     => $request->headline,
            'body_html'    => $request->body_html ?? '',
            'footer_text'  => $request->footer_text ?? '',
            'brand_color'  => $request->brand_color ?? '#0a0a0a',
            'accent_color' => $request->accent_color ?? '#3b82f6',
            'is_active'    => $request->is_active ?? 1
        ]);

        return response()->json(['success' => true, 'id' => $id], 201);
    }

    // Update template header info
    public function update(Request $request, $id)
    {
        DB::table('email_templates')->where('id', $id)->update(
            $request->only('subject', 'headline', 'body_html', 'footer_text', 'brand_color', 'accent_color', 'logo_url', 'is_active')
        );
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        DB::table('email_templates')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── SECTIONS ──────────────────────────────────────────────────

    public function storeSection(Request $request)
    {
        $request->validate([
            'template_id'  => 'required|integer',
            'section_name' => 'required|string',
            'content'      => 'required|string',
        ]);

        $id = DB::table('email_template_sections')->insertGetId([
            'template_id'  => $request->template_id,
            'section_name' => $request->section_name,
            'content'      => $request->content,
            'sort_order'   => $request->sort_order ?? 0,
            'is_active'    => $request->is_active ?? 1
        ]);

        return response()->json(['success' => true, 'id' => $id], 201);
    }

    public function updateSection(Request $request, $id)
    {
        DB::table('email_template_sections')->where('id', $id)->update(
            $request->only('section_name', 'content', 'sort_order', 'is_active')
        );
        return response()->json(['success' => true]);
    }

    public function destroySection($id)
    {
        DB::table('email_template_sections')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    public function preview($id)
    {
        $template = DB::table('email_templates')->where('id', $id)->first();
        if (!$template) {
            return response()->json(['success' => false, 'message' => 'Template not found'], 404);
        }

        $dummy = [
            'name'    => 'John Doe',
            'email'   => 'john@example.com',
            'company' => 'Acme Corp',
            'message' => 'This is a sample message to preview the content.',
        ];

        // Use the existing ThankYouMail logic for rendering
        $mail = new ThankYouMail($dummy, $template);
        $html = view('emails.thank_you', [
            'submission' => $dummy,
            'template'   => $template,
            'body'       => $mail->renderBody(),
        ])->render();

        return response($html)->header('Content-Type', 'text/html');
    }
}
