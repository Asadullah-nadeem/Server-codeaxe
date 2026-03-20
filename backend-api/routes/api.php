<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NavController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\WorkController;
use App\Http\Controllers\Api\RewriteController;
use App\Http\Controllers\Api\ServicesController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\PagesController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DmsController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Middleware\VerifyAppKeyMiddleware;
use App\Http\Middleware\AuthUserMiddleware;
use App\Http\Middleware\DmsApiKeyMiddleware;
use App\Http\Middleware\AdminAuthMiddleware;
use App\Http\Middleware\AdminRoleMiddleware;
use App\Http\Middleware\DemoModeMiddleware;

// Public routes — called client-side without API key
Route::get('/rewrites', [RewriteController::class, 'index']);
Route::get('/portfolio', [PortfolioController::class, 'categories']);
Route::get('/portfolio/{slug}', [PortfolioController::class, 'show']);

// Public page routes (no API key for frontend fetch)
Route::get('/pages/about', [PagesController::class, 'about']);
Route::get('/pages/legal', [PagesController::class, 'legalIndex']);
Route::get('/pages/legal/{type}', [PagesController::class, 'legal']);

// Contact — public submit + template preview
Route::get('/contact', [ContactController::class, 'index']);
Route::post('/contact/submit', [ContactController::class, 'submit']);
Route::get('/contact/template/preview', [ContactController::class, 'previewTemplate']);
Route::get('/contact/template', [ContactController::class, 'getTemplate']);

// Auth routes (Public)
Route::get('/auth/page/{type}', [AuthController::class, 'pageConfig']);
Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/verify', [AuthController::class, 'verify']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Dashboard (Protected by User Token)
Route::middleware([AuthUserMiddleware::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/dashboard/request', [DashboardController::class, 'storeRequest']);
});

// Send Request UI (Public or semi-public to get text)
Route::get('/dashboard/request/ui', [DashboardController::class, 'requestUi']);

// ─── DMS: Document / Media Management System ────────────────────────────────
// Public proxy — serves media without exposing provider URLs
Route::get('/dms/media/{slug}/{id}', [DmsController::class, 'showImage']);

// Upload scope — requires valid DMS API key with at least 'upload' scope
Route::middleware([DmsApiKeyMiddleware::class . ':upload'])->group(function () {
    Route::post('/dms/media', [DmsController::class, 'store']);
});

// Admin scope — requires DMS API key with 'admin' scope
Route::middleware([DmsApiKeyMiddleware::class . ':admin'])->group(function () {
    Route::get('/dms/media',                       [DmsController::class, 'index']);
    Route::get('/dms/media/all',                   [DmsController::class, 'all']);
    Route::put('/dms/media/{id}',                  [DmsController::class, 'update']);
    Route::delete('/dms/media/{id}',               [DmsController::class, 'destroy']);
    Route::post('/dms/media/{id}/restore',         [DmsController::class, 'restore']);
    Route::get('/dms/media/{id}/logs',             [DmsController::class, 'logs']);

    // API Key management
    Route::get('/dms/keys',                        [DmsController::class, 'listKeys']);
    Route::post('/dms/keys',                       [DmsController::class, 'createKey']);
    Route::delete('/dms/keys/{id}',                [DmsController::class, 'revokeKey']);

    // Provider credential management (ImageKit / S3 keys)
    Route::get('/dms/providers',                   [DmsController::class, 'listProviders']);
    Route::post('/dms/providers',                  [DmsController::class, 'upsertProvider']);
    Route::delete('/dms/providers/{id}',           [DmsController::class, 'deleteProvider']);
});

// ─── Admin Panel API ────────────────────────────────────────────────────────
// Public Admin Login
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// General Admin Protected Routes (Basic Admin session)
Route::middleware([AdminAuthMiddleware::class, DemoModeMiddleware::class])->group(function () {
    Route::get('/admin/profile', [AdminAuthController::class, 'profile']);
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);

    // Standard admins can manage requests or view dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index']); // Example
});

