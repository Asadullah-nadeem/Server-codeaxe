<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NavController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\WorkController;
use App\Http\Controllers\Api\RewriteController;
use App\Http\Middleware\VerifyAppKeyMiddleware;

// Public route — called server-side by next.config.ts at startup (no API key needed)
Route::get('/rewrites', [RewriteController::class, 'index']);

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
});
