<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExamNoteController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShareableController;
use App\Http\Controllers\UnrealSpeechController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::group([], function () {
    Route::get('/retrieve-message', [MessageController::class, 'retrieve_message']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('/dashboard', DashboardController::class)->names('dashboard');
    Route::resource('/file-upload', FileUploadController::class)->names('file-upload');
    Route::get('/file-download/{exam_id}', [FileUploadController::class, 'download'])->name('file-download');

    Route::resource('chat', ChatController::class)->names('chat');
    Route::resource('chat/notes', ExamNoteController::class)->names('chat.notes');
    Route::resource('chat/share', ShareableController::class)->names('chat.share');

    Route::post('/unreal-speech', [UnrealSpeechController::class, 'synthesize'])->name('speech.synthesize');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
