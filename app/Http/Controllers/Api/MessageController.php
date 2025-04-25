<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamFile;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function retrieve_message(Request $request)
    {
        $request->validate([
            'exam_file_id' => 'required|exists:exam_files,id'
        ]);

        $exam_file = ExamFile::findOrFail($request->exam_file_id);

        $messages = $exam_file->message()
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get()
            ->reverse();

        $history = $messages->map(function ($message) {
            $name = "AI";
            $content = $message->content;

            if (!$message->is_gaia && $message->sender) {
                $name = $message->sender->name;
            }

            return "$name: $content";
        })->all();

        $history_text = implode("\n", $history);

        return $history_text;
    }
}
