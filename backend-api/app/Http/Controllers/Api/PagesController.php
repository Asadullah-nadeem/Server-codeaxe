<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PagesController extends Controller
{
    // ═══════════════════════════════════════════════════════════════
    // ABOUT PAGE
    // ═══════════════════════════════════════════════════════════════

    public function about()
    {
        try {
            $header = DB::table('about_page')->where('is_active', 1)->first();
            $sections = DB::table('about_sections')
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get();

            return response()->json(['success' => true, 'data' => ['header' => $header, 'sections' => $sections]], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateAboutHeader(Request $request)
    {
        DB::table('about_page')->where('id', 1)
            ->update($request->only('title', 'description', 'cta_label', 'cta_link', 'is_active', 'label'));
        return response()->json(['success' => true]);
    }

    public function storeAboutSection(Request $request)
    {
        $request->validate(['title' => 'required|string', 'content' => 'required|string']);
        $id = DB::table('about_sections')->insertGetId([
            'title'      => $request->title,
            'content'    => $request->content,
            'is_active'  => $request->is_active ?? 1,
            'sort_order' => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'id' => $id], 201);
    }

    public function updateAboutSection(Request $request, $id)
    {
        DB::table('about_sections')->where('id', $id)
            ->update($request->only('title', 'content', 'is_active', 'sort_order'));
        return response()->json(['success' => true]);
    }

    public function destroyAboutSection($id)
    {
        DB::table('about_sections')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // ═══════════════════════════════════════════════════════════════
    // LEGAL PAGES (privacy / terms / refund-cancellation / refund-policy)
    // ═══════════════════════════════════════════════════════════════

    public function legal($type)
    {
        try {
            $page = DB::table('legal_pages')
                ->where('page_type', $type)
                ->where('is_active', 1)
                ->first();

            if (!$page) {
                return response()->json(['success' => false, 'message' => 'Page not found or disabled'], 404);
            }

            $sections = DB::table('legal_sections')
                ->where('page_id', $page->id)
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get();

            return response()->json(['success' => true, 'data' => ['page' => $page, 'sections' => $sections]], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // Update top-level page info (title, label, last_updated, is_active)
    public function updateLegalPage(Request $request, $id)
    {
        DB::table('legal_pages')->where('id', $id)
            ->update($request->only('label', 'title', 'last_updated', 'is_active'));
        return response()->json(['success' => true]);
    }

    // Add a new section to a legal page
    public function storeLegalSection(Request $request)
    {
        $request->validate(['page_id' => 'required|integer', 'heading' => 'required|string', 'content' => 'required|string']);
        $id = DB::table('legal_sections')->insertGetId([
            'page_id'    => $request->page_id,
            'heading'    => $request->heading,
            'content'    => $request->content,
            'is_active'  => $request->is_active ?? 1,
            'sort_order' => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'id' => $id], 201);
    }

    // Edit or enable/disable a section
    public function updateLegalSection(Request $request, $id)
    {
        DB::table('legal_sections')->where('id', $id)
            ->update($request->only('heading', 'content', 'is_active', 'sort_order'));
        return response()->json(['success' => true]);
    }

    public function destroyLegalSection($id)
    {
        DB::table('legal_sections')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── Convenience: list all legal pages (for admin dashboard) ─────
    public function legalIndex()
    {
        $pages = DB::table('legal_pages')->orderBy('id')->get();
        return response()->json(['success' => true, 'data' => $pages]);
    }
}
