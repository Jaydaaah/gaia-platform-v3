<?php

use App\Models\ExamFile;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-window.{exam_file_id}', function ($user, $exam_file_id) {
    return ExamFile::where('id', $exam_file_id)->exists();
});

Broadcast::channel('chat-window.{exam_file_id}.{id}', function ($user, $exam_file_id, $id) {
    return ExamFile::where('id', $exam_file_id)->exists() && $user->id == $id;
});
