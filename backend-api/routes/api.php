<?php

use App\Http\Middleware\VerifyDmsKeyMiddleware;
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
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\EmailTemplateController;
use App\Http\Controllers\Api\SmtpController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\SystemSettingsController;
use App\Http\Middleware\VerifyAppKeyMiddleware;
use App\Http\Middleware\AuthUserMiddleware;
use App\Http\Middleware\DmsApiKeyMiddleware;
use App\Http\Middleware\AdminAuthMiddleware;
use App\Http\Middleware\AdminRoleMiddleware;
use App\Http\Middleware\DemoModeMiddleware;

// Public routes — called client-side without API key
Route::get('/rewrites', [RewriteController::class, 'publicList']);
Route::get('/sections', [SectionController::class, 'publicIndex']);
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

    // Chat
    Route::get('/chat/messages/{request_id}', [ChatController::class, 'getUserMessages']);
    Route::post('/chat/send/{request_id}',    [ChatController::class, 'userSendMessage']);
    Route::post('/chat/typing/{request_id}',  [ChatController::class, 'userSetTyping']);
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

    // ─── DMS: Media & Infrastructure ────────────────────────────────


// ─── Admin Panel API ────────────────────────────────────────────────────────
// Public Admin Login & Recovery
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/forget-password', [AdminAuthController::class, 'forgetPassword']);

