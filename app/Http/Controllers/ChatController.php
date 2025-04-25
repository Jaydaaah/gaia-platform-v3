<?php

namespace App\Http\Controllers;

use App\Events\GAIAStatus;
use App\Events\UserMessageSent;
use App\Jobs\ProcessMessageJob;
use App\Models\ExamFile;
use App\Models\ExamNotes;
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

    public function show(int $id, Request $request)
    {
        $examFile = ExamFile::findOrFail($id);
        $request->validate([
            'user_context' => 'nullable|exists:users,id'
        ]);

        $user_context = $request->input('user_context');

        $user = User::find(Auth::id());
        // $result = Gemini::generativeModel('models/gemini-1.5-flash')->generateContent('Hello');
        // $text = $result->text();

        $bot_name = $examFile->exam_bot->name;
        $subject = $examFile->subject;
        $bot_last_message_content = "Hello Students, I am $bot_name \nOur topic for today is '$subject'";
        $bot_last_message = Message::where('exam_file_id', $examFile->id)
            ->where('is_gaia', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($bot_last_message) {
            $bot_last_message_content = $bot_last_message->content;
        }

        $messages = null;
        if ($user_context) {
            $messages = Message::with(['sender', 'reply_to.sender'])
                ->where('exam_file_id', $examFile->id)
                ->where(function ($query) use ($user_context) {
                    $query->where('sender_id', $user_context)
                        ->orWhere(function ($subQuery) use ($user_context) {
                            $subQuery->where('is_gaia', 1)
                                ->whereHas('reply_to', function ($q) use ($user_context) {
                                    $q->where('sender_id', $user_context);
                                });
                        });
                })
                ->orderBy('created_at', 'desc')
                ->paginate(20)
                ->items();
        } else {
            $messages = Message::with(['sender', 'reply_from.sender'])
                ->where('exam_file_id', $examFile->id)
                ->where('is_gaia', false)
                ->orderBy('created_at', 'desc')
                ->paginate(20)
                ->items();
        }


        return Inertia::render('Chat/ChatPage', [
            'exam_file' => $examFile,
            'bot_name' => $bot_name,
            'bot_last_message_content' => $bot_last_message_content,
            'messages' => $messages,
            'note' => Inertia::defer(
                function () use ($user_context, $user) {
                    return ExamNotes::query()
                        ->when(!!$user_context, fn($q) => $q->where('owner_id', $user_context))
                        ->when(!$user_context, fn($q) => $q->where('owner_id', $user->id))
                        ->first();
                }
            ),
            'user_context' => $user_context,
            'read_only' => !!$user_context
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
            'content' => $content,
            'responded' => false
        ]);

        broadcast(new UserMessageSent($examFile->id, $sender_id));

        // $lockKey = "process_messages_lock_{$examFile->id}";
        // $lock = Cache::lock($lockKey, 10);

        // if ($lock->get()) {
        //     broadcast(new GAIAStatus($examFile->id, "listening"));
        //     ProcessMessageJob::dispatch($examFile, $lockKey, $lock->owner())
        //         ->delay(now()->addSeconds(5));
        // }


        return back();
    }
}
