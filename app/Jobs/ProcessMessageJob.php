<?php

namespace App\Jobs;

use App\Events\GAIAResponse;
use App\Events\GAIAStatus;
use App\Instructions\GAIAInstruct;
use App\Models\ExamFile;
use App\Models\Message;
use Gemini\Data\Content;
use Gemini\Enums\Role;
use Gemini\Laravel\Facades\Gemini;
use Gemini\Resources\ChatSession;
use Gemini\Resources\GenerativeModel;
use Illuminate\Cache\Lock;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProcessMessageJob implements ShouldQueue
{
    use Queueable;

    // private string $instruction;
    // private GenerativeModel $model;
    // private ChatSession $chat;

    /**
     * Create a new job instance.
     */
    public function __construct(public ExamFile $exam_file, private string $lockKey, private string $lockOwner)
    {
        // $this->instruction = $exam_file->context->instruction;

        // $messages = $exam_file->message()
        //     ->orderBy('created_at', 'desc')
        //     ->limit(25)
        //     ->get()
        //     ->reverse();

        // $history = $messages->map(function ($message) {
        //     $role = null;
        //     $part = '';

        //     if (!$message->is_gaia) {
        //         $name = $message->sender->name;
        //         $part = "$name: " . $message->content;
        //         $role = Role::USER;
        //     } else {
        //         $part = $message->content;
        //         $role = Role::MODEL;
        //     }

        //     return Content::parse(part: $part, role: $role);
        // })->all();


        // $this->model = Gemini::generativeModel('models/gemini-1.5-flash');
    }

    // private function getProgress()
    // {
    //     $past_response = $this->exam_file->message()
    //         ->where('is_gaia', true)
    //         ->orderBy('created_at', 'desc')
    //         ->limit(20)
    //         ->get()
    //         ->reverse()
    //         ->pluck('content')
    //         ->implode("\n");
    //     $prompt = str_replace(['{{OUTLINE}}', '{{PAST_RESPONSES}}'], [$this->instruction, $past_response], GAIAInstruct::PROGRESS_INSTRUCTION);
    //     $response = $this->model->generateContent($prompt);
    //     return $response->text();
    // }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $exam_file_id = $this->exam_file->id;

        $messages = $this->exam_file->message()
            ->orderBy('created_at', 'desc')
            ->limit(25)
            ->get()
            ->reverse();

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

        $unresponded = $this->exam_file->message()
            ->where('responded', false)
            ->get();

        $unresponded_array = $unresponded->values()->map(function ($message, $index) {
            $part = '';

            if (!$message->is_gaia) {
                $name = $message->sender->name;
                $part = ($index + 1) . ". $name: ";
            }

            return $part;
        });

        $imploded_unresponded = $unresponded_array->implode("\n");

        $this->exam_file->message()
            ->where('responded', false)
            ->update(['responded' => true]);

        // broadcast(new GAIAStatus($exam_file_id, "typing"));

        $model = Gemini::generativeModel('models/gemini-1.5-flash');
        $chat = $model->startChat(history: $history);

        // $instruction = str_replace(["{{OUTLINE}}"], $this->exam_file->context->instruction, GAIAInstruct::PROGRESS_INSTRUCTION);
        // $chat->sendMessage($instruction);
        $prompt = str_replace(["{{instruction}}", "{{prompt}}"], [$this->exam_file->context->instruction, $imploded_unresponded], GAIAInstruct::PROMPT_INSTRUCTION);
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
        ]);


        broadcast(new GAIAResponse($exam_file_id, $post_response_text));
        // broadcast(new GAIAStatus($exam_file_id, "responded"));

        Cache::restoreLock($this->lockKey, $this->lockOwner)->release();
    }
}