// General Admin Protected Routes (Basic Admin session)
Route::middleware([AdminAuthMiddleware::class, DemoModeMiddleware::class])->group(function () {
    Route::get('/admin/profile', [AdminAuthController::class, 'profile']);
    Route::post('/admin/profile/update', [AdminAuthController::class, 'updateProfile']);
    Route::get('/admin/auth/check', [AdminAuthController::class, 'checkAuth']);
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);

    // ─── CMS Management (Content CRUD) ───

    // Navigation Routes
    Route::get('/admin/nav', [NavController::class, 'index']);
    Route::post('/admin/nav', [NavController::class, 'store']);
    Route::put('/admin/nav/settings', [NavController::class, 'updateSettings']);
    Route::get('/admin/nav/{id}', [NavController::class, 'show']);
    Route::put('/admin/nav/{id}', [NavController::class, 'update']);
    Route::delete('/admin/nav/{id}', [NavController::class, 'destroy']);

    // Footer Management
    Route::get('/admin/footer', [FooterController::class, 'index']); // Admin can view footer
    Route::put('/admin/footer/settings', [FooterController::class, 'updateSettings']);
    Route::post('/admin/footer/links', [FooterController::class, 'storeLink']);
    Route::put('/admin/footer/links/{id}', [FooterController::class, 'updateLink']);
    Route::delete('/admin/footer/links/{id}', [FooterController::class, 'destroyLink']);

    // Home Management (Sections)
    Route::get('/admin/home', [HomeController::class, 'index']); // Admin can view home content
    Route::post('/admin/home/services', [HomeController::class, 'storeService']);
    Route::put('/admin/home/services/{id}', [HomeController::class, 'updateService']);
    Route::delete('/admin/home/services/{id}', [HomeController::class, 'destroyService']);
    Route::post('/admin/home/projects', [HomeController::class, 'storeProject']);
    Route::put('/admin/home/projects/{id}', [HomeController::class, 'updateProject']);
    Route::delete('/admin/home/projects/{id}', [HomeController::class, 'destroyProject']);
    Route::post('/admin/home/stats', [HomeController::class, 'storeStat']);
    Route::put('/admin/home/stats/{id}', [HomeController::class, 'updateStat']);
    Route::delete('/admin/home/stats/{id}', [HomeController::class, 'destroyStat']);
    Route::post('/admin/home/hero', [HomeController::class, 'updateHero']);
    Route::put('/admin/home/headers/{key}', [HomeController::class, 'updateSectionHeader']);
    Route::post('/admin/home/cta', [HomeController::class, 'updateCta']);
    Route::post('/admin/home/principles', [HomeController::class, 'storePrinciple']);
    Route::put('/admin/home/principles/{id}', [HomeController::class, 'updatePrinciple']);
    Route::delete('/admin/home/principles/{id}', [HomeController::class, 'destroyPrinciple']);
    Route::post('/admin/home/technologies', [HomeController::class, 'storeTechnology']);
    Route::put('/admin/home/technologies/{id}', [HomeController::class, 'updateTechnology']);
    Route::delete('/admin/home/technologies/{id}', [HomeController::class, 'destroyTechnology']);
    Route::post('/admin/home/system_status', [HomeController::class, 'storeSystemStatus']);
    Route::put('/admin/home/system_status/{id}', [HomeController::class, 'updateSystemStatus']);
    Route::delete('/admin/home/system_status/{id}', [HomeController::class, 'destroySystemStatus']);
    Route::post('/admin/home/partners', [HomeController::class, 'storePartner']);
    Route::put('/admin/home/partners/{id}', [HomeController::class, 'updatePartner']);
    Route::delete('/admin/home/partners/{id}', [HomeController::class, 'destroyPartner']);

    // Rewrite Rule Management
    Route::get('/admin/rewrites', [RewriteController::class, 'index']); // Admin can view rewrites
    Route::post('/admin/rewrites', [RewriteController::class, 'store']);
    Route::put('/admin/rewrites/{id}', [RewriteController::class, 'update']);
    Route::delete('/admin/rewrites/{id}', [RewriteController::class, 'destroy']);

    // Services Page Management
    Route::get('/admin/services', [ServicesController::class, 'index']); // Admin can view services
    Route::post('/admin/services', [ServicesController::class, 'store']);
    Route::put('/admin/services/{id}', [ServicesController::class, 'update']);
    Route::delete('/admin/services/{id}', [ServicesController::class, 'destroy']);

    // Portfolio Management
    Route::get('/admin/portfolio/categories', [PortfolioController::class, 'indexCategories']); // Admin can view all categories
    Route::post('/admin/portfolio/categories', [PortfolioController::class, 'storeCategory']);
    Route::put('/admin/portfolio/categories/{id}', [PortfolioController::class, 'updateCategory']);
    Route::delete('/admin/portfolio/categories/{id}', [PortfolioController::class, 'destroyCategory']);
    Route::get('/admin/portfolio/items', [PortfolioController::class, 'index']); // Admin can view items
    Route::post('/admin/portfolio/items', [PortfolioController::class, 'storeItem']);
    Route::put('/admin/portfolio/items/{id}', [PortfolioController::class, 'updateItem']);
    Route::delete('/admin/portfolio/items/{id}', [PortfolioController::class, 'destroyItem']);

    // Work / Projects Management (completely independent from Portfolio)
    Route::get('/admin/work/header',                [WorkController::class, 'getHeader']);
    Route::put('/admin/work/header',                [WorkController::class, 'updateHeader']);
    Route::get('/admin/work/categories',            [WorkController::class, 'indexCategories']);
    Route::post('/admin/work/categories',           [WorkController::class, 'storeCategory']);
    Route::put('/admin/work/categories/{id}',       [WorkController::class, 'updateCategory']);
    Route::delete('/admin/work/categories/{id}',    [WorkController::class, 'destroyCategory']);
    Route::get('/admin/work/projects',              [WorkController::class, 'indexProjects']);
    Route::post('/admin/work/projects',             [WorkController::class, 'storeProject']);
    Route::put('/admin/work/projects/{id}',         [WorkController::class, 'updateProject']);
    Route::delete('/admin/work/projects/{id}',      [WorkController::class, 'destroyProject']);

    // Pages Management — About
    Route::get('/admin/pages/about', [PagesController::class, 'about']); // Admin can view about page
    Route::put('/admin/pages/about/header', [PagesController::class, 'updateAboutHeader']);
    Route::post('/admin/pages/about/sections', [PagesController::class, 'storeAboutSection']);
    Route::put('/admin/pages/about/sections/{id}', [PagesController::class, 'updateAboutSection']);
    Route::delete('/admin/pages/about/sections/{id}', [PagesController::class, 'destroyAboutSection']);

    // Pages Management — Legal
    Route::get('/admin/pages/legal', [PagesController::class, 'legalIndex']); // Admin can view legal pages
    Route::get('/admin/pages/legal/{type}', [PagesController::class, 'legal']); // Admin can view specific legal page
    Route::put('/admin/pages/legal/{id}', [PagesController::class, 'updateLegalPage']);
    Route::post('/admin/pages/legal/sections', [PagesController::class, 'storeLegalSection']);
    Route::put('/admin/pages/legal/sections/{id}', [PagesController::class, 'updateLegalSection']);
    Route::delete('/admin/pages/legal/sections/{id}', [PagesController::class, 'destroyLegalSection']);

    // ─── DMS & Media Infrastructure ───
    Route::get('/admin/dms/media',                       [DmsController::class, 'index']);
    Route::get('/admin/dms/media/all',                   [DmsController::class, 'all']);
    Route::get('/admin/dms/env-keys',                    [DmsController::class, 'listEnvKeys']);
    Route::post('/admin/dms/media',                      [DmsController::class, 'store']);
    Route::put('/admin/dms/media/{id}',                  [DmsController::class, 'update']);
    Route::delete('/admin/dms/media/{id}',               [DmsController::class, 'destroy']);
    Route::delete('/admin/dms/media/{id}/permanent',     [DmsController::class, 'permanentDestroy']);
    Route::post('/admin/dms/media/{id}/restore',         [DmsController::class, 'restore']);
    Route::get('/admin/dms/media/{id}/logs',             [DmsController::class, 'logs']);
    Route::get('/admin/dms/keys',                        [DmsController::class, 'listKeys']);
    Route::post('/admin/dms/keys',                       [DmsController::class, 'createKey']);
    Route::delete('/admin/dms/keys/{id}',                [DmsController::class, 'revokeKey']);
    Route::get('/admin/dms/providers',                   [DmsController::class, 'listProviders']);
    Route::post('/admin/dms/providers',                  [DmsController::class, 'upsertProvider']);
    Route::delete('/admin/dms/providers/{id}',           [DmsController::class, 'deleteProvider']);

// ─── External Uploads (Requires dms_ key)
Route::post('/dms/uploads', [DmsController::class, 'store'])->middleware(VerifyDmsKeyMiddleware::class);
    Route::get('/admin/contact/submissions', [ContactController::class, 'submissions']);
    Route::get('/admin/contact/template', [ContactController::class, 'getTemplate']);
    Route::put('/admin/contact/submissions/{id}/status', [ContactController::class, 'updateStatus']);
    Route::put('/admin/contact/template/{id}', [ContactController::class, 'updateTemplate']);
    Route::put('/admin/contact/header', [ContactController::class, 'updateHeader']);
    Route::post('/admin/contact/info', [ContactController::class, 'storeDirectInfo']);
    Route::put('/admin/contact/info/{id}', [ContactController::class, 'updateDirectInfo']);
    Route::delete('/admin/contact/info/{id}', [ContactController::class, 'destroyDirectInfo']);
    Route::post('/admin/contact/times', [ContactController::class, 'storeResponseTime']);
    Route::put('/admin/contact/times/{id}', [ContactController::class, 'updateResponseTime']);
    Route::delete('/admin/contact/times/{id}', [ContactController::class, 'destroyResponseTime']);

    // Admin Chat Control
    Route::get('/admin/chat/overview',              [ChatController::class, 'getChatOverview']);
    Route::get('/admin/chat/messages/{request_id}', [ChatController::class, 'getAdminMessages']);
    Route::post('/admin/chat/send/{request_id}',    [ChatController::class, 'adminSendMessage']);
    Route::post('/admin/chat/typing/{request_id}',  [ChatController::class, 'adminSetTyping']);
    Route::delete('/admin/chat/clear/{request_id}', [ChatController::class, 'clearChat']);
    Route::post('/admin/chat/status/{request_id}', [ChatController::class, 'updateRequestStatus']);

    // ─── Email Templates & Sections ───
    Route::get('/admin/email/templates',           [EmailTemplateController::class, 'index']);
    Route::get('/admin/email/templates/{id}',      [EmailTemplateController::class, 'show']);
    Route::post('/admin/email/templates',          [EmailTemplateController::class, 'store']);
    Route::put('/admin/email/templates/{id}',       [EmailTemplateController::class, 'update']);
    Route::delete('/admin/email/templates/{id}',    [EmailTemplateController::class, 'destroy']);
    Route::post('/admin/email/sections',           [EmailTemplateController::class, 'storeSection']);
    Route::put('/admin/email/sections/{id}',       [EmailTemplateController::class, 'updateSection']);
    Route::delete('/admin/email/sections/{id}',    [EmailTemplateController::class, 'destroySection']);
    Route::get('/admin/email/templates/preview/{id}', [EmailTemplateController::class, 'preview']);

    // SMTP SETTINGS
    Route::get('/admin/smtp/settings', [SmtpController::class, 'getSettings']);
    Route::put('/admin/smtp/settings', [SmtpController::class, 'updateSettings']);
    Route::post('/admin/smtp/test',    [SmtpController::class, 'testSmtp']);

    // ─── Section Visibility Control ───
    Route::get('/admin/sections',  [SectionController::class, 'index']);
    Route::post('/admin/sections', [SectionController::class, 'upsert']);
});