// Super Admin ONLY Routes (Hierarchy check)
Route::middleware([AdminAuthMiddleware::class, DemoModeMiddleware::class, AdminRoleMiddleware::class . ':superadmin'])->group(function () {
    // Management of other admin accounts
    Route::get('/admin/list',       [AdminAuthController::class, 'listAdmins']);
    Route::post('/admin/create',    [AdminAuthController::class, 'createAdmin']);
    Route::put('/admin/update/{id}', [AdminAuthController::class, 'updateAdmin']);
    Route::delete('/admin/delete/{id}', [AdminAuthController::class, 'deleteAdmin']);
    
    // Sensitive DB settings or other system configs
    Route::get('/admin/system/status', function() {
        return response()->json(['success' => true, 'status' => 'System Online']);
    });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware([VerifyAppKeyMiddleware::class])->group(function () {
    // Nav API Routes
    Route::get('/nav', [NavController::class, 'index']);
    Route::post('/nav', [NavController::class, 'store']);
    Route::get('/nav/{id}', [NavController::class, 'show']);
    Route::put('/nav/{id}', [NavController::class, 'update']);
    Route::delete('/nav/{id}', [NavController::class, 'destroy']);

    // Footer API Routes
    Route::get('/footer', [FooterController::class, 'index']);
    Route::post('/footer/links', [FooterController::class, 'storeLink']);
    Route::put('/footer/links/{id}', [FooterController::class, 'updateLink']);
    Route::delete('/footer/links/{id}', [FooterController::class, 'destroyLink']);

    // Home API Routes
    Route::get('/home', [HomeController::class, 'index']);
    Route::post('/home/services', [HomeController::class, 'storeService']);
    Route::put('/home/services/{id}', [HomeController::class, 'updateService']);
    Route::delete('/home/services/{id}', [HomeController::class, 'destroyService']);

    // Work API Routes
    Route::get('/work', [WorkController::class, 'index']);

    // Rewrites CRUD (manage rewrite rules from admin)
    Route::post('/rewrites', [RewriteController::class, 'store']);
    Route::put('/rewrites/{id}', [RewriteController::class, 'update']);
    Route::delete('/rewrites/{id}', [RewriteController::class, 'destroy']);

    // Services API Routes
    Route::get('/services', [ServicesController::class, 'index']);
    Route::post('/services', [ServicesController::class, 'store']);
    Route::put('/services/{id}', [ServicesController::class, 'update']);
    Route::delete('/services/{id}', [ServicesController::class, 'destroy']);

    // Portfolio CRUD (admin)
    Route::post('/portfolio/categories', [PortfolioController::class, 'storeCategory']);
    Route::put('/portfolio/categories/{id}', [PortfolioController::class, 'updateCategory']);
    Route::delete('/portfolio/categories/{id}', [PortfolioController::class, 'destroyCategory']);
    Route::post('/portfolio/items', [PortfolioController::class, 'storeItem']);
    Route::put('/portfolio/items/{id}', [PortfolioController::class, 'updateItem']);
    Route::delete('/portfolio/items/{id}', [PortfolioController::class, 'destroyItem']);

    // Pages CRUD — About
    Route::put('/pages/about/header', [PagesController::class, 'updateAboutHeader']);
    Route::post('/pages/about/sections', [PagesController::class, 'storeAboutSection']);
    Route::put('/pages/about/sections/{id}', [PagesController::class, 'updateAboutSection']);
    Route::delete('/pages/about/sections/{id}', [PagesController::class, 'destroyAboutSection']);

    // Pages CRUD — Legal
    Route::put('/pages/legal/{id}', [PagesController::class, 'updateLegalPage']);
    Route::post('/pages/legal/sections', [PagesController::class, 'storeLegalSection']);
    Route::put('/pages/legal/sections/{id}', [PagesController::class, 'updateLegalSection']);
    Route::delete('/pages/legal/sections/{id}', [PagesController::class, 'destroyLegalSection']);

    // Contact — admin routes
    Route::get('/contact/submissions', [ContactController::class, 'submissions']);
    Route::put('/contact/submissions/{id}/status', [ContactController::class, 'updateStatus']);
    Route::put('/contact/template/{id}', [ContactController::class, 'updateTemplate']);
});
