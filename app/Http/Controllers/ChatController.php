<?php

namespace App\Http\Controllers;

use App\Models\ExamFile;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{

    public function show(int $id)
    {
        $examFile = ExamFile::findOrFail($id);

        return Inertia::render('Chat/ChatPage', [
            'exam_file' => $examFile,
            'messages' => Message::with('sender')
                ->where('exam_file_id', $examFile->id)
                ->orderBy('created_at', 'desc')
                ->paginate(7)
                ->items()

        ]);
    }

    public function update(int $id, Request $request)
    {
        $examFile = ExamFile::findOrFail($id);

        $request->validate([
            'content' => 'required|string|max:1000'
        ], ['content.required' => 'You haven\'t type anything', 'content.max' => 'max text length']);

        $sender_id = Auth::id();
        $content = $request->input('content');

        Message::create([
            'exam_file_id' => $examFile->id,
            'sender_id' => $sender_id,
            'is_gaia' => false,
            'content' => $content
        ]);

        return back();
    }
}
