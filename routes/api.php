<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MotorcycleController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/catalog', [PostController::class, 'get_catalog']);
Route::get('/motorcycles', [MotorcycleController::class, 'index']);
Route::get('/posts/{post_id}', [PostController::class, 'get_post']);
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/ownposts', [PostController::class, 'get_own_posts']);
    Route::get('/posts', [PostController::class, 'get_posts']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::delete('/posts/{post_id}', [PostController::class, 'destroy']);
    Route::put('/posts/{post_id}', [PostController::class, 'update']);
    Route::post('/posts/{post_id}/change', [PostController::class, 'change_status']);

    Route::post('/posts/{post_id}/images', [PostController::class, 'store_post_image']);
    Route::delete('/images/{image_id}', [PostController::class, 'destroy_post_image']);

    Route::get('/profile', [UserController::class, 'index']);
    Route::put('/profile', [UserController::class, 'update']);

    Route::post('/motorcycles', [MotorcycleController::class, 'store']);
    Route::put('/motorcycles/{motorcycle_id}', [MotorcycleController::class, 'update']);
    Route::delete('/motorcycles/{motorcycle_id}', [MotorcycleController::class, 'destroy']);
});