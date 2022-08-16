<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getCurrentUser']);
    Route::get('/posts', [PostController::class, 'getPosts']);
    Route::get('/ranks', [PostController::class, 'getRank']);
    Route::get('/comments/{post_id}', [PostController::class, 'getPostComment']);
    Route::post('/add-comment/{post_id}', [PostController::class, 'addPostComment']);
    Route::get('/like-post/{post_id}', [PostController::class, 'likePost']); 
    Route::get('/like-comment/{comment_id}', [PostController::class, 'likeComment']);
    Route::get('/num-likes-comments/{post_id}', [PostController::class, 'getNumLikesComments']);
    Route::get('/images', [PostController::class, 'getImages']);

    Route::get('/my-posts', [PostController::class, 'myPost']);
    Route::post('/add-post', [PostController::class, 'addPost']);
    Route::get('/delete-post/{post_id}', [PostController::class, 'deletePost']);
    Route::post('/update-post/{post_id}', [PostController::class, 'updatePost']);

    //search
    Route::post('/search', [PostController::class, 'search']);
});

