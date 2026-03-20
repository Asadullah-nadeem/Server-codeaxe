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
use App\Http\Middleware\VerifyAppKeyMiddleware;
use App\Http\Middleware\AuthUserMiddleware;

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

// Dashboard (Protected by User Token)
Route::middleware([AuthUserMiddleware::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/dashboard/request', [DashboardController::class, 'storeRequest']);
});

// Send Request UI (Public or semi-public to get text)
Route::get('/dashboard/request/ui', [DashboardController::class, 'requestUi']);

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
