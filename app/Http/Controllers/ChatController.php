<?php

namespace App\Http\Controllers;

use App\Events\GAIAStatus;
use App\Events\UserMessageSent;
use App\Jobs\ProcessMessageJob;
use App\Jobs\ProcessPromptJob;
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
        $examFile = ExamFile::with('shareable')->findOrFail($id);

        $request->validate([
            'user_context' => 'nullable|exists:users,id'
        ]);

        $user = User::find(Auth::id());
        $user_context = $request->input('user_context');

        abort_unless(
            $examFile->owner_id == $user->id ||
                $examFile->shareable->contains('id', $user->id),
            401
        );

        $bot_name = $examFile->exam_bot->name;
        $subject = $examFile->subject;
        $bot_last_message_content = "Hello Students, I am $bot_name \nOur topic for today is '$subject'";
        $bot_last_message = Message::with('reply_to.sender')
            ->where('exam_file_id', $examFile->id)
            ->where('is_gaia', true)
            ->whereHas('reply_to', function ($q) use ($user) {
                $q->where('sender_id', $user->id);
            })
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
                            $subQuery->whereHas('reply_to', function ($q) use ($user_context) {
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
                ->whereNull('reply_to')
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
                    return ExamNotes::with('owner')
                        ->when(!!$user_context, fn($q) => $q->where('owner_id', $user_context))
                        ->when(!$user_context, fn($q) => $q->where('owner_id', $user->id))
                        ->first();
                }
            ),
            'user_context' => $user_context,
            'read_only' => !!$user_context && $user_context != $user->id,
            'is_owner' => $user->id == $examFile->owner_id,
            'other_users' => Inertia::defer(fn() => User::where('id', '!=', $examFile->owner_id)->get())
        ]);
    }

    public function update(int $id, Request $request)
    {
        $examFile = ExamFile::findOrFail($id);

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'user_context' => 'nullable|exists:users,id',
        ], [
            'content.required' => 'You haven\'t typed anything',
            'content.max' => 'Max text length exceeded',
        ]);

        $sender_id = Auth::id();
        $content = $validated['content'];
        $user_context = $validated['user_context'] ?? null;

        $messageData = [
            'exam_file_id' => $examFile->id,
            'sender_id' => $sender_id,
            'is_gaia' => false,
            'content' => $content,
            'responded' => false,
        ];

        // Attach reply_to if user_context is provided and a matching message exists
        if ($user_context && $sender_id != $user_context) {
            $replyToMessage = Message::with(['sender', 'reply_from.sender'])
                ->where('exam_file_id', $examFile->id)
                ->where('sender_id', $user_context)
                ->latest()
                ->first();

            if ($replyToMessage) {
                $messageData['reply_to'] = $replyToMessage->id;
            }
        }

        $message = Message::create($messageData);

        broadcast(new UserMessageSent($examFile->id, $sender_id));

        if (!$user_context || $sender_id == $user_context) {
            broadcast(new GAIAStatus($examFile->id, $sender_id, "listening"));
            ProcessPromptJob::dispatch($examFile, $message);
        }

        return back();
    }
}
