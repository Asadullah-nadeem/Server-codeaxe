<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkController extends Controller
{
    // ─── GET /work (Public — requires X-API-KEY) ───────────────────────────────
    // Returns header + categories with projects nested inside (for frontend display)
    public function index()
    {
        try {
            $header = DB::table('work_section_header')->first();

            $categories = DB::table('work_categories')
                ->orderBy('sort_order')
                ->get();

            $projects = DB::table('work_projects')
                ->where(function ($q) {
                    // Support is_active if column exists, otherwise show all
                    if ($this->columnExists('work_projects', 'is_active')) {
                        $q->where('is_active', 1);
                    }
                })
                ->get()
                ->map(function ($p) {
                    $p->tags = json_decode($p->tags, true) ?? [];
                    return $p;
                });

            $categoriesWithProjects = $categories->map(function ($cat) use ($projects) {
                $cat->projects = $projects->where('category_id', $cat->id)->values();
                return $cat;
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'header'     => $header,
                    'categories' => $categoriesWithProjects,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ─── GET /admin/work/header ────────────────────────────────────────────────
    public function getHeader()
    {
        try {
            $header = DB::table('work_section_header')->first();
            return response()->json(['success' => true, 'data' => $header], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── PUT /admin/work/header ────────────────────────────────────────────────
    public function updateHeader(Request $request)
    {
        try {
            $header = DB::table('work_section_header')->first();
            $data = $request->only('section_index', 'label', 'title', 'description');

            if ($header) {
                DB::table('work_section_header')->where('id', $header->id)->update($data);
            } else {
                DB::table('work_section_header')->insert(array_merge($data, [
                    'section_index' => $data['section_index'] ?? '00',
                    'label'         => $data['label']         ?? 'ALL WORK',
                    'title'         => $data['title']         ?? 'Work',
                    'description'   => $data['description']   ?? '',
                ]));
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── GET /admin/work/categories ───────────────────────────────────────────
    public function indexCategories()
    {
        try {
            $cats = DB::table('work_categories')
                ->orderBy('sort_order')
                ->get();

            return response()->json(['success' => true, 'data' => $cats], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /admin/work/categories ──────────────────────────────────────────
    public function storeCategory(Request $request)
    {
        try {
            $request->validate([
                'label' => 'required|string|max:255',
            ]);

            $data = [
                'label'      => $request->label,
                'sort_order' => $request->sort_order ?? 0,
            ];

            // Include optional fields only if columns exist
            if ($this->columnExists('work_categories', 'slug') && $request->filled('slug')) {
                $data['slug'] = $request->slug;
            }
            if ($this->columnExists('work_categories', 'is_active')) {
                $data['is_active'] = $request->is_active ?? 1;
            }

            $id = DB::table('work_categories')->insertGetId($data);

            return response()->json(['success' => true, 'id' => $id], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── PUT /admin/work/categories/{id} ──────────────────────────────────────
    public function updateCategory(Request $request, $id)
    {
        try {
            $data = array_filter([
                'label'      => $request->label,
                'sort_order' => $request->sort_order,
            ], fn($v) => !is_null($v));

            if ($this->columnExists('work_categories', 'slug') && $request->has('slug')) {
                $data['slug'] = $request->slug;
            }
            if ($this->columnExists('work_categories', 'is_active') && $request->has('is_active')) {
                $data['is_active'] = $request->is_active;
            }

            DB::table('work_categories')->where('id', $id)->update($data);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── DELETE /admin/work/categories/{id} ───────────────────────────────────
    public function destroyCategory($id)
    {
        try {
            DB::table('work_categories')->where('id', $id)->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── GET /admin/work/projects ─────────────────────────────────────────────
    public function indexProjects()
    {
        try {
            $projects = DB::table('work_projects')
                ->orderByDesc('id')
                ->get()
                ->map(function ($p) {
                    $p->tags = json_decode($p->tags, true) ?? [];
                    return $p;
                });

            return response()->json(['success' => true, 'data' => $projects], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /admin/work/projects ────────────────────────────────────────────
    public function storeProject(Request $request)
    {
        try {
            $request->validate([
                'category_id' => 'required|integer',
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            $data = [
                'category_id'  => $request->category_id,
                'title'        => $request->title,
                'description'  => $request->description,
                'tags'         => json_encode($request->tags ?? []),
                'project_year' => $request->project_year,
                'image_url'    => $request->image_url,
                'project_url'  => $request->project_url,
            ];

            if ($this->columnExists('work_projects', 'is_active')) {
                $data['is_active'] = $request->is_active ?? 1;
            }
            if ($this->columnExists('work_projects', 'sort_order')) {
                $data['sort_order'] = $request->sort_order ?? 0;
            }

            $id = DB::table('work_projects')->insertGetId($data);

            return response()->json(['success' => true, 'id' => $id], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── PUT /admin/work/projects/{id} ────────────────────────────────────────
    public function updateProject(Request $request, $id)
    {
        try {
            $data = array_filter([
                'category_id'  => $request->category_id,
                'title'        => $request->title,
                'description'  => $request->description,
                'project_year' => $request->project_year,
                'image_url'    => $request->image_url,
                'project_url'  => $request->project_url,
            ], fn($v) => !is_null($v));

            if ($request->has('tags')) {
                $data['tags'] = json_encode($request->tags);
            }
            if ($this->columnExists('work_projects', 'is_active') && $request->has('is_active')) {
                $data['is_active'] = $request->is_active;
            }
            if ($this->columnExists('work_projects', 'sort_order') && $request->has('sort_order')) {
                $data['sort_order'] = $request->sort_order;
            }

            DB::table('work_projects')->where('id', $id)->update($data);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── DELETE /admin/work/projects/{id} ─────────────────────────────────────
    public function destroyProject($id)
    {
        try {
            DB::table('work_projects')->where('id', $id)->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── Helper: Check if a column exists in a table ──────────────────────────
    private function columnExists(string $table, string $column): bool
    {
        try {
            $cols = DB::select("SHOW COLUMNS FROM `{$table}` LIKE '{$column}'");
            return count($cols) > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
}