// Super Admin ONLY Routes (Hierarchy check)
Route::middleware([AdminAuthMiddleware::class, DemoModeMiddleware::class, AdminRoleMiddleware::class . ':superadmin'])->group(function () {
    // Management of other admin accounts
    Route::get('/admin/list',       [AdminAuthController::class, 'listAdmins']);
    Route::post('/admin/create',    [AdminAuthController::class, 'createAdmin']);
    Route::put('/admin/update/{id}', [AdminAuthController::class, 'updateAdmin']);
    Route::delete('/admin/delete/{id}', [AdminAuthController::class, 'deleteAdmin']);

    // Management of registered frontend users
    Route::get('/admin/users/registered', [AdminAuthController::class, 'registeredUsers']);
    Route::post('/admin/users/verify/{id}', [AdminAuthController::class, 'verifyUser']);
    Route::post('/admin/users/toggle-ban/{id}', [AdminAuthController::class, 'toggleBanUser']);
    Route::post('/admin/users/create', [AdminAuthController::class, 'createFrontendUser']);

    // Sensitive DB settings or other system configs
    Route::get('/admin/system/status', function() {
        return response()->json(['success' => true, 'status' => 'System Online']);
    });

    // ─── Role Permissions (Admin/Demo access matrix) ───
    Route::get('/admin/permissions',          [PermissionController::class, 'index']);
    Route::post('/admin/permissions/bulk',    [PermissionController::class, 'bulkUpsert']);
    Route::post('/admin/permissions/reset',   [PermissionController::class, 'reset']);

    // ─── Custom Role Management (Super Admin ONLY) ───
    Route::get('/admin/roles',                [PermissionController::class, 'listRoles']);
    Route::post('/admin/roles',               [PermissionController::class, 'upsertRole']);
    Route::delete('/admin/roles/{id}',        [PermissionController::class, 'deleteRole']);

    // ─── System Connection Settings ───
    Route::get('/admin/system/connections', [SystemSettingsController::class, 'index']);
    Route::put('/admin/system/connections', [SystemSettingsController::class, 'update']);
});

