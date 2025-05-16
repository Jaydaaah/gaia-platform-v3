<?php

namespace App\Jobs;

use App\Events\GAIAResponse;
use App\Events\GAIAStatus;
use App\Events\UserMessageSent;
use App\Instructions\GAIAInstruct;
use App\Models\ExamFile;
use App\Models\ExamNotes;
use App\Models\Message;
use App\Models\User;
use Gemini\Data\Content;
use Gemini\Enums\Role;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessPromptJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamFile $exam_file, public Message $message)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = User::find($this->message->sender_id);
        $exam_file_id = $this->exam_file->id;
        $bot = $this->exam_file->exam_bot;

        $messages = $this->exam_file->message()
            ->whereNot('id', $this->message->id)
            ->orderBy('created_at', 'desc')
            ->limit(25)
            ->get()
            ->reverse();

        $notes = ExamNotes::where('exam_file_id', $exam_file_id)
            ->where('owner_id', $user->id)->first();
        $notes_content = $notes->content ?? "";

        $history = $messages->map(function ($message) {
            $role = null;
            $part = '';

            if (!$message->is_gaia) {
                $name = $message->sender->name;
                $part = "$name: " . $message->content;
                $role = Role::USER;
            } else {
                $part = $message->content;
                $role = Role::MODEL;
            }

            return Content::parse(part: $part, role: $role);
        })->all();

        $this->message->update(['responded' => true]);


        broadcast(new GAIAStatus($exam_file_id, $user->id, "typing"));

        $content = $this->message->content;

        $model = Gemini::generativeModel('models/gemini-1.5-flash');
        $chat = $model->startChat(history: $history);

        $prompt = str_replace(
            ["{{instruction}}", "{{prompt}}", "{{bot_name}}", "{{student_note}}", "{{student_name}}"],
            [$this->exam_file->context->instruction, $content, $bot->name, $notes_content, $user->name],
            GAIAInstruct::PROMPT_INSTRUCTION,
        );
        $response = $chat->sendMessage($prompt);
        $response_text = $response->text();

        Log::info("GAIA said $response_text");

        $prompt = str_replace("{input_text}", $response_text, GAIAInstruct::POST_INSTRUCTION);
        $post_response = $chat->sendMessage($prompt);
        $post_response_text = $post_response->text();
        Log::info("GAIA converted $post_response_text");

        $this->exam_file->message()->create([
            'sender_id' => null,
            'content' => $post_response_text,
            'is_gaia' => true,
            'responded' => true,
            'reply_to' => $this->message->id
        ]);

        broadcast(new GAIAResponse($exam_file_id, $user->id, $post_response_text));
        broadcast(new GAIAStatus($exam_file_id, $user->id, "responded"));
        broadcast(new UserMessageSent($exam_file_id, $user->id));
    }
}
