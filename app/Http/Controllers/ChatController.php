<?php

namespace App\Http\Controllers;

use App\Events\GAIAStatus;
use App\Events\UserMessageSent;
use App\Jobs\ProcessMessageJob;
use App\Models\ExamFile;
use App\Models\Message;
use App\Models\User;
use Gemini\Enums\ModelType;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ChatController extends Controller
{

    public function show(int $id)
    {
        $examFile = ExamFile::findOrFail($id);

        $user = User::find(Auth::id());
        // $result = Gemini::generativeModel('models/gemini-1.5-flash')->generateContent('Hello');
        // $text = $result->text();

        return Inertia::render('Chat/ChatPage', [
            'exam_file' => $examFile,
            'bot_name' => $examFile->exam_bot->name,
            'bot_last_message_content' => Message::where('exam_file_id', $examFile->id)
                ->where('is_gaia', true)
                ->orderBy('created_at', 'desc')
                ->first()
                ->content,
            'messages' => Message::with('sender')
                ->where('exam_file_id', $examFile->id)
                ->where('is_gaia', false)
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->items(),
            'note' => Inertia::defer(fn() => $user->notes()->where('exam_file_id', $examFile->id)->first())
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

        $message = Message::create([
            'exam_file_id' => $examFile->id,
            'sender_id' => $sender_id,
            'is_gaia' => false,
            'content' => $content
        ]);

        broadcast(new UserMessageSent($examFile->id, $sender_id));

        $lockKey = "process_messages_lock_{$examFile->id}";
        $lock = Cache::lock($lockKey, 10);

        if ($lock->get()) {
            broadcast(new GAIAStatus($examFile->id, "listening"));
            ProcessMessageJob::dispatch($examFile, $lockKey, $lock->owner())
                ->delay(now()->addSeconds(5));
        }


        return back();
    }
}
