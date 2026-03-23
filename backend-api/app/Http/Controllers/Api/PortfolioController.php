<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PortfolioController extends Controller
{
    // ─── GET /portfolio ────────────────────────────────────────────────
    // Returns all active categories (for tab list)
    public function categories()
    {
        $cats = DB::table('portfolio_categories')
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->get();

        return response()->json(['success' => true, 'data' => $cats], 200);
    }

    // ─── GET /admin/portfolio/categories ──────────────────────────────
    public function indexCategories()
    {
        $cats = DB::table('portfolio_categories')
            ->orderBy('sort_order')
            ->get();

        return response()->json(['success' => true, 'data' => $cats], 200);
    }

    // ─── GET /admin/portfolio/items ───────────────────────────────────
    // Admin only - returns all items including inactive ones
    public function index()
    {
        $items = DB::table('portfolio_items')
            ->orderByDesc('id')
            ->get()
            ->map(function ($item) {
                $item->tags = json_decode($item->tags, true);
                return $item;
            });

        return response()->json(['success' => true, 'data' => $items]);
    }

    // ─── GET /portfolio/{slug} ─────────────────────────────────────────
    // Returns a single category + its active items (paginated)
    public function show(Request $request, $slug)
    {
        try {
            $category = DB::table('portfolio_categories')
                ->where('slug', $slug)
                ->where('is_active', 1)
                ->first();

            if (!$category) {
                return response()->json(['success' => false, 'message' => 'Category not found or disabled'], 404);
            }

            $perPage = (int) $request->get('per_page', 6);
            $page    = (int) $request->get('page', 1);

            $total = DB::table('portfolio_items')
                ->where('category_id', $category->id)
                ->where('is_active', 1)
                ->count();

            $items = DB::table('portfolio_items')
                ->where('category_id', $category->id)
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->offset(($page - 1) * $perPage)
                ->limit($perPage)
                ->get()
                ->map(function ($item) {
                    $item->tags = json_decode($item->tags, true);
                    return $item;
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'category'    => $category,
                    'items'       => $items,
                    'total'       => $total,
                    'per_page'    => $perPage,
                    'current_page' => $page,
                    'total_pages' => (int) ceil($total / $perPage),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /portfolio/categories ────────────────────────────────────
    public function storeCategory(Request $request)
    {
        $request->validate([
            'slug'  => 'required|string|unique:portfolio_categories,slug',
            'label' => 'required|string',
        ]);
        $id = DB::table('portfolio_categories')->insertGetId([
            'slug'        => $request->slug,
            'label'       => $request->label,
            'description' => $request->description,
            'is_active'   => $request->is_active ?? 1,
            'sort_order'  => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'id' => $id], 201);
    }

    // ─── PUT /portfolio/categories/{id} ───────────────────────────────
    public function updateCategory(Request $request, $id)
    {
        DB::table('portfolio_categories')->where('id', $id)->update(
            $request->only('slug', 'label', 'description', 'is_active', 'sort_order')
        );
        return response()->json(['success' => true]);
    }

    // ─── DELETE /portfolio/categories/{id} ────────────────────────────
    public function destroyCategory($id)
    {
        DB::table('portfolio_categories')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── POST /portfolio/items ─────────────────────────────────────────
    public function storeItem(Request $request)
    {
        $request->validate([
            'category_id' => 'required|integer',
            'title'       => 'required|string',
            'description' => 'required|string',
        ]);
        $id = DB::table('portfolio_items')->insertGetId([
            'category_id'  => $request->category_id,
            'title'        => $request->title,
            'description'  => $request->description,
            'tags'         => json_encode($request->tags ?? []),
            'project_year' => $request->project_year,
            'image_url'    => $request->image_url,
            'project_url'  => $request->project_url,
            'is_active'    => $request->is_active ?? 1,
            'sort_order'   => $request->sort_order ?? 0,
        ]);
        return response()->json(['success' => true, 'id' => $id], 201);
    }

    // ─── PUT /portfolio/items/{id} ────────────────────────────────────
    public function updateItem(Request $request, $id)
    {
        $data = $request->only('category_id', 'title', 'description', 'project_year', 'image_url', 'project_url', 'is_active', 'sort_order');
        if ($request->has('tags')) {
            $data['tags'] = json_encode($request->tags);
        }
        DB::table('portfolio_items')->where('id', $id)->update($data);
        return response()->json(['success' => true]);
    }

    // ─── DELETE /portfolio/items/{id} ─────────────────────────────────
    public function destroyItem($id)
    {
        DB::table('portfolio_items')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