/*
|--------------------------------------------------------------------------
| Public App Routes (Public Fetching)
|--------------------------------------------------------------------------
| These routes are for public-facing content that requires an API key
| for fetching, but not necessarily user authentication.
*/
Route::middleware([VerifyAppKeyMiddleware::class])->group(function () {
    // Nav API Routes (Read-only for public)
    Route::get('/nav', [NavController::class, 'index']);

    // Footer API Routes (Read-only for public)
    Route::get('/footer', [FooterController::class, 'index']);

    // Home API Routes (Read-only for public)
    Route::get('/home', [HomeController::class, 'index']);

    // Work API Routes (Read-only for public)
    Route::get('/work', [WorkController::class, 'index']);

    // Services API Routes (Read-only for public)
    Route::get('/services', [ServicesController::class, 'index']);
    Route::put('/pages/about/sections/{id}', [PagesController::class, 'updateAboutSection']);
    Route::delete('/pages/about/sections/{id}', [PagesController::class, 'destroyAboutSection']);

    // Pages CRUD — Legal
    Route::put('/pages/legal/{id}', [PagesController::class, 'updateLegalPage']);
    Route::post('/pages/legal/sections', [PagesController::class, 'storeLegalSection']);
    Route::put('/pages/legal/sections/{id}', [PagesController::class, 'updateLegalSection']);
    Route::delete('/pages/legal/sections/{id}', [PagesController::class, 'destroyLegalSection']);

});
